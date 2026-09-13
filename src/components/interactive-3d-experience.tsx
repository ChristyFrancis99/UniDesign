import { Component, Fragment, Suspense, useEffect, useMemo, useRef, useState } from "react";
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

function ModelLoadErrorContent({ message }: { message: string }) {
  return (
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
  );
}

function ModelLoadError({ message }: { message: string }) {
  return (
    <Html fullscreen>
      <ModelLoadErrorContent message={message} />
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
        <ModelLoadErrorContent
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
    if (!(object instanceof THREE.Mesh) || !object.geometry) return;

    const name = object.name.toLowerCase();
    if (
      name.includes("panorama") ||
      name.includes("sendai") ||
      name.includes("360") ||
      name === "plane"
    ) {
      object.visible = false;
      return;
    }

    if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
    if (!object.geometry.boundingBox) return;

    meshBox.copy(object.geometry.boundingBox).applyMatrix4(object.matrixWorld);
    meshBox.getCenter(meshCenter);
    meshBox.getSize(meshSize);

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

  const { transform, error } = useMemo(() => {
    try {
      const bounds = getVisibleModelBounds(scene);

      if (!bounds) {
        return {
          transform: null,
          error: "The GLB contains no visible interior geometry.",
        };
      }

      const size = new THREE.Vector3();
      bounds.box.getSize(size);
      const maxDimension = Math.max(size.x, size.y, size.z);

      if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
        return {
          transform: null,
          error: "The GLB contains invalid geometry bounds.",
        };
      }

      const targetSize = 8;
      const scale = targetSize / maxDimension;

      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.castShadow = true;
        object.receiveShadow = true;

        const name = object.name.toLowerCase();
        if (
          name.includes("curtain") ||
          name.includes("rug") ||
          name.includes("sheet") ||
          name.includes("plaid") ||
          name.includes("leaf") ||
          name.includes("leaves")
        ) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => {
            if (material) material.side = THREE.DoubleSide;
          });
        }
      });

      return {
        transform: {
          scale,
          position: [
            -bounds.center.x * scale,
            -bounds.center.y * scale,
            -bounds.center.z * scale,
          ] as [number, number, number],
          size: size.clone().multiplyScalar(scale),
        },
        error: null,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to process 3D model bounds.";
      return { transform: null, error: message };
    }
  }, [scene]);

  useEffect(() => {
    if (!transform) return;

    const { size } = transform;
    const distanceX = size.x * 0.75;
    const distanceY = size.y * 0.45;
    const distanceZ = size.z * 0.85;

    camera.position.set(distanceX, distanceY, distanceZ);
    camera.near = 0.1;
    camera.far = 200;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.minDistance = 0.5;
      controlsRef.current.maxDistance = 35;
      controlsRef.current.update();
    }

    invalidate();
  }, [camera, invalidate, transform]);

  if (error || !transform) {
    return <ModelLoadError message={error || "Failed to load model."} />;
  }

  return (
    <Fragment>
      <group scale={transform.scale} position={transform.position}>
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
        maxPolarAngle={Math.PI / 2 + 0.1}
      />
    </Fragment>
  );
}

export function Interactive3DExperience() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center bg-[#f4f1eb] text-[#242424]"
        aria-label="Loading 3D interior render"
      >
        <div className="w-[min(320px,80vw)] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">
            Preparing render
          </p>
          <div className="mt-5 h-px w-full bg-black/10">
            <div className="h-full w-1/3 bg-[#b99b4b] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ModelErrorBoundary>
      <div
        id="3d-space"
        className="relative h-screen w-full overflow-hidden bg-[#f4f1eb]"
        aria-label="Interactive 3D interior render"
      >
        <Canvas
          camera={{ position: [6, 3, 6], fov: 55, near: 0.1, far: 200 }}
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
            shadow-mapSize={[2048, 2048]}
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


