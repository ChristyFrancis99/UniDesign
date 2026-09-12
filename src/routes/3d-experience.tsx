import { createFileRoute } from "@tanstack/react-router";
import { Interactive3DExperience } from "../components/interactive-3d-experience";

export const Route = createFileRoute("/3d-experience")({
  component: ThreeDExperiencePage,
});

function ThreeDExperiencePage() {
  return (
    <main className="min-h-screen bg-secondary-charcoal">
      <Interactive3DExperience />
    </main>
  );
}
