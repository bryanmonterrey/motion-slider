import { AnimatedSlider } from "./components/slider";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-start justify-start w-[400px] gap-0.5 mb-6">
        <div className="flex items-start gap-2 text-2xl font-semibold">
          Slider
        </div>
        <div className="flex flex-col items-start justify-start gap-0">
          <div className="flex justify-start gap-4 text-md text-neutral-600">
            made with tailwindcss and @motiondotdev.
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="w-[400px]">
          <AnimatedSlider
            label="Brightness"
            defaultValue={86}
            min={0}
            max={100}
          />
        </div>
      </div>
    </div>
  );
}
