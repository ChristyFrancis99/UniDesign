import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer, Ruler, RotateCcw, Check, ArrowUpRight, Layers3 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../components/ui/button";

type RoomType = "Living room" | "Bedroom" | "Kitchen" | "Studio apartment";
type Style = "Modern" | "Minimal" | "Warm contemporary" | "Traditional";

export const Route = createFileRoute("/blueprint")({
  head: () => ({
    meta: [
      { title: "Interior Blueprint Generator | UnI Design Group" },
      { name: "description", content: "Create a conceptual, dimensioned 2D interior layout from your room measurements and furniture needs." },
    ],
  }),
  component: BlueprintPage,
});

function BlueprintPage() {
  const [roomType, setRoomType] = useState<RoomType>("Living room");
  const [length, setLength] = useState("16");
  const [width, setWidth] = useState("12");
  const [style, setStyle] = useState<Style>("Warm contemporary");
  const [budget, setBudget] = useState("₹2–5 lakh");
  const [needs, setNeeds] = useState<string[]>(["Comfortable seating", "Storage"]);
  const [generated, setGenerated] = useState(false);

  const roomLength = Number(length);
  const roomWidth = Number(width);
  const validDimensions = Number.isFinite(roomLength) && Number.isFinite(roomWidth) &&
    roomLength >= 6 && roomLength <= 60 && roomWidth >= 6 && roomWidth <= 60;

  const plan = useMemo(() => {
    const scale = Math.min(620 / roomLength, 420 / roomWidth);
    const roomW = roomLength * scale;
    const roomH = roomWidth * scale;
    const x = (800 - roomW) / 2;
    const y = (540 - roomH) / 2 + 10;
    const pad = Math.max(18, Math.min(roomW, roomH) * 0.07);
    const furniture: { label: string; x: number; y: number; w: number; h: number; kind: string }[] = [];
    const add = (label: string, fx: number, fy: number, fw: number, fh: number, kind = "furniture") => {
      furniture.push({ label, x: fx, y: fy, w: fw, h: fh, kind });
    };

    if (roomType === "Living room") {
      add("SOFA", x + pad, y + pad, roomW * 0.42, roomH * 0.19);
      add("COFFEE TABLE", x + roomW * 0.29, y + roomH * 0.40, roomW * 0.30, roomH * 0.12);
      add("TV UNIT", x + roomW * 0.76, y + roomH * 0.20, roomW * 0.12, roomH * 0.48);
      add("LOUNGE CHAIR", x + roomW * 0.13, y + roomH * 0.60, roomW * 0.22, roomH * 0.17);
      if (needs.includes("Storage")) add("STORAGE", x + roomW * 0.48, y + roomH * 0.78, roomW * 0.30, roomH * 0.10);
    } else if (roomType === "Bedroom") {
      add("BED", x + roomW * 0.26, y + roomH * 0.22, roomW * 0.48, roomH * 0.42);
      add("SIDE TABLE", x + roomW * 0.15, y + roomH * 0.24, roomW * 0.08, roomH * 0.13);
      add("SIDE TABLE", x + roomW * 0.77, y + roomH * 0.24, roomW * 0.08, roomH * 0.13);
      add("WARDROBE", x + roomW * 0.08, y + roomH * 0.70, roomW * 0.34, roomH * 0.13);
      if (needs.includes("Study desk")) add("STUDY DESK", x + roomW * 0.58, y + roomH * 0.73, roomW * 0.30, roomH * 0.10);
    } else if (roomType === "Kitchen") {
      add("COUNTER", x + pad, y + pad, roomW * 0.14, roomH * 0.72, "counter");
      add("COUNTER", x + pad, y + pad, roomW * 0.66, roomH * 0.14, "counter");
      add("ISLAND", x + roomW * 0.42, y + roomH * 0.38, roomW * 0.25, roomH * 0.20, "counter");
      if (needs.includes("Dining table")) add("DINING", x + roomW * 0.52, y + roomH * 0.69, roomW * 0.30, roomH * 0.15);
    } else {
      add("BED / SOFA", x + roomW * 0.08, y + roomH * 0.10, roomW * 0.38, roomH * 0.22);
      add("LOUNGE", x + roomW * 0.55, y + roomH * 0.12, roomW * 0.32, roomH * 0.18);
      add("DINING / WORK", x + roomW * 0.55, y + roomH * 0.46, roomW * 0.32, roomH * 0.15);
      add("KITCHEN", x + roomW * 0.08, y + roomH * 0.66, roomW * 0.38, roomH * 0.14, "counter");
      add("WARDROBE", x + roomW * 0.55, y + roomH * 0.75, roomW * 0.32, roomH * 0.10);
    }
    return { x, y, roomW, roomH, furniture, scale };
  }, [roomLength, roomWidth, roomType, needs]);

  const toggleNeed = (item: string) => setNeeds((current) =>
    current.includes(item) ? current.filter((value) => value !== item) : [...current, item]
  );

  const generate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validDimensions) setGenerated(true);
  };

  const downloadSvg = () => {
    const svg = document.getElementById("blueprint-canvas");
    if (!svg) return;
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const source = new XMLSerializer().serializeToString(copy);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `uni-interior-blueprint-${roomType.toLowerCase().replaceAll(" ", "-")}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] pb-24 pt-28 md:pt-36">
      <section className="content-shell">
        <div className="relative overflow-hidden border border-[#34372f] bg-[#22251f] px-6 py-10 text-[#f7f6f2] sm:px-10 sm:py-14 lg:px-16">
          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border border-[#d4b77a]/25 sm:right-16 sm:top-[-7rem] sm:h-96 sm:w-96" />
          <div className="pointer-events-none absolute right-8 top-12 h-40 w-40 rounded-full border border-[#d4b77a]/20 sm:right-28 sm:top-16 sm:h-64 sm:w-64" />
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#d4b77a]" /><p className="editorial-label text-[#d4b77a]">UNI DESIGN GROUP / DESIGN LAB</p></div>
            <h1 className="mt-6 font-display text-5xl leading-[.95] sm:text-6xl lg:text-7xl">A CLEARER VIEW<br /><span className="text-[#d4b77a]">OF YOUR SPACE.</span></h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">Create a first-pass furniture layout shaped around your room dimensions, daily needs and design preferences.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[.12em] text-white/65">
              <span className="flex items-center gap-2"><Ruler className="size-4 text-[#d4b77a]" /> Dimension-led</span>
              <span className="flex items-center gap-2"><Layers3 className="size-4 text-[#d4b77a]" /> 2D concept plan</span>
              <span className="flex items-center gap-2"><Download className="size-4 text-[#d4b77a]" /> Exportable</span>
            </div>
          </div>
        </div>
        <div className="mb-6 mt-10 flex flex-wrap items-end justify-between gap-4">
          <div><p className="editorial-label text-gold">YOUR DESIGN WORKSPACE</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">Start with the essentials.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">A few details in. A clearer starting point for your interior.</p>
        </div>
        <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <form onSubmit={generate} className="overflow-hidden border border-[#dedbd2] bg-white shadow-[0_12px_40px_rgba(32,35,28,0.04)]">
            <div className="flex items-center justify-between border-b border-[#e8e5dc] bg-[#fbfaf7] px-6 py-5"><div><p className="editorial-label text-gold">DESIGN INPUTS</p><p className="mt-1 text-xs text-muted-foreground">01 / Tell us about the room</p></div><span className="grid size-9 place-items-center rounded-full border border-[#e0d9c8] text-gold"><Ruler className="size-4" /></span></div>
            <div className="space-y-7 p-6 md:p-7">
            <div>
              <p className="editorial-label text-gold">01 — THE SPACE</p>
              <label htmlFor="room-type" className="mt-4 block text-sm font-medium">What room are you planning?</label>
              <select id="room-type" value={roomType} onChange={(event) => { setRoomType(event.target.value as RoomType); setGenerated(false); }} className="mt-2 h-12 w-full border border-[#dcd8ce] bg-[#fbfaf7] px-3 text-sm outline-none focus:border-gold">
                <option>Living room</option><option>Bedroom</option><option>Kitchen</option><option>Studio apartment</option>
              </select>
            </div>

            <div>
              <p className="editorial-label text-gold">02 — MEASUREMENTS</p>
              <p className="mt-3 text-sm text-muted-foreground">Enter the internal room dimensions in feet.</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div><label htmlFor="room-length" className="text-xs text-muted-foreground">Length (ft)</label><input id="room-length" type="number" min="6" max="60" step="0.5" required value={length} onChange={(event) => { setLength(event.target.value); setGenerated(false); }} className="mt-1 h-11 w-full border border-[#dcd8ce] bg-[#fbfaf7] px-3 text-sm outline-none focus:border-gold" /></div>
                <div><label htmlFor="room-width" className="text-xs text-muted-foreground">Width (ft)</label><input id="room-width" type="number" min="6" max="60" step="0.5" required value={width} onChange={(event) => { setWidth(event.target.value); setGenerated(false); }} className="mt-1 h-11 w-full border border-input bg-background px-3 text-sm outline-none focus:border-gold" /></div>
              </div>
              {!validDimensions && <p className="mt-2 text-xs text-destructive">Use dimensions between 6 and 60 feet.</p>}
              {validDimensions && <p className="mt-2 text-xs text-muted-foreground">Approx. {Math.round(roomLength * roomWidth)} sq ft</p>}
            </div>

            <div>
              <p className="editorial-label text-gold">03 — DESIGN LANGUAGE</p>
              <label htmlFor="style" className="mt-4 block text-sm font-medium">Preferred style</label>
              <select id="style" value={style} onChange={(event) => { setStyle(event.target.value as Style); setGenerated(false); }} className="mt-2 h-12 w-full border border-input bg-background px-3 text-sm outline-none focus:border-gold">
                <option>Modern</option><option>Minimal</option><option>Warm contemporary</option><option>Traditional</option>
              </select>
            </div>

            <div>
              <p className="editorial-label text-gold">04 — REQUIREMENTS</p>
              <div className="mt-4 space-y-3">
                {["Comfortable seating", "Storage", "Study desk", "Dining table", "Extra circulation space"].map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-3 text-sm">
                    <input type="checkbox" checked={needs.includes(item)} onChange={() => { toggleNeed(item); setGenerated(false); }} className="size-4 accent-foreground" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium">Indicative budget (optional)</label>
              <select id="budget" value={budget} onChange={(event) => { setBudget(event.target.value); setGenerated(false); }} className="mt-2 h-12 w-full border border-input bg-background px-3 text-sm outline-none focus:border-gold">
                <option>Under ₹1 lakh</option><option>₹1–2 lakh</option><option>₹2–5 lakh</option><option>₹5 lakh+</option><option>Not decided</option>
              </select>
            </div>

            <Button type="submit" className="h-12 w-full bg-[#252820] text-white hover:bg-[#3a3e34]" disabled={!validDimensions}><Ruler className="mr-2 size-4" /> Generate my blueprint <ArrowUpRight className="ml-auto size-4" /></Button>
            <p className="text-xs leading-5 text-muted-foreground">This concept uses a built-in layout template. It is a planning aid, not a construction drawing.</p>
            </div>
          </form>

          <div className="min-w-0 border border-[#dedbd2] bg-white p-4 shadow-[0_12px_40px_rgba(32,35,28,0.04)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e8e5dc] pb-5">
              <div><p className="editorial-label text-gold">02 / LAYOUT CANVAS</p><h2 className="mt-2 font-display text-3xl md:text-4xl">{generated ? roomType.toUpperCase() : "YOUR CONCEPT PLAN"}</h2><p className="mt-2 text-sm text-muted-foreground">Top-down view of the room and suggested furniture zones.</p></div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={downloadSvg} disabled={!validDimensions}><Download className="mr-2 size-4" /> Export plan</Button>
                <Button type="button" variant="outline" onClick={() => window.print()}><Printer className="mr-2 size-4" /> Print</Button>
              </div>
            </div>

            <div className="mt-5 overflow-hidden border border-[#d8d3c7] bg-[#f5f2e9] p-2 sm:p-4">
              <svg id="blueprint-canvas" viewBox="0 0 800 600" role="img" aria-label={`Conceptual ${roomType} furniture blueprint, ${roomLength} by ${roomWidth} feet`} className="h-auto w-full">
                <defs>
                  <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ded8c9" strokeWidth="0.6" /></pattern>
                </defs>
                <rect width="800" height="600" fill="#f5f2e9" />
                <rect width="800" height="600" fill="url(#blueprint-grid)" />
                <text x="40" y="42" fontSize="13" letterSpacing="2.5" fill="#6b665a">UNI DESIGN GROUP / DESIGN LAB</text>
                <text x="40" y="67" fontSize="21" fontFamily="Georgia, serif" fill="#252923">{roomType.toUpperCase()} · CONCEPT PLAN</text>
                <text x="40" y="88" fontSize="12" fill="#6b665a">{style} / {budget} / NOT TO SCALE FOR CONSTRUCTION</text>

                <rect x={plan.x} y={plan.y} width={plan.roomW} height={plan.roomH} fill="#fbfaf5" stroke="#292d27" strokeWidth="7" />
                <rect x={plan.x + plan.roomW * 0.28} y={plan.y + plan.roomH} width={plan.roomW * 0.22} height="7" fill="#f5f2e9" />
                <path d={`M ${plan.x + plan.roomW * 0.28} ${plan.y + plan.roomH} A ${plan.roomW * 0.22} ${plan.roomW * 0.22} 0 0 1 ${plan.x + plan.roomW * 0.50} ${plan.y + plan.roomH - plan.roomW * 0.22}`} fill="none" stroke="#b9a77c" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1={plan.x + plan.roomW * 0.34} y1={plan.y} x2={plan.x + plan.roomW * 0.62} y2={plan.y} stroke="#7c9b9a" strokeWidth="5" />
                <line x1={plan.x} y1={plan.y - 18} x2={plan.x + plan.roomW} y2={plan.y - 18} stroke="#777365" strokeWidth="1" />
                <line x1={plan.x} y1={plan.y - 24} x2={plan.x} y2={plan.y - 12} stroke="#777365" strokeWidth="1" />
                <line x1={plan.x + plan.roomW} y1={plan.y - 24} x2={plan.x + plan.roomW} y2={plan.y - 12} stroke="#777365" strokeWidth="1" />
                <text x={plan.x + plan.roomW / 2} y={plan.y - 25} textAnchor="middle" fontSize="13" fill="#514d43">{roomLength} ft</text>
                <line x1={plan.x - 18} y1={plan.y} x2={plan.x - 18} y2={plan.y + plan.roomH} stroke="#777365" strokeWidth="1" />
                <line x1={plan.x - 24} y1={plan.y} x2={plan.x - 12} y2={plan.y} stroke="#777365" strokeWidth="1" />
                <line x1={plan.x - 24} y1={plan.y + plan.roomH} x2={plan.x - 12} y2={plan.y + plan.roomH} stroke="#777365" strokeWidth="1" />
                <text x={plan.x - 28} y={plan.y + plan.roomH / 2} textAnchor="middle" fontSize="13" fill="#514d43" transform={`rotate(-90 ${plan.x - 28} ${plan.y + plan.roomH / 2})`}>{roomWidth} ft</text>

                {plan.furniture.map((item, index) => (
                  <g key={`${item.label}-${index}`}>
                    <rect x={item.x} y={item.y} width={item.w} height={item.h} rx="2" fill={item.kind === "counter" ? "#ded7c6" : "#e8e2d4"} stroke={item.kind === "counter" ? "#9b927e" : "#777365"} strokeWidth="1.4" />
                    <text x={item.x + item.w / 2} y={item.y + item.h / 2 + 4} textAnchor="middle" fontSize={Math.max(8, Math.min(12, item.w / 8))} letterSpacing="0.5" fill="#49483f">{item.label}</text>
                  </g>
                ))}

                <g transform="translate(680 485)" stroke="#55594f" fill="none" strokeWidth="1.5"><circle r="20" /><path d="M0 -14 V14 M-14 0 H14" /><path d="M-9 -9 L9 9 M9 -9 L-9 9" /></g>
                <text x="40" y="548" fontSize="11" fill="#6b665a">SCHEMATIC FURNITURE PLACEMENT · VERIFY ON SITE</text>
                <text x="40" y="568" fontSize="10" fill="#6b665a">Style: {style} · Budget guide: {budget} · Area: {Math.round(roomLength * roomWidth)} sq ft</text>
              </svg>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="border-t border-gold pt-4"><p className="editorial-label text-gold">AREA</p><p className="mt-2 text-2xl font-display">{Math.round(roomLength * roomWidth)} sq ft</p></div>
              <div className="border-t border-gold pt-4"><p className="editorial-label text-gold">STYLE</p><p className="mt-2 text-lg">{style}</p></div>
              <div className="border-t border-gold pt-4"><p className="editorial-label text-gold">PRIORITIES</p><p className="mt-2 text-sm leading-6">{needs.length ? needs.join(", ") : "Open layout"}</p></div>
            </div>
            <div className="mt-6 flex items-start gap-3 border border-[#e5e0d4] bg-[#fbfaf7] p-4">
              <Check className="mt-0.5 size-4 shrink-0 text-gold" />
              <p className="text-sm leading-6 text-muted-foreground">Treat this as an early planning aid, not a measured architectural drawing. Door and window positions, structural elements, clearances and furniture sizes must be checked before implementation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
