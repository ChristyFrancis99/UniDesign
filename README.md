# Space Weaver

# BUILD A COMPLETE PREMIUM ARCHITECTURE & INTERIOR DESIGN WEBSITE

Create a complete, production-quality website for **UnI Design Group**, an architecture and interior-design studio.

The website must feel like a combination of:

* a premium architecture magazine
* a luxury interior-design portfolio
* an immersive digital showroom

It must NOT look like a generic corporate template, real-estate website, or overly animated WebGL experiment.

The central design philosophy is:

> **THE SPACE IS THE INTERFACE.**

Use real project photography and architectural imagery wherever possible. Make the design elegant, editorial, minimal and highly visual.

---

# 1. BRAND IDENTITY

Brand name:

**UnI Design Group**

Primary services:

* Architecture
* Interior Design
* 3D Visualisation
* Liaisoning & Sanctioning

The brand should communicate:

* sophistication
* architectural precision
* creativity
* professionalism
* premium interiors
* attention to detail
* modernity

Do not invent awards, years of experience, number of projects, clients, certifications or achievements.

Only use factual information provided in the project content.

---

# 2. VISUAL STYLE

Use:

**Luxury Architectural Editorial**

The website should have:

* large cinematic imagery
* generous whitespace
* strong typography
* asymmetrical editorial layouts
* subtle gold accents
* elegant transitions
* restrained micro-interactions
* immersive project presentation
* minimal UI

Avoid:

* excessive cards
* excessive rounded corners
* gradients everywhere
* excessive shadows
* excessive icons
* emoji
* generic stock illustrations
* bright yellow backgrounds
* excessive WebGL effects
* unnecessary animations

The photography and spaces should remain the primary visual focus.

---

# 3. COLOR SYSTEM

Use the following palette:

```text
Warm White
#F7F6F2

Charcoal
#171717

Secondary Charcoal
#292929

Brand Gold
#E5B82E

Muted Gold
#CFA83A

Light Grey
#E8E7E2

White
#FFFFFF
```

Overall ratio:

```text
80% neutral
15% charcoal
5% gold
```

Gold should be used selectively for:

* logo details
* active navigation
* project numbers
* thin lines
* hover states
* CTA accents
* selected 3D controls
* small labels

Do not make the entire website yellow/gold.

---

# 4. TYPOGRAPHY

Use:

### Headings

**Cormorant Garamond**

Use for:

* hero headings
* major section headings
* project titles
* editorial statements

### Body/UI

**Manrope**

Use for:

* paragraphs
* navigation
* buttons
* labels
* forms
* metadata

Desktop type scale:

```text
Hero heading:       76–96px
Section heading:    52–64px
Project heading:    42–52px
Subheading:         20–24px
Body:               16–18px
Navigation:         13–14px
Small labels:       10–12px
```

Mobile:

```text
Hero heading:       44–52px
Section heading:    36–42px
Project heading:    30–36px
Body:               15–17px
Navigation:         13px
```

Use generous line-height.

---

# 5. GLOBAL LAYOUT

Use a maximum content width of approximately:

**1440px**

Desktop side margins:

**5–7vw**

Desktop:

**12-column grid**

Tablet:

**8-column grid**

Mobile:

**4-column grid**

Mobile horizontal padding:

**20px**

Do not allow content to stretch indefinitely on ultra-wide screens.

---

# 6. WEBSITE STRUCTURE

Create these pages:

```text
/
Home

/projects
Projects

/projects/[slug]
Individual Project

/about
About

/services
Services

/3d-experience
3D Experience

/contact
Contact
```

The homepage should provide previews of all major areas.

---

# 7. GLOBAL NAVIGATION

Create a transparent navigation bar over the hero.

Desktop layout:

```text
UnI                         Projects
Design Group                About
                            Services
                            3D Experience
                            Contact

                            START A PROJECT →
```

Logo:

**UnI**

Small supporting text:

**DESIGN GROUP**

Navigation:

* Projects
* About
* Services
* 3D Experience
* Contact

CTA:

**START A PROJECT →**

Use a thin gold underline/accent.

---

# 8. NAVIGATION BEHAVIOUR

Initial state:

```text
opacity: 0
translateY(-20px)
```

After hero begins loading:

```text
opacity: 1
translateY(0)
duration: 800ms
```

When scrolling:

Navigation becomes:

* warm-white background
* charcoal text
* subtle backdrop blur
* thin bottom border

Keep the transition smooth.

---

# 9. HOMEPAGE

The homepage sequence must be:

```text
01 Navigation

02 Hero

03 Studio Introduction

04 Services

05 Selected Projects

06 3D Experience

07 Design Philosophy

08 3D → Real Space

09 Project Categories

10 About / Team

11 Design Process

12 Consultation CTA

13 Contact

14 Footer
```

---

# 10. HERO SECTION

Create a full-screen hero.

Height:

**100vh**

Minimum height:

**720px**

Use a large, high-quality UnI interior/architecture image.

Do NOT use generic stock photography if project photography is available.

Hero image:

```css
object-fit: cover;
```

Apply only a subtle dark overlay of approximately 15–25%.

Content should sit toward the bottom-left.

Display:

```text
ARCHITECTURE · INTERIOR · VISUALISATION

DESIGNING
SPACES THAT
FEEL DISTINCT.

UnI Design Group creates thoughtful architectural
and interior environments shaped around people,
purpose and detail.

EXPLORE PROJECTS        START A PROJECT →
```

Create a visually strong editorial hierarchy.

---

# 11. HERO ANIMATION

On page load:

1. image reveals using a clip-path animation
2. logo fades in
3. heading rises upward
4. description appears
5. buttons appear
6. scroll indicator appears

Suggested sequence:

```text
0ms      image
400ms    logo
600ms    heading
900ms    description
1100ms   buttons
1400ms   scroll indicator
```

Do not make this flashy.

---

# 12. SCROLL INDICATOR

At the bottom center:

```text
SCROLL
↓
```

Use a thin animated vertical line.

Animation:

```text
height: 0 → 40px
duration: 2.5s
loop
```

---

# 13. STUDIO INTRODUCTION

Warm-white background.

Height:

Approximately 600–750px.

Small label:

```text
01 — THE STUDIO
```

Large heading:

```text
WE CREATE SPACES
WITH CHARACTER.
```

Body:

```text
From architecture and interior design to 3D
visualisation and liaisoning, UnI Design Group
approaches every space through a balance of
form, function and detail.
```

Use a large editorial two-column composition.

Animation:

```text
opacity: 0 → 1
translateY: 50px → 0
```

Animate the gold line from:

```text
width: 0 → 80px
```

---

# 14. SERVICES SECTION

Heading:

```text
WHAT WE DO
```

Create four services:

```text
01
ARCHITECTURE

02
INTERIOR DESIGN

03
3D VISUALISATION

04
LIAISONING & SANCTIONING
```

Do NOT use generic rectangular cards.

Use four large horizontal editorial rows.

Example:

```text
01     ARCHITECTURE                         →
       Spatial planning and architectural design
```

```text
02     INTERIOR DESIGN                      →
       Thoughtful residential and commercial interiors
```

```text
03     3D VISUALISATION                     →
       Visualising spaces before they are built
```

```text
04     LIAISONING & SANCTIONING             →
       Coordination and approval services
```

Hover:

* background becomes charcoal
* text becomes white
* number becomes gold
* arrow moves approximately 15px
* transition 400ms

---

# 15. SELECTED PROJECTS

Heading:

```text
SELECTED WORK
```

Subheading:

```text
A selection of spaces shaped through design,
material and detail.
```

Do NOT use a conventional three-column card grid.

Use an editorial portfolio layout.

Project 01:

```text
01

MUDRA

3BHK RESIDENCE
PUNE

VIEW PROJECT →
```

Use:

**60% image / 40% text**

Project 02:

Reverse the layout.

Project 03:

Use a large full-width image.

Use actual project information where available.

Do not fabricate project details.

---

# 16. PROJECT IMAGE INTERACTION

On hover:

```text
scale: 1.00 → 1.05
duration: 800ms
```

Keep text stationary.

Project number can subtly shift.

Use smooth easing.

---

# 17. PROJECT DETAIL PAGES

Every major project should have its own dynamic page.

Example:

```text
MUDRA

3BHK RESIDENCE
PUNE
```

Use a full-screen hero project photograph.

Then:

```text
PROJECT INFORMATION

TYPE
Residential

LOCATION
Pune

SCOPE
Interior Design

APPROACH
Concept • Space • Material • Detail
```

Only show information that is actually available.

---

# 18. PROJECT GALLERY

Use an editorial masonry-style gallery.

Example:

```text
Large image

Two smaller images

Full-width image

Two-column gallery

Large detail image
```

Images should not all have identical dimensions.

Use lazy loading.

Use high-quality responsive image optimization.

---

# 19. 3D EXPERIENCE — MAIN FEATURE

This is the major interactive feature of the website.

Create a dark charcoal section.

Heading:

```text
STEP INSIDE.
```

Subheading:

```text
Experience the space before it is built.
```

---

# 20. IMPORTANT 3D MODEL PLACEHOLDER

DO NOT generate or invent the 3D model.

I will provide the 3D model separately.

Create a dedicated, clearly isolated component:

```text
<Interactive3DExperience />
```

The component must be designed so that I can later insert my own:

```text
.glb
.gltf
```

Blender model.

Create a placeholder canvas/container with:

```text
id="3d-space"
```

or an equivalent React component.

The rest of the website must work even if the model is not yet inserted.

For now display an elegant placeholder:

```text
3D EXPERIENCE

MODEL PLACEHOLDER

Interactive architectural space
will appear here.
```

Do NOT create a fake room.

Do NOT substitute a random 3D asset.

Do NOT use a generic model.

Keep the 3D area visually integrated with the website.

---

# 21. 3D CANVAS SPECIFICATION

Desktop:

```text
width: 100%
height: 850–1000px
```

The future model should use:

* human eye-level camera
* approximately 1.6m camera height
* smooth orbit/look controls
* controlled zoom
* smooth camera transitions

Default viewpoint should feel like the visitor is standing inside the room.

Do not start by facing a blank wall.

---

# 22. 3D CONTROL UI

Place controls unobtrusively.

Bottom-left:

```text
DRAG
LOOK AROUND
```

Bottom-right:

```text
+
−
```

Top-right:

```text
ROOM

LIVING
KITCHEN
BEDROOM
```

Controls should only appear when useful.

Keep them minimal.

---

# 23. 3D INTERACTION ARCHITECTURE

Prepare the code for:

### Mouse

Left drag:

```text
look around
```

Scroll:

```text
zoom
```

Hotspot click:

```text
show information
```

### Mobile

One finger:

```text
look around
```

Pinch:

```text
zoom
```

Swipe:

```text
rotate
```

Tap hotspot:

```text
information
```

---

# 24. 3D HOTSPOTS

Prepare support for small gold hotspot points.

Example:

```text
●
```

Clicking the point opens a minimal information panel.

Example:

```text
CUSTOM SEATING

Designed as part of the
spatial composition.

VIEW DETAIL →
```

Do not fill the entire scene with hotspots.

The hotspot system must be easy to configure later.

---

# 25. 3D ROOM SWITCHING

Prepare the architecture for:

```text
LIVING ROOM
DINING
KITCHEN
BEDROOM
```

Clicking a room should smoothly move the camera to a predefined position.

Transition:

**1.2–1.8 seconds**

Use:

```text
easeInOutCubic
```

The code should allow me to later define camera positions for each room.

---

# 26. 3D MATERIAL EXPLORER

Prepare an optional interface for future use.

```text
MATERIAL EXPLORER

FLOOR
○ Marble
○ Wood
○ Stone

WALL
○ Warm
○ Neutral
○ Textured

LIGHTING
○ Day
○ Evening
```

Do not implement fake material switching unless the model supports it.

Create the UI and data structure so materials can be connected later.

---

# 27. 3D LOADING EXPERIENCE

Never show a blank canvas while loading.

Display:

```text
UnI

ENTERING THE SPACE

██████████░░░░░░ 68%
```

After loading:

```text
ENTER SPACE →
```

The loading UI should disappear smoothly.

---

# 28. 3D PERFORMANCE

Prepare the implementation for optimized GLB/GLTF models.

Expected pipeline:

```text
BLENDER
↓
OPTIMIZATION
↓
GLB / GLTF
↓
THREE.JS
↓
REACT THREE FIBER
```

Prepare support for:

* Draco compression
* KTX2/Basis textures
* lazy loading
* baked lighting
* LOD where appropriate

Target interactive scene size:

**approximately 15–25 MB or less whenever practical.**

Do not load the 3D scene until the visitor reaches or approaches the 3D section.

---

# 29. 3D FALLBACK

If WebGL is unavailable or device performance is poor:

show:

```text
Interactive 3D unavailable

EXPLORE THE SPACE →
```

Prepare a fallback area where a lightweight panorama or rendered experience can later be inserted.

Do not break the page.

---

# 30. DESIGN PHILOSOPHY

After the dark 3D section, return to warm white.

Create large editorial typography:

```text
FORM.
MATERIAL.
LIGHT.
DETAIL.
```

Create four sections.

FORM:

```text
Proportion and geometry shape
the character of a space.
```

MATERIAL:

```text
Materials bring texture,
warmth and identity.
```

LIGHT:

```text
Lighting defines how a space
is perceived throughout the day.
```

DETAIL:

```text
Small decisions create
the finished experience.
```

These are design-philosophy statements, not claims about company achievements.

---

# 31. 3D TO REAL SPACE SECTION

Create a split-screen comparison.

Heading:

```text
FROM VISION
TO SPACE.
```

Left:

```text
3D VISUALISATION
```

Right:

```text
COMPLETED SPACE
```

Create an interactive draggable comparison slider.

User drags:

```text
← 3D                    REAL →
```

Use real project imagery where available.

---

# 32. PROJECT CATEGORIES

Create a full-width charcoal section.

Heading:

```text
EXPLORE OUR WORK
```

Categories:

```text
RESIDENTIAL
COMMERCIAL
ARCHITECTURE
INTERIORS
3D VISUALISATION
```

When the user hovers over a category:

* corresponding project image appears
* typography remains dominant
* image moves subtly
* transition remains smooth

Do not overload this section with effects.

---

# 33. ABOUT SECTION

Use a large studio/team/project image.

Heading:

```text
DESIGNING WITH PURPOSE.
```

Text:

```text
UnI Design Group brings architecture,
interior design and visualisation together
to create considered spaces.
```

If accurate, display:

```text
PAN INDIA
```

Do not invent additional company statistics.

---

# 34. TEAM SECTION

Do not create fake employee cards.

Use a large team/studio photograph.

Heading:

```text
THE PEOPLE
BEHIND THE SPACES
```

CTA:

```text
MEET THE TEAM →
```

Prepare the architecture for individual team profiles to be added later.

---

# 35. DESIGN PROCESS

Use a dark charcoal section.

Heading:

```text
FROM IDEA
TO REALITY.
```

Five stages:

```text
01 DISCOVER

02 CONCEPT

03 VISUALISE

04 DEVELOP

05 REALISE
```

Create a thin gold horizontal progress line.

As the user scrolls:

* line progresses
* each stage becomes active
* number changes to gold
* description appears

Keep animation subtle.

---

# 36. CONSULTATION CTA

Create a large image-backed section.

Height:

**650–750px**

Use a beautiful interior image with dark overlay.

Center content:

```text
HAVE A SPACE
IN MIND?

Let's start a conversation.

BOOK A FREE CONSULTATION →
```

The CTA should be highly visible but elegant.

---

# 37. CONTACT SECTION

Heading:

```text
START YOUR PROJECT
```

Create a clean form:

```text
Name
Email
Phone
Project Type
Location
Tell us about your project
```

CTA:

```text
SEND ENQUIRY →
```

Project type options:

```text
Residential Interior
Commercial Interior
Architecture
3D Visualisation
Liaisoning & Sanctioning
Other
```

Keep the form short.

Do not ask unnecessary questions.

Add proper validation.

Display elegant error and success states.

---

# 38. WHATSAPP CTA

Add a subtle floating WhatsApp CTA on desktop:

```text
WhatsApp ↗
```

On mobile create a fixed bottom bar:

```text
[ WHATSAPP ]       [ BOOK CONSULTATION ]
```

Do not make it an intrusive popup.

Connect it to the actual business WhatsApp number when provided.

---

# 39. FOOTER

Use charcoal background.

Large:

```text
UnI
DESIGN GROUP
```

Services:

```text
Architecture
Interior Design
3D Visualisation
Liaisoning & Sanctioning
```

Navigation:

```text
PROJECTS
ABOUT
SERVICES
3D EXPERIENCE
CONTACT
```

Social/contact:

```text
INSTAGRAM
WHATSAPP
EMAIL
```

Bottom:

```text
© UnI Design Group
```

---

# 40. PAGE TRANSITIONS

For navigation between pages use subtle transitions.

Project image may slightly expand.

Then transition into the next page.

Duration:

```text
600–900ms
```

Avoid cinematic transitions that slow navigation.

---

# 41. GLOBAL SCROLL ANIMATIONS

Use subtle reveal animations.

Text:

```text
opacity: 0 → 1
translateY: 40px → 0
```

Images:

```text
clip-path:
inset(0 100% 0 0)
→
inset(0 0 0 0)
```

Project images:

```text
scale: 1.03 → 1
```

Do not animate everything.

Some elements should remain static.

---

# 42. DESKTOP CURSOR

On desktop only, create a minimal custom cursor.

Normal:

```text
small circular dot
```

Over project:

```text
VIEW
PROJECT
```

Over 3D:

```text
ENTER
SPACE
```

Over CTA:

```text
OPEN →
```

Disable custom cursor completely on mobile/tablet touch devices.

---

# 43. MOBILE NAVIGATION

Desktop navigation must transform into a full-screen mobile menu.

Header:

```text
UnI                         ☰
```

Menu:

```text
PROJECTS

ABOUT

SERVICES

3D EXPERIENCE

CONTACT

────────────

START A PROJECT →
```

Use large editorial typography.

Animate menu opening smoothly.

---

# 44. MOBILE HERO

Hero:

**90–100vh**

Composition:

```text
FULL SCREEN IMAGE

ARCHITECTURE
INTERIOR
VISUALISATION

DESIGNING
SPACES THAT
FEEL DISTINCT.

EXPLORE PROJECTS

↓
```

Optimize text size and placement for portrait screens.

---

# 45. MOBILE SERVICES

Convert horizontal service rows into accordions.

```text
01 ARCHITECTURE             +

02 INTERIOR DESIGN          +

03 3D VISUALISATION         +

04 LIAISONING               +
```

On tap:

```text
03 3D VISUALISATION         −

Visualise the space before
construction begins.
```

Use smooth height transitions.

---

# 46. MOBILE PROJECTS

Each project becomes vertical:

```text
IMAGE

01

MUDRA

3BHK RESIDENCE
PUNE

VIEW PROJECT →
```

Then the next project.

Do not preserve desktop side-by-side layouts on small screens.

---

# 47. MOBILE 3D

Create a dedicated mobile 3D layout.

Height:

**70–80vh**

Top:

```text
STEP INSIDE
```

Canvas:

```text
[3D MODEL PLACEHOLDER]
```

Bottom controls:

```text
LIVING
KITCHEN
BEDROOM
```

Instruction:

```text
Drag to explore
```

Do not make the canvas excessively tall.

---

# 48. MOBILE 3D PERFORMANCE

Detect weak devices where possible.

If performance is poor:

replace the full 3D experience with a lightweight fallback.

Do not make the website feel broken.

---

# 49. MOBILE CONTACT

Keep:

```text
NAME
PHONE
EMAIL
PROJECT TYPE
MESSAGE

SEND ENQUIRY
```

Use large touch targets.

---

# 50. RESPONSIVE BREAKPOINTS

Implement:

```text
320–767px       Mobile

768–1023px      Tablet

1024–1439px     Desktop

1440px+         Large desktop
```

At widths above 1600px keep the content constrained.

---

# 51. ACCESSIBILITY

Implement:

* semantic HTML
* proper heading hierarchy
* keyboard navigation
* visible focus states
* meaningful button labels
* alt text for images
* sufficient color contrast
* reduced-motion support
* WebGL fallback

When:

```text
prefers-reduced-motion
```

is enabled:

reduce:

* parallax
* cursor effects
* page transitions
* scroll animations

Do not remove essential functionality.

---

# 52. TECHNICAL STACK

Use:

### Framework

**Next.js**

### Frontend

**React**

### Styling

**Tailwind CSS**

### Animation

**GSAP**

Use GSAP for:

* page transitions
* scroll sequences
* image reveals
* typography animation
* timeline animations

### 3D

**Three.js**

and:

**React Three Fiber**

### 3D utilities

**@react-three/drei**

### 3D asset workflow

```text
Blender → GLB/GLTF
```

### Image optimization

Use:

**Next.js Image**

---

# 53. 3D CODE ARCHITECTURE

Keep the 3D experience isolated from the rest of the application.

Recommended structure:

```text
components/
    3d/
        Interactive3DExperience.tsx
        ModelLoader.tsx
        CameraControls.tsx
        Hotspots.tsx
        RoomSelector.tsx
        MaterialExplorer.tsx
        LoadingScreen.tsx
        WebGLFallback.tsx
```

The rest of the site must not depend on the 3D model being available.

---

# 54. PROJECT DATA ARCHITECTURE

Do not hardcode every project page.

Prepare a project data structure:

```text
projects/
    title
    slug
    category
    location
    type
    description
    heroImage
    gallery[]
    year
    details
    model3D
```

The `model3D` field should remain optional.

Example:

```text
model3D: null
```

until I provide the actual model.

This allows projects to be added without rewriting the website.

---

# 55. IMAGE HANDLING

Prepare image placeholders for:

```text
Hero
Projects
Project galleries
About
Team
3D → Real comparison
Category hover images
CTA
```

Use descriptive placeholder names such as:

```text
/placeholder/hero-interior.jpg

/placeholder/project-mudra-01.jpg

/placeholder/project-mudra-02.jpg

/placeholder/team.jpg

/placeholder/about.jpg
```

Do not use random unrelated stock imagery.

Make it easy for me to replace the placeholder files.

---

# 56. CMS-READY ARCHITECTURE

The portfolio should eventually support a CMS.

Prepare the project schema for:

```text
title
category
location
description
hero image
gallery
year
project details
3D model
3D hotspots
camera positions
materials
```

The UI should not need redesigning when CMS support is connected later.

---

# 57. PERFORMANCE

Prioritize:

* fast initial page load
* lazy-loaded images
* responsive image sizes
* lazy-loaded 3D
* optimized fonts
* minimal JavaScript where possible
* code splitting
* GPU-friendly animations
* no unnecessary libraries

Do not load the 3D model on initial page load.

Only initialize it when required.

---

# 58. SEO

Every page must support:

* unique title
* meta description
* Open Graph image
* canonical URL
* semantic HTML
* descriptive image alt text

Project pages should have SEO-friendly metadata.

Example:

```text
UnI Design Group | Architecture & Interior Design
```

Do not keyword-stuff.

---

# 59. UX PRINCIPLE

The user's journey should feel like:

```text
BEAUTIFUL SPACE
       ↓
INTEREST
       ↓
PROJECTS
       ↓
3D EXPERIENCE
       ↓
TRUST
       ↓
PROCESS
       ↓
CONSULTATION
       ↓
CONTACT
```

The site should continuously communicate:

> These people don't just show spaces. They help you imagine living in them.

---

# 60. MOST IMPORTANT DESIGN RULE

Do not make the website impressive merely through animations.

The hierarchy must always be:

```text
SPACE
↓
PHOTOGRAPHY
↓
TYPOGRAPHY
↓
CONTENT
↓
INTERACTION
↓
ANIMATION
```

Animation supports the architecture; it must never compete with it.

---

# 61. FINAL VISUAL EXPERIENCE

The final website should feel like:

**Architecture magazine**

*

**Luxury interior portfolio**

*

**Interactive 3D showroom**

with a restrained, premium visual identity.

The major technological differentiator is the future interactive 3D space.

The visitor should eventually be able to:

```text
ENTER THE SPACE
       ↓
LOOK AROUND
       ↓
EXPLORE ROOMS
       ↓
CLICK DESIGN HOTSPOTS
       ↓
EXAMINE MATERIALS
       ↓
CHANGE LIGHTING
       ↓
COMPARE 3D WITH REAL SPACE
       ↓
VIEW PROJECT
       ↓
BOOK CONSULTATION
```

---

# 62. IMPORTANT — DO NOT INVENT THE 3D MODEL

The website generator must only create the **3D infrastructure and placeholder**.

Do not generate:

* a random living room model
* a random house
* a random architectural model
* a stock GLB
* an AI-generated 3D scene

Instead create:

```text
[ INTERACTIVE 3D MODEL AREA ]

3D MODEL WILL BE INSERTED HERE
```

The component must be ready for my own Blender-exported GLB/GLTF asset.

---

# 63. FINAL DELIVERABLE

Generate the complete responsive website with:

* homepage
* project listing
* project detail template
* services
* about
* 3D experience page
* contact page
* navigation
* footer
* responsive mobile navigation
* project gallery
* project filtering/category system
* animations
* page transitions
* hover interactions
* consultation CTA
* WhatsApp CTA
* accessible forms
* SEO structure
* optimized image handling
* 3D placeholder architecture
* WebGL fallback
* CMS-ready project architecture

Use clean, maintainable component-based code.

Do not create unnecessary complexity.

The finished result should look like a **premium architecture/interior-design studio website**, not an AI-generated template.

The visual goal is:

> **MINIMAL. EDITORIAL. ARCHITECTURAL. IMMERSIVE. PREMIUM.**

And the central experience should communicate:

> **THE SPACE IS THE INTERFACE.**

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/03e8cf60-7cfe-4385-8e36-c3168ea5a3b1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
