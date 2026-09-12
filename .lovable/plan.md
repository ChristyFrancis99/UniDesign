# UnI Design Group — Premium Architecture Website

## Goal
Build a complete, responsive architecture and interior-design portfolio that feels editorial, minimal, immersive, and image-led. The space and photography remain the primary experience; interactions stay restrained.

## Pages
- Home with the full requested sequence, from cinematic introduction through contact and footer
- Projects index with category filtering
- Dynamic project detail pages backed by reusable project data
- About, Services, 3D Experience, and Contact pages
- Shared transparent-to-solid navigation, mobile menu, consultation call-to-action, WhatsApp placeholders, and footer

## Visual system
- Apply the supplied warm-white, charcoal, and selective gold palette as semantic design tokens
- Use Cormorant Garamond for editorial headings and Manrope for body and interface text
- Create asymmetric, image-forward layouts with square edges, generous spacing, restrained borders, and no generic card grids
- Generate a cohesive set of high-quality architectural/interior images because no project photography was supplied; clearly structure them for later replacement
- Add subtle image reveals, text rises, navigation transitions, project hover treatments, reduced-motion behavior, and desktop-only contextual cursor

## Content and interactions
- Use only the factual company information supplied
- Use Mudra as the only named project and label other imagery as visual studies rather than inventing projects, locations, or achievements
- Add accessible project filtering, mobile service accordions, comparison slider, process progress, responsive navigation, and validated enquiry forms with local success feedback
- Leave WhatsApp and email actions visibly non-live until real contact details are supplied

## 3D architecture
- Build a dedicated `Interactive3DExperience` area and supporting controls/data structures for rooms, hotspots, camera positions, material options, loading, and fallback states
- Do not generate, download, or display any 3D room/model
- Keep the placeholder independent so the site works without a GLB/GLTF
- Lazy-initialize the interactive area near the viewport and document the future model insertion point in code

## Technical approach
- Use the existing TanStack Start/React stack rather than replacing the project framework
- Use Tailwind CSS v4 and the project’s component system
- Use lightweight CSS/IntersectionObserver motion rather than adding a large animation dependency where the same result is achievable
- Build metadata for every route, canonical links, semantic structure, responsive images, lazy loading, keyboard focus, and WebGL fallback messaging
- Keep project content in a CMS-ready typed data module, including optional model, hotspot, camera, and material fields

## Verification
- Confirm all routes render and navigation works
- Check the homepage, project detail, 3D placeholder, forms, mobile menu, and responsive layouts in the browser
- Verify the generated imagery, typography, contrast, reduced-motion handling, and absence of runtime/build errors
