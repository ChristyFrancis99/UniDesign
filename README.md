# UnI Design Group — Cinematic Studio Website

A Vite + React + TypeScript website for UnI Design Group, an architecture, interior and visualisation studio based in Pune, India.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Scroll experience

- GSAP + ScrollTrigger drive the homepage's scroll-linked image and panel timelines.
- Lenis provides smooth wheel scrolling and is synchronized with ScrollTrigger.
- Selected projects use a horizontally translating editorial track.
- The expertise section has a charcoal theme treatment.
- The interior walkthrough is scrubbed from page scroll using the source video.
- Reduced-motion preferences bypass the smooth-scroll and scrub effects.

## Replace imagery

Current homepage images are imported from `src/assets`:

- `uni-hero.jpg` — hero
- `studio.jpg` — studio introduction
- `mudra-living.jpg` — Mudra project and detail hotspot
- `mudra-detail.jpg` — material composition
- `architecture-study.jpg` — architecture and stone study
- `interior-study.jpg` — fabric and studio philosophy
- `cta-interior.jpg` — consultation CTA

Replace these files with optimized images while keeping the filenames, or update the imports in `src/components/scroll-home-experience.tsx` and `src/components/consultation-cta.tsx`.

Homepage copy, section IDs, palette and media path reference are centralized for reference in `src/config/homepage.ts`. The live section components remain the source of rendered copy.

## Replace the walkthrough video

The current video path is:

`public/animations/original-video.mp4`

The poster is:

`public/animations/interior-walkthrough/frame_001.png`

For more responsive frame seeking, encode an all-intra H.264 MP4 (every frame is a keyframe):

```bash
ffmpeg -i input.mp4 -an -c:v libx264 -preset slow -crf 18 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart public/animations/original-video.mp4
```

All-intra video improves random seeking but increases file size. Keep a compressed source backup and test on real iOS Safari devices. If seeking is still inconsistent on lower-powered phones, use the extracted image sequence as the frame-accurate fallback.

## Enquiry email

Set `VITE_CONTACT_EMAIL` in a local `.env` file:

```env
VITE_CONTACT_EMAIL=studio@example.com
```

Replace the example with the studio's real enquiry email. The form opens the visitor's email application with a prefilled message; it does not send mail from the server.

## Navigation and footer

The fixed header includes route navigation and a full-screen homepage section menu. Footer social/contact destinations should only be configured once the studio's verified URLs and contact details are available.

## Deployment

Build with `npm run build`. Deploy the generated Vite output using the repository's configured hosting provider (Netlify/Vercel). Configure `VITE_CONTACT_EMAIL` in the host's environment variables before publishing.

## Notes and assumptions

- The existing Vite + React + TanStack Router application is retained; this is not migrated to Next.js.
- The supplied project photographs and walkthrough video are reused. No fictitious 3D model, staff, awards, clients or contact details are added.
- A real 3D GLB/GLTF asset has not been supplied, so no fabricated room is rendered.
- Social links and WhatsApp number remain unconfigured until verified studio details are supplied.
- Scroll effects are simplified when `prefers-reduced-motion: reduce` is enabled.
