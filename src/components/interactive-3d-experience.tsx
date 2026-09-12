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
  const { progress } = useProgress();
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center bg-[#f4f1eb] text-[#242424]">
        <div className="w-[min(320px,80vw)] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">
            Loading render
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

function InteriorModel() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera, invalidate } = useThree();
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDimension = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
      setModelError("The GLB contains no visible geometry.");
      return;
    }

    setModelError(null);

    // Normalize the export so models saved in centimeters, meters, or very
    // large Blender units all fit the same camera reliably.
    const targetSize = 8;
    const scale = targetSize / maxDimension;

    group.scale.setScalar(scale);
    group.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale,
    );

    const normalizedSize = maxDimension * scale;
    const distance = Math.max(6, normalizedSize * 1.35);

    camera.position.set(distance * 0.72, distance * 0.48, distance * 0.72);
    camera.near = 0.01;
    camera.far = Math.max(100, distance * 20);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.minDistance = normalizedSize * 0.35;
      controlsRef.current.maxDistance = normalizedSize * 6;
      controlsRef.current.update();
    }

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    invalidate();
  }, [camera, invalidate, scene]);

  if (modelError) {
    return <Html fullscreen>{/* handled by the page-level fallback */}</Html>;
  }

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

useGLTF.preload(MODEL_URL);

export function Interactive3DExperience() {
  return (
    <ModelErrorBoundary>
      <div
        id="3d-space"
        className="h-screen w-full overflow-hidden bg-[#f4f1eb]"
        aria-label="Interactive 3D interior render"
      >
        <Canvas
          camera={{ position: [6, 4, 6], fov: 42, near: 0.01, far: 1000 }}
          dpr={[1, 1.75]}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
          }}
        >
          <color attach="background" args={["#f4f1eb"]} />

          <hemisphereLight args={["#fffdf8", "#6f685d", 2.2]} />
          <ambientLight intensity={1.25} />
          <directionalLight
            castShadow
            position={[5, 10, 6]}
            intensity={4}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-5, 4, -4]} intensity={1.8} />
          <directionalLight position={[0, 2, 8]} intensity={1.2} />

          <Suspense fallback={<LoadingScreen />}>
            <InteriorModel />
          </Suspense>
        </Canvas>
      </div>
    </ModelErrorBoundary>
  );
}
