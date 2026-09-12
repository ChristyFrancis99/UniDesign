import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export const roomCameraPositions = {
  living: { position: [0, 1.6, 4], target: [0, 1.4, 0] },
  dining: { position: [3, 1.6, 2], target: [0, 1.3, 0] },
  kitchen: { position: [-2, 1.6, 3], target: [0, 1.4, -1] },
  bedroom: { position: [1, 1.6, 4], target: [0, 1.2, 0] },
} satisfies Record<string, { position: number[]; target: number[] }>;

export const materialOptions = { floor: ["Marble", "Wood", "Stone"], wall: ["Warm", "Neutral", "Textured"], lighting: ["Day", "Evening"] };

export function Interactive3DExperience({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [room, setRoom] = useState("living");
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setReady(true); observer.disconnect(); } }, { rootMargin: "300px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} id="3d-space" className={`relative overflow-hidden border border-warm-white/15 bg-secondary-charcoal text-warm-white ${compact ? "h-[72vh] min-h-[520px]" : "h-[78vh] min-h-[620px] max-h-[920px]"}`} aria-label="Interactive 3D model placeholder">
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--color-warm-white)/.08_1px,transparent_1px),linear-gradient(90deg,var(--color-warm-white)/.08_1px,transparent_1px)] [background-size:80px_80px]" />
    <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
      {!ready ? <p className="editorial-label text-gold">Preparing experience…</p> : !entered ? <div><div className="font-display text-6xl">Un<span className="text-gold">I</span></div><p className="editorial-label mt-5 text-gold">Entering the space</p><div className="mx-auto mt-5 h-px w-52 bg-warm-white/20"><div className="h-full w-2/3 bg-gold" /></div><Button variant="inverse" className="mt-9" onClick={() => setEntered(true)}>Enter space <span aria-hidden>→</span></Button></div> : <div><p className="editorial-label text-gold">3D Experience</p><h3 className="mt-5 font-display text-5xl">Model placeholder</h3><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-warm-white/55">Your interactive architectural space will appear here when the GLB or GLTF model is supplied.</p></div>}
    </div>
    <div className="absolute left-5 top-5 editorial-label text-warm-white/50">Drag<br />Look around</div>
    <div className="absolute right-5 top-5 flex flex-col items-end gap-2"><span className="editorial-label mb-2 text-warm-white/45">Room</span>{Object.keys(roomCameraPositions).map((item) => <button key={item} onClick={() => setRoom(item)} className={`editorial-label transition-colors ${room === item ? "text-gold" : "text-warm-white/50 hover:text-warm-white"}`}>{item}</button>)}</div>
    <div className="absolute bottom-5 right-5 flex gap-2"><Button variant="ghost" size="icon" aria-label="Zoom in" className="border border-warm-white/20 text-warm-white"><Plus /></Button><Button variant="ghost" size="icon" aria-label="Zoom out" className="border border-warm-white/20 text-warm-white"><Minus /></Button></div>
    <p className="absolute bottom-5 left-5 max-w-52 text-[10px] uppercase leading-5 tracking-[0.12em] text-warm-white/35">Model-ready · WebGL fallback supported</p>
  </div>;
}