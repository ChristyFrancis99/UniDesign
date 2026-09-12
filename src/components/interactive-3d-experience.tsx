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
    <div className="flex h-screen w-full items-center justify-center bg-[#f4f1eb] px-6 text-[#242424]">
      <div className="max-w-xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b99b4b]">
          3D render unavailable
        </p>
        <h1 className="mt-4 text-2xl font-medium tracking-tight">
          The interior model could not be loaded.
        </h1>
        <p className="mt-4 text-sm leading-6 text-black/55">{message}</p>
        <p className="mt-5 break-all font-mono text-[11px] text-black/35">
          {MODEL_URL}
        </p>
      </div>
    </div>
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
          message={
            this.state.error.message ||
            "Check that the GLB exists and that VITE_INTERIOR_MODEL_URL points to a reachable file."
          }
        />
      );
    }
    return this.props.children;
  }
}

function getVisibleModelBounds(scene: THREE.Object3D) {
  const box = new THREE.Box3();
  const meshBox = new THREE.Box3();
  const position = new THREE.Vector3();

  scene.updateMatrixWorld(true);

  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !object.visible || !object.geometry) return;

    const geometry = object.geometry;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    if (!geometry.boundingBox) return;

    meshBox.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld);
    box.union(meshBox);
  });

  if (box.isEmpty()) return null;
  box.getCenter(position);
  return { box, center: position };
}

function InteriorModel() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera, invalidate } = useThree();
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // The supplied GLB contains a large panorama/background scene. Hide only
    // those known background objects before calculating the interior bounds.
    scene.traverse((object) => {
      const name = object.name.toLowerCase();
      if (name.includes("panorama") || name.includes("sendai") || name.includes("360")) {
        object.visible = false;
      }
    });

    // IMPORTANT: Box3.setFromObject(scene) can still include hidden panorama
    // geometry. Build the bounds from visible meshes only so the room is not
    // scaled down to an invisible point.
    const bounds = getVisibleModelBounds(scene);
    if (!bounds) {
      setModelError("The GLB contains no visible interior geometry.");
      return;
    }

    const size = new THREE.Vector3();
    bounds.box.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
      setModelError("The GLB contains invalid interior geometry bounds.");
      return;
    }

    setModelError(null);

    // Normalize only the actual visible interior into a predictable volume.
    const targetSize = 8;
    const scale = targetSize / maxDimension;
    group.scale.setScalar(scale);
    group.position.set(
      -bounds.center.x * scale,
      -bounds.center.y * scale,
      -bounds.center.z * scale,
    );

    const normalizedSize = size.clone().multiplyScalar(scale);
    const normalizedHeight = Math.max(normalizedSize.y, 2);
    const eyeHeight = Math.max(0.35, normalizedHeight * 0.38);
    const targetY = -normalizedHeight / 2 + eyeHeight;
    const distance = Math.max(normalizedSize.x, normalizedSize.z, 4) * 0.8;

    camera.position.set(distance, targetY + normalizedHeight * 0.08, distance);
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
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
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
