import { Component, Fragment, Suspense, useEffect, useRef, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const MODEL_URL =
  import.meta.env.VITE_INTERIOR_MODEL_URL?.trim() ||
  "/models/interior-room.glb";

function LoadingScreen() {
  const { progress, active } = useProgress();
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center bg-[#f4f1eb] text-[#242424]">
        <div className="w-[min(320px,80vw)] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">
            {active ? "Loading render" : "Preparing render"}
          </p>
          <div className="mt-5 h-px w-full bg-black/10">
            <div
              className="h-full bg-[#b99b4b] transition-[width] duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="mt-3 text-[11px] tracking-[0.12em] text-black/45">
            {Math.round(percentage)}%
          </p>
        </div>
      </div>
    </Html>
  );
}

function ModelLoadError({ message }: { message: string }) {
  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center bg-[#f4f1eb] px-6 text-[#242424]">
        <div className="max-w-xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b99b4b]">
            3D render unavailable
          </p>
          <h1 className="mt-4 text-2xl font-medium tracking-tight">
            The interior model could not be displayed.
          </h1>
          <p className="mt-4 text-sm leading-6 text-black/55">{message}</p>
          <p className="mt-5 break-all font-mono text-[11px] text-black/35">
            {MODEL_URL}
          </p>
        </div>
      </div>
    </Html>
  );
}

class ModelErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D interior render failed", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <ModelLoadError
          message={this.state.error.message || "The 3D viewer failed to render."}
        />
      );
    }
    return this.props.children;
  }
}

function getVisibleModelBounds(scene: THREE.Object3D) {
  const box = new THREE.Box3();
  const meshBox = new THREE.Box3();
  const meshCenter = new THREE.Vector3();
  const meshSize = new THREE.Vector3();
  const center = new THREE.Vector3();

  scene.updateMatrixWorld(true);

  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !object.visible || !object.geometry) return;

    const name = object.name.toLowerCase();
    if (name.includes("panorama") || name.includes("sendai") || name.includes("360")) {
      object.visible = false;
      return;
    }

    if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
    if (!object.geometry.boundingBox) return;

    meshBox.copy(object.geometry.boundingBox).applyMatrix4(object.matrixWorld);
    meshBox.getCenter(meshCenter);
    meshBox.getSize(meshSize);

    // The GLB contains several unrelated imported assets with transforms
    // hundreds/thousands of units away from the actual room. They were making
    // the old bounding box enormous, which reduced the room to an invisible
    // speck. Keep geometry that belongs to the main room-sized scene and hide
    // obvious outliers before calculating the camera frame.
    const centerDistance = meshCenter.length();
    const maxDimension = Math.max(meshSize.x, meshSize.y, meshSize.z);
    if (centerDistance > 20 || maxDimension > 20) {
      object.visible = false;
      return;
    }

    box.union(meshBox);
  });

  if (box.isEmpty()) return null;
  box.getCenter(center);
  return { box, center };
}

function InteriorModel() {
  const { scene } = useGLTF(MODEL_URL);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera, invalidate } = useThree();
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    const bounds = getVisibleModelBounds(scene);

    if (!bounds) {
      setModelError("The GLB contains no visible interior geometry.");
      return;
    }

    const size = new THREE.Vector3();
    bounds.box.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
      setModelError("The GLB contains invalid geometry bounds.");
      return;
    }

    setModelError(null);

    const targetSize = 8;
    const scale = targetSize / maxDimension;
    scene.scale.setScalar(scale);
    scene.position.set(
      -bounds.center.x * scale,
      -bounds.center.y * scale,
      -bounds.center.z * scale,
    );
    scene.updateMatrixWorld(true);

    const normalizedSize = size.clone().multiplyScalar(scale);
    const normalizedHeight = Math.max(normalizedSize.y, 2);
    const targetY = -normalizedHeight / 2 + normalizedHeight * 0.38;
    const distance = Math.max(normalizedSize.x, normalizedSize.z, 4) * 0.85;

    camera.position.set(distance, targetY + normalizedHeight * 0.12, distance);
    camera.near = 0.01;
    camera.far = 200;
    camera.lookAt(0, targetY, 0);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, targetY, 0);
      controlsRef.current.minDistance = 0.5;
      controlsRef.current.maxDistance = 30;
      controlsRef.current.update();
    }

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      materials.forEach((material) => {
        if (material) material.side = THREE.DoubleSide;
      });
    });

    invalidate();
  }, [camera, invalidate, scene]);

  if (modelError) return <ModelLoadError message={modelError} />;

  return (
    <Fragment>
      <primitive object={scene} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        screenSpacePanning
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI - 0.05}
      />
    </Fragment>
  );
}

export function Interactive3DExperience() {
  return (
    <ModelErrorBoundary>
      <div
        id="3d-space"
        className="relative h-screen w-full overflow-hidden bg-[#f4f1eb]"
        aria-label="Interactive 3D interior render"
      >
        <Canvas
          camera={{ position: [6, 3, 6], fov: 55, near: 0.01, far: 200 }}
          dpr={[1, 1.5]}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor("#f4f1eb", 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.25;
          }}
        >
          <hemisphereLight args={["#fffdf8", "#5e574d", 2.6]} />
          <ambientLight intensity={1.5} />
          <directionalLight
            castShadow
            position={[4, 8, 5]}
            intensity={4.5}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-4, 4, -3]} intensity={2.2} />
          <directionalLight position={[2, 3, 7]} intensity={1.5} />
          <Suspense fallback={<LoadingScreen />}>
            <InteriorModel />
          </Suspense>
        </Canvas>
      </div>
    </ModelErrorBoundary>
  );
}

useGLTF.preload(MODEL_URL);
