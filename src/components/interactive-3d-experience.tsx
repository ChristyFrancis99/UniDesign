import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";

const MODEL_URL =
  import.meta.env.VITE_INTERIOR_MODEL_URL?.trim() ||
  "/models/interior-room.glb";

function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center bg-secondary-charcoal text-warm-white">
        <div className="text-center">
          <p className="editorial-label text-gold">Loading render</p>
          <div className="mx-auto mt-5 h-px w-52 bg-warm-white/20">
            <div
              className="h-full bg-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-warm-white/50">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}

function InteriorModel() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} />;
}

useGLTF.preload(MODEL_URL);

export function Interactive3DExperience() {
  return (
    <div
      id="3d-space"
      className="h-screen w-full overflow-hidden bg-secondary-charcoal"
      aria-label="Interactive 3D interior render"
    >
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45, near: 0.01, far: 10000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={2.5} />
          <Environment preset="apartment" />

          <Bounds fit clip observe margin={1.2}>
            <InteriorModel />
          </Bounds>

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            enablePan
            minDistance={0.1}
            maxDistance={1000}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
