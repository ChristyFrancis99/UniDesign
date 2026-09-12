# 3D interior model

The `/3d-experience` route loads:

`public/models/interior-room.glb`

## Supplied model notes

The original Blender GLB contains the bedroom/interior scene plus a large photographic panorama named `Sendai_City_Panorama...`. The website renderer automatically hides that panorama so it cannot distort the camera framing or cover the interior.

The website also normalizes the model scale, places the camera inside the room, enables interior-facing materials, and provides lighting and orbit controls.

## Model file size

Use the optimized website GLB for GitHub/local development. The original source export is over 100 MB and should not be committed directly.

For production hosting, `VITE_INTERIOR_MODEL_URL` can point to a public HTTPS model URL instead of `/models/interior-room.glb`.
