import { AnimatedSlider } from "./components/slider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center font-sans">
      <div className="flex flex-col items-start justify-start w-[350px] gap-0.5 mb-6">
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
        <div className="w-[350px]">
          <AnimatedSlider
            label="Brightness"
            defaultValue={86}
            min={0}
            max={100}
          />
        </div>
      </div>
      <div className="absolute bottom-12 flex items-center justify-center">
        <Link href="https://github.com/bryanmonterrey/motion-slider" target="_blank">
          <Button variant="outline" size="icon" className="cursor-pointer bg-zinc-800 hover:bg-zinc-800 border-zinc-800">
            <Image src="/github.svg" alt="Github Logo" width={24} height={24} className="brightness-0 invert" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
