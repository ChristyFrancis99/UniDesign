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
  const value = Math.round(Math.max(0, Math.min(100, progress)));

  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center bg-[#f4f1eb] text-[#242424]">
        <div className="w-[min(340px,80vw)] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">
            {active ? "Loading interior" : "Preparing interior"}
          </p>
          <div className="mt-5 h-px w-full bg-black/10">
            <div
              className="h-full bg-[#b99b4b] transition-[width] duration-200"
              style={{ width: `${Math.max(2, value)}%` }}
            />
          </div>
          <p className="mt-3 text-[11px] tracking-[0.12em] text-black/45">
            {value}%
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
        <h1 className="mt-4 text-2xl font-medium">
          The interior could not be displayed.
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
    return this.state.error ? (
      <ErrorScreen
        message={this.state.error.message || "The 3D viewer failed to render."}
      />
    ) : (
      this.props.children
    );
  }
}

function InteriorModel() {
  const { scene } = useGLTF(MODEL_URL);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera, invalidate } = useThree();
  const [diagnostics, setDiagnostics] = useState<{
    meshes: number;
    center: THREE.Vector3;
    size: THREE.Vector3;
    eye: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    scene.updateMatrixWorld(true);

    let meshCount = 0;

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      meshCount += 1;
      object.visible = true;
      object.frustumCulled = false;
      object.castShadow = false;
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

    // IMPORTANT: derive everything from the actual loaded GLB. Never use
    // hardcoded center/scale values because they can put the room outside
    // the camera frustum when the model changes.
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);

    if (box.isEmpty() || meshCount === 0) {
      throw new Error("The GLB loaded, but it contains no visible meshes.");
    }

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(maxDim) || maxDim <= 0) {
      throw new Error("The GLB has invalid geometry bounds.");
    }

    // Keep the model at its original scale/transform. We only frame the
    // camera from the real world-space bounds.
    const halfHeight = Math.max(size.y / 2, 0.5);
    const eyeHeight = Math.min(
      Math.max(size.y * 0.42, 0.7),
      Math.max(size.y - 0.15, 0.7),
    );
    const eyeY = box.min.y + eyeHeight;

    // Start INSIDE the room rather than outside its walls. This is important
    // for an interior scene: an exterior camera can be blocked completely by
    // walls even though the model is loaded correctly.
    const horizontalOffset = Math.max(Math.min(maxDim * 0.12, 0.9), 0.45);
    const eye = new THREE.Vector3(
      center.x + horizontalOffset,
      eyeY,
      center.z + horizontalOffset,
    );

    const target = new THREE.Vector3(center.x, eyeY, center.z);
    const interiorDistance = Math.max(maxDim * 0.18, 1.2);

    camera.position.copy(eye);
    camera.near = Math.max(maxDim / 10000, 0.001);
    camera.far = Math.max(maxDim * 10, 50);
    camera.lookAt(target);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.copy(target);
      controlsRef.current.minDistance = Math.max(maxDim * 0.03, 0.15);
      controlsRef.current.maxDistance = Math.max(maxDim * 1.5, 15);
      controlsRef.current.update();
    }

    setDiagnostics({ meshes: meshCount, center, size, eye });

    console.info("3D experience diagnostics", {
      meshes: meshCount,
      center: center.toArray(),
      size: size.toArray(),
      camera: eye.toArray(),
      target: target.toArray(),
      interiorDistance,
    });

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
      {import.meta.env.DEV && diagnostics ? (
        <Html fullscreen pointerEvents="none">
          <div className="pointer-events-none fixed left-4 top-4 z-50 rounded-md bg-black/75 px-3 py-2 font-mono text-[10px] leading-4 text-white">
            <div>meshes: {diagnostics.meshes}</div>
            <div>
              size: {diagnostics.size.x.toFixed(2)} × {diagnostics.size.y.toFixed(2)} × {diagnostics.size.z.toFixed(2)}
            </div>
            <div>
              center: {diagnostics.center.x.toFixed(2)}, {diagnostics.center.y.toFixed(2)}, {diagnostics.center.z.toFixed(2)}
            </div>
            <div>
              camera: {diagnostics.eye.x.toFixed(2)}, {diagnostics.eye.y.toFixed(2)}, {diagnostics.eye.z.toFixed(2)}
            </div>
          </div>
        </Html>
      ) : null}
    </Fragment>
  );
}

export function Interactive3DExperience() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f1eb] text-[#242424]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">
          Preparing render
        </p>
      </div>
    );
  }

  return (
    <ModelErrorBoundary>
      <div
        className="relative h-screen w-full overflow-hidden bg-[#f4f1eb]"
        aria-label="Interactive 3D interior render"
      >
        <Canvas
          camera={{ position: [2, 1, 2], fov: 70, near: 0.001, far: 100 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor("#f4f1eb", 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
        >
          <hemisphereLight args={["#fffdf8", "#4b463e", 1.8]} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 6, 4]} intensity={2.2} />
          <directionalLight position={[-3, 3, -2]} intensity={0.9} />
          <Suspense fallback={<LoadingScreen />}>
            <InteriorModel />
          </Suspense>
        </Canvas>
      </div>
    </ModelErrorBoundary>
  );
}

useGLTF.preload(MODEL_URL);
