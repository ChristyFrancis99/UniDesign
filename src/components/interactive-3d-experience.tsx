import { Minus, Plus } from "lucide-react";
import { Suspense, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Html,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Button } from "./ui/button";

type Vec3 = [number, number, number];

export const roomCameraPositions = {
  living: {
    position: [0, 1.6, 4] as Vec3,
    target: [0, 1.4, 0] as Vec3,
  },
  dining: {
    position: [3, 1.6, 2] as Vec3,
    target: [0, 1.3, 0] as Vec3,
  },
  kitchen: {
    position: [-2, 1.6, 3] as Vec3,
    target: [0, 1.4, -1] as Vec3,
  },
  bedroom: {
    position: [1, 1.6, 4] as Vec3,
    target: [0, 1.2, 0] as Vec3,
  },
};

export const materialOptions = {
  floor: ["Marble", "Wood", "Stone"],
  wall: ["Warm", "Neutral", "Textured"],
  lighting: ["Day", "Evening"],
};

const MODEL_URL =
  import.meta.env.VITE_INTERIOR_MODEL_URL?.trim() ||
  "/models/interior-room.glb";

function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center bg-secondary-charcoal text-warm-white">
        <div className="text-center">
          <p className="editorial-label text-gold">
            Loading architectural space
          </p>

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

  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

useGLTF.preload(MODEL_URL);

function CameraController({
  room,
  controlsRef,
}: {
  room: keyof typeof roomCameraPositions;
  controlsRef: RefObject<OrbitControlsImpl | null>;
}) {
  const targetPosition = new THREE.Vector3(
    ...roomCameraPositions[room].position,
  );
  const targetLookAt = new THREE.Vector3(
    ...roomCameraPositions[room].target,
  );

  useFrame(({ camera }) => {
    camera.position.lerp(targetPosition, 0.04);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt, 0.04);
      controlsRef.current.update();
    }
  });

  return null;
}

export function Interactive3DExperience({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [entered, setEntered] = useState(false);
  const [room, setRoom] =
    useState<keyof typeof roomCameraPositions>("living");
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleZoom = (direction: "in" | "out") => {
    const controls = controlsRef.current;
    if (!controls) return;

    const camera = controls.object;
    const directionVector = new THREE.Vector3();
    camera.getWorldDirection(directionVector);

    const distance = direction === "in" ? 0.5 : -0.5;
    camera.position.addScaledVector(directionVector, distance);
    controls.update();
  };

  return (
    <div
      id="3d-space"
      className={`relative overflow-hidden border border-warm-white/15 bg-secondary-charcoal text-warm-white ${
        compact
          ? "h-[72vh] min-h-[520px]"
          : "h-[78vh] min-h-[620px] max-h-[920px]"
      }`}
      aria-label="Interactive 3D architectural space"
    >
      {!entered ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-secondary-charcoal">
          <div className="text-center">
            <div className="font-display text-6xl">
              Un<span className="text-gold">I</span>
            </div>

            <p className="editorial-label mt-5 text-gold">
              Entering the space
            </p>

            <div className="mx-auto mt-5 h-px w-52 bg-warm-white/20">
              <div className="h-full w-2/3 bg-gold" />
            </div>

            <Button
              variant="inverse"
              className="mt-9"
              onClick={() => setEntered(true)}
            >
              Enter space <span aria-hidden>→</span>
            </Button>
          </div>
        </div>
      ) : null}

      <Canvas
        camera={{
          position: roomCameraPositions.living.position,
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 8, 5]} intensity={2} />
          <Environment preset="apartment" />
          <InteriorModel />
          <CameraController room={room} controlsRef={controlsRef} />
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={1}
            maxDistance={10}
            minPolarAngle={Math.PI * 0.15}
            maxPolarAngle={Math.PI * 0.85}
          />
        </Suspense>
      </Canvas>

      {entered && (
        <>
          <div className="pointer-events-none absolute left-5 top-5 z-10 editorial-label text-warm-white/60">
            Drag
            <br />
            Look around
          </div>

          <div className="absolute right-5 top-5 z-10 flex flex-col items-end gap-2">
            <span className="editorial-label mb-2 text-warm-white/45">
              Room
            </span>

            {(Object.keys(roomCameraPositions) as Array<
              keyof typeof roomCameraPositions
            >).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRoom(item)}
                className={`editorial-label capitalize transition-colors ${
                  room === item
                    ? "text-gold"
                    : "text-warm-white/50 hover:text-warm-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="absolute bottom-5 right-5 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Zoom in"
              onClick={() => handleZoom("in")}
              className="border border-warm-white/20 text-warm-white"
            >
              <Plus />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Zoom out"
              onClick={() => handleZoom("out")}
              className="border border-warm-white/20 text-warm-white"
            >
              <Minus />
            </Button>
          </div>

          <p className="absolute bottom-5 left-5 z-10 max-w-52 text-[10px] uppercase leading-5 tracking-[0.12em] text-warm-white/35">
            Interactive architectural experience · WebGL
          </p>
        </>
      )}
    </div>
  );
}
