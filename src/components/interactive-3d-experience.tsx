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
      </div>
    </div>
  );
}

export function Interactive3DExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
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
    let resizeObserver: ResizeObserver | null = null;

    const reportError = (message: string, details?: unknown) => {
      if (disposed) return;
      console.error("Three.js 3D experience error", details ?? message);
      setLoading(false);
      setError(message);
    };

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#e9e5dc");

      camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor("#e9e5dc", 1);
      container.appendChild(renderer.domElement);

      const hemisphere = new THREE.HemisphereLight("#fffaf0", "#3e3831", 1.05);
      scene.add(hemisphere);

      const ambient = new THREE.AmbientLight("#ffffff", 0.28);
      scene.add(ambient);

      const key = new THREE.DirectionalLight("#fff1d6", 2.4);
      key.position.set(5, 8, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 0.1;
      key.shadow.camera.far = 40;
      key.shadow.bias = -0.0003;
      scene.add(key);

      const fill = new THREE.DirectionalLight("#d9e7ff", 0.65);
      fill.position.set(-5, 4, 3);
      scene.add(fill);

      const warmInterior = new THREE.PointLight("#ffd29b", 0.8, 14, 2);
      warmInterior.position.set(0, 2.2, 0);
      scene.add(warmInterior);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = true;
      controls.screenSpacePanning = true;
      controls.minPolarAngle = 0.2;
      controls.maxPolarAngle = Math.PI - 0.2;
      controls.minDistance = 0.35;
      controls.maxDistance = 15;

      const resize = () => {
        if (!container || !renderer || !camera) return;
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      resize();
      resizeObserver = new ResizeObserver(resize);
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
            object.castShadow = true;
            object.receiveShadow = true;

            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            materials.forEach((material) => {
              if (!material) return;
              material.needsUpdate = true;

              if ("map" in material && material.map) {
                material.map.colorSpace = THREE.SRGBColorSpace;
                material.map.anisotropy = Math.min(
                  renderer.capabilities.getMaxAnisotropy(),
                  8,
                );
                material.map.needsUpdate = true;
              }
            });
          });

          if (meshCount === 0) {
            reportError("The GLB loaded, but contains no visible meshes.");
            return;
          }

          scene.add(model);
          model.updateMatrixWorld(true);

          const box = new THREE.Box3().setFromObject(model);
          if (box.isEmpty()) {
            reportError("The GLB loaded, but its geometry bounds are empty.");
            return;
          }

          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          if (!Number.isFinite(maxDim) || maxDim <= 0) {
            reportError("The GLB has invalid geometry bounds.");
            return;
          }

          // Put the viewer at human eye level inside the measured interior.
          // No model-specific hardcoded world coordinates are required.
          const floor = box.min.y;
          const ceiling = box.max.y;
          const roomHeight = Math.max(ceiling - floor, 1.5);
          const eyeY = THREE.MathUtils.clamp(
            floor + roomHeight * 0.18,
            floor + 0.35,
            ceiling - 0.35,
          );

          const roomWidth = Math.min(size.x, size.z);
          const offset = THREE.MathUtils.clamp(roomWidth * 0.18, 0.7, 1.4);

          const eye = new THREE.Vector3(
            center.x + offset,
            eyeY,
            center.z + offset,
          );
          const target = new THREE.Vector3(
            center.x,
            THREE.MathUtils.clamp(
              eyeY + roomHeight * 0.04,
              floor + 0.6,
              ceiling - 0.4,
            ),
            center.z,
          );

          camera.position.copy(eye);
          camera.near = Math.max(maxDim / 5000, 0.01);
          camera.far = Math.max(maxDim * 10, 50);
          camera.lookAt(target);
          camera.updateProjectionMatrix();

          controls.target.copy(target);
          controls.minDistance = Math.max(roomWidth * 0.035, 0.25);
          controls.maxDistance = Math.max(maxDim * 1.25, 10);
          controls.update();

          key.shadow.camera.left = -maxDim;
          key.shadow.camera.right = maxDim;
          key.shadow.camera.top = maxDim;
          key.shadow.camera.bottom = -maxDim;
          key.shadow.camera.updateProjectionMatrix();

          if (gltf.animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
              mixerRef.current?.clipAction(clip).play();
            });
          }

          setDiagnostics({ meshes: meshCount, size, center, camera: eye });
          setProgress(100);
          setLoading(false);

          if (import.meta.env.DEV) {
            console.info("Three.js 3D experience loaded", {
              meshes: meshCount,
              center: center.toArray(),
              size: size.toArray(),
              camera: eye.toArray(),
            });
          }

          resize();
          renderer.render(scene, camera);
        },
        (event) => {
          if (disposed) return;
          if (event.total > 0) {
            setProgress((event.loaded / event.total) * 100);
          } else {
            setProgress((current) => Math.min(current + 2, 95));
          }
        },
        (loadError) => {
          reportError(
            "The GLB could not be loaded. Check that /models/interior-room.glb is reachable from the browser.",
            loadError,
          );
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
        resizeObserver?.disconnect();

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
            materials.forEach((material) => {
              if (!material) return;
              material.dispose();
            });
          });
          modelRef.current = null;
        }

        renderer?.dispose();
        renderer?.forceContextLoss();

        if (renderer?.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (initializationError) {
      reportError(
        initializationError instanceof Error
          ? initializationError.message
          : "WebGL could not be initialized in this browser.",
        initializationError,
      );

      return () => {
        disposed = true;
        resizeObserver?.disconnect();
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
    <div className="relative h-screen w-full overflow-hidden bg-[#e9e5dc]">
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
            camera: {diagnostics.camera.x.toFixed(2)}, {diagnostics.camera.y.toFixed(2)}, {diagnostics.camera.z.toFixed(2)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
