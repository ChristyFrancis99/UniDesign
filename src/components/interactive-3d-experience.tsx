import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const MODEL_URL =
  import.meta.env.VITE_INTERIOR_MODEL_URL?.trim() ||
  "/models/interior-room.glb";

type Diagnostics = {
  meshes: number;
  size: THREE.Vector3;
  center: THREE.Vector3;
  camera: THREE.Vector3;
};

function LoadingOverlay({ progress }: { progress: number }) {
  const value = Math.round(Math.max(0, Math.min(100, progress)));

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#f4f1eb] text-[#242424]">
      <div className="w-[min(340px,80vw)] text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">
          Loading interior
        </p>
        <div className="mt-5 h-px w-full bg-black/10">
          <div
            className="h-full bg-[#b99b4b] transition-[width] duration-150"
            style={{ width: `${Math.max(2, value)}%` }}
          />
        </div>
        <p className="mt-3 text-[11px] tracking-[0.12em] text-black/45">
          {value}%
        </p>
      </div>
    </div>
  );
}

function ErrorOverlay({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#f4f1eb] px-6 text-[#242424]">
      <div className="max-w-xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b99b4b]">
          3D render unavailable
        </p>
        <h1 className="mt-4 text-2xl font-medium tracking-tight">
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

export function Interactive3DExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const frameRef = useRef<number | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let scene: THREE.Scene | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let controls: OrbitControls | null = null;

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#f4f1eb");

      camera = new THREE.PerspectiveCamera(68, 1, 0.01, 100);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = false;
      renderer.setClearColor("#f4f1eb", 1);
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      const hemisphere = new THREE.HemisphereLight("#fffdf8", "#514b43", 1.8);
      scene.add(hemisphere);

      const ambient = new THREE.AmbientLight("#ffffff", 1.25);
      scene.add(ambient);

      const key = new THREE.DirectionalLight("#fff8e9", 2.4);
      key.position.set(4, 7, 5);
      scene.add(key);

      const fill = new THREE.DirectionalLight("#e9f0ff", 1.0);
      fill.position.set(-4, 3, -3);
      scene.add(fill);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.enablePan = true;
      controls.screenSpacePanning = true;
      controls.minPolarAngle = 0.15;
      controls.maxPolarAngle = Math.PI - 0.15;
      controls.minDistance = 0.25;
      controls.maxDistance = 20;
      controlsRef.current = controls;

      const resize = () => {
        if (!container || !renderer || !camera) return;
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const loader = new GLTFLoader();
      loader.load(
        MODEL_URL,
        (gltf) => {
          if (disposed || !scene || !camera || !controls || !renderer) return;

          const model = gltf.scene;
          modelRef.current = model;

          let meshCount = 0;
          model.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            meshCount += 1;
            object.visible = true;
            object.frustumCulled = false;
            object.castShadow = false;
            object.receiveShadow = false;

            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            materials.forEach((material) => {
              if (!material) return;
              material.side = THREE.DoubleSide;
              material.needsUpdate = true;
            });
          });

          scene.add(model);
          model.updateMatrixWorld(true);

          const box = new THREE.Box3().setFromObject(model);
          if (box.isEmpty() || meshCount === 0) {
            throw new Error("The GLB loaded, but contains no visible meshes.");
          }

          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          if (!Number.isFinite(maxDim) || maxDim <= 0) {
            throw new Error("The GLB has invalid geometry bounds.");
          }

          // The model is a real interior scene. Start the camera inside the
          // room using the measured bounds instead of hardcoded GLB transforms.
          const floor = box.min.y;
          const ceiling = box.max.y;
          const roomHeight = Math.max(ceiling - floor, 1.5);
          const eyeY = THREE.MathUtils.clamp(
            floor + roomHeight * 0.42,
            floor + 0.25,
            ceiling - 0.25,
          );
          const horizontalOffset = Math.max(
            Math.min(Math.min(size.x, size.z) * 0.16, 1.25),
            0.55,
          );

          const eye = new THREE.Vector3(
            center.x + horizontalOffset,
            eyeY,
            center.z + horizontalOffset,
          );

          const target = new THREE.Vector3(center.x, eyeY, center.z);
          camera.position.copy(eye);
          camera.near = Math.max(maxDim / 5000, 0.001);
          camera.far = Math.max(maxDim * 12, 50);
          camera.lookAt(target);
          camera.updateProjectionMatrix();

          controls.target.copy(target);
          controls.minDistance = Math.max(Math.min(size.x, size.z) * 0.025, 0.12);
          controls.maxDistance = Math.max(maxDim * 1.5, 12);
          controls.update();

          if (gltf.animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => mixerRef.current?.clipAction(clip).play());
          }

          setDiagnostics({ meshes: meshCount, size, center, camera: eye });
          setProgress(100);
          setLoading(false);

          console.info("Three.js 3D experience loaded", {
            meshes: meshCount,
            center: center.toArray(),
            size: size.toArray(),
            camera: eye.toArray(),
          });

          resize();
          renderer.render(scene, camera);
        },
        (event) => {
          if (event.total > 0) {
            setProgress((event.loaded / event.total) * 100);
          } else {
            setProgress((current) => Math.min(current + 2, 95));
          }
        },
        (loadError) => {
          console.error("Three.js GLB load failed", loadError);
          if (!disposed) {
            setLoading(false);
            setError(
              "The GLB could not be loaded. Check that the model exists at the path above and that the browser can access it.",
            );
          }
        },
      );

      const animate = () => {
        if (disposed || !scene || !camera || !renderer) return;
        frameRef.current = window.requestAnimationFrame(animate);
        const delta = clockRef.current.getDelta();
        mixerRef.current?.update(delta);
        controls?.update();
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        disposed = true;
        resizeObserver.disconnect();

        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }

        controls?.dispose();
        mixerRef.current?.stopAllAction();
        mixerRef.current = null;

        if (modelRef.current) {
          modelRef.current.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((material) => material?.dispose());
          });
        }

        renderer?.dispose();
        renderer?.forceContextLoss();
        rendererRef.current = null;
        cameraRef.current = null;
        controlsRef.current = null;

        if (renderer?.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (initializationError) {
      console.error("Three.js viewer initialization failed", initializationError);
      setLoading(false);
      setError(
        initializationError instanceof Error
          ? initializationError.message
          : "WebGL could not be initialized in this browser.",
      );

      return () => {
        disposed = true;
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        controls?.dispose();
        renderer?.dispose();
        renderer?.forceContextLoss();
        if (renderer?.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#f4f1eb]">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Interactive 3D interior viewer"
      />

      {loading && !error ? <LoadingOverlay progress={progress} /> : null}
      {error ? <ErrorOverlay message={error} /> : null}

      {!loading && !error ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-5">
          <div className="rounded-full border border-black/10 bg-white/75 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/55 backdrop-blur-md">
            Drag to explore · Scroll to zoom · Right-drag to pan
          </div>
        </div>
      ) : null}

      {import.meta.env.DEV && diagnostics && !error ? (
        <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-md bg-black/75 px-3 py-2 font-mono text-[10px] leading-4 text-white">
          <div>Three.js · meshes: {diagnostics.meshes}</div>
          <div>
            size: {diagnostics.size.x.toFixed(2)} × {diagnostics.size.y.toFixed(2)} × {diagnostics.size.z.toFixed(2)}
          </div>
          <div>
            center: {diagnostics.center.x.toFixed(2)}, {diagnostics.center.y.toFixed(2)}, {diagnostics.center.z.toFixed(2)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
