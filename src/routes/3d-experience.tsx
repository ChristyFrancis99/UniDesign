import { createFileRoute } from "@tanstack/react-router";
import { Interactive3DExperience } from "../components/interactive-3d-experience";

export const Route = createFileRoute("/3d-experience")({
  component: ThreeDExperiencePage,
});

function ThreeDExperiencePage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#f4f1eb]">
      <Interactive3DExperience />
    </main>
  );
}
