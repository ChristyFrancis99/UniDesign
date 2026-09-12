# Local 3D model

Place the interior model here as:

`public/models/interior-room.glb`

The GLB is intentionally ignored by Git because large binary files should not be committed to the repository.

For production, set `VITE_INTERIOR_MODEL_URL` in the deployment environment to a public HTTPS URL for the GLB (CDN/object storage recommended).
