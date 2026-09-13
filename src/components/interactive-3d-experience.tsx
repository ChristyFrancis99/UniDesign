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
  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center bg-[#f4f1eb] text-[#242424]">
        <div className="w-[min(340px,80vw)] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">
            Loading interior
          </p>
          <div className="mt-5 h-px w-full bg-black/10">
            <div
              className="h-full bg-[#b99b4b] transition-[width] duration-200"
              style={{ width: `${Math.max(2, Math.min(100, progress))}%` }}
            />
          </div>
          <p className="mt-3 text-[11px] tracking-[0.12em] text-black/45">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f4f1eb] px-6 text-[#242424]">
      <div className="max-w-xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b99b4b]">
          3D render unavailable
        </p>
        <h1 className="mt-4 text-2xl font-medium">The interior could not be displayed.</h1>
        <p className="mt-4 text-sm leading-6 text-black/55">{message}</p>
        <p className="mt-5 break-all font-mono text-[11px] text-black/35">{MODEL_URL}</p>
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
    return this.state.error ? (
      <ErrorScreen message={this.state.error.message || "The 3D viewer failed to render."} />
    ) : (
      this.props.children
    );
  }
}

function InteriorModel() {
  const { scene } = useGLTF(MODEL_URL);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    // The supplied GLB is a real interior scene with transforms that already
    // place the room in a compact ~7.5 x 10 x 7.5 unit world-space box.
    // Do not hide or discard meshes based on names: many furniture assets are
    // nested/imported and name-based filtering was making the scene disappear.
    scene.updateMatrixWorld(true);

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.visible = true;
      object.frustumCulled = false;
      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (!material) return;
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
      });
    });

    // World-space bounds measured from the supplied GLB. Centering these
    // known bounds avoids the broken automatic filtering/framing that was
    // previously making the interior invisible.
    const center = new THREE.Vector3(-0.0833, 4.1721, -0.0962);
    const scale = 0.78;

    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    scene.scale.setScalar(scale);
    scene.updateMatrixWorld(true);

    // Start outside and slightly above the room, looking toward its center.
    camera.position.set(8.5, 5.8, 8.5);
    camera.near = 0.01;
    camera.far = 200;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.minDistance = 0.4;
      controlsRef.current.maxDistance = 30;
      controlsRef.current.update();
    }

    invalidate();
  }, [camera, invalidate, scene]);

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f1eb] text-[#242424]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">Preparing render</p>
      </div>
    );
  }

  return (
    <ModelErrorBoundary>
      <div className="relative h-screen w-full overflow-hidden bg-[#f4f1eb]" aria-label="Interactive 3D interior render">
        <Canvas
          camera={{ position: [8.5, 5.8, 8.5], fov: 55, near: 0.01, far: 200 }}
          dpr={[1, 1.5]}
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#f4f1eb", 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.4;
          }}
        >
          <hemisphereLight args={["#fffdf8", "#5e574d", 3]} />
          <ambientLight intensity={2} />
          <directionalLight castShadow position={[5, 10, 6]} intensity={5} shadow-mapSize={[2048, 2048]} />
          <directionalLight position={[-5, 5, -4]} intensity={2.5} />
          <directionalLight position={[3, 4, 8]} intensity={2} />
          <Suspense fallback={<LoadingScreen />}>
            <InteriorModel />
          </Suspense>
        </Canvas>
      </div>
    </ModelErrorBoundary>
  );
}

useGLTF.preload(MODEL_URL);
