import { Component, Suspense, useEffect, useRef } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL =
  import.meta.env.VITE_INTERIOR_MODEL_URL?.trim() ||
  "/models/interior-room.glb";

function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center bg-[#252525] text-white">
        <div className="w-64 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d4af37]">
            Loading render
          </p>
          <div className="mx-auto mt-5 h-px w-full bg-white/15">
            <div
              className="h-full bg-[#d4af37] transition-all duration-300"
              style={{ width: `${Math.max(3, progress)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-white/50">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}

function InteriorModel() {
  const { scene } = useGLTF(MODEL_URL);
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (!Number.isFinite(maxDimension) || maxDimension <= 0) return;

    // Center the render at the origin so the camera can always find it.
    scene.position.sub(center);

    const distance = maxDimension * 1.35;
    camera.position.set(distance * 0.85, distance * 0.55, distance);
    camera.near = Math.max(maxDimension / 10000, 0.001);
    camera.far = Math.max(maxDimension * 100, 1000);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [camera, scene]);

  return (
    <>
      <primitive object={scene} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        minDistance={0.01}
        maxDistance={100000}
      />
    </>
  );
}

useGLTF.preload(MODEL_URL);

class ModelErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D model failed to render:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#252525] px-6 text-white">
          <div className="max-w-xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d4af37]">
              Render could not load
            </p>
            <p className="mt-5 text-sm leading-7 text-white/60">
              The 3D file could not be opened by the browser. Check that
              public/models/interior-room.glb exists and that the file is a
              valid GLB.
            </p>
            <p className="mt-4 break-all text-xs text-white/35">
              {this.state.error.message}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function Interactive3DExperience() {
  return (
    <div
      id="3d-space"
      className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#252525]"
      aria-label="Interactive 3D interior render"
    >
      <Canvas
        camera={{ position: [5, 3, 7], fov: 45, near: 0.01, far: 10000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <Suspense fallback={<LoadingScreen />}>
          <ambientLight intensity={2} />
          <hemisphereLight intensity={1.5} groundColor="#222222" />
          <directionalLight position={[5, 10, 5]} intensity={3} />
          <directionalLight position={[-5, 5, -5]} intensity={1.5} />
          <ModelErrorBoundary>
            <InteriorModel />
          </ModelErrorBoundary>
        </Suspense>
      </Canvas>
    </div>
  );
}
