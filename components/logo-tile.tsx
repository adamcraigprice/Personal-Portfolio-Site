import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Logo on a light tile.
 *
 * The tile is not decoration: two of the marks (Marsh McLennan, Waterloo) are
 * near-black and would vanish against the dark card, so every logo gets the
 * same light backing to stay legible in both themes.
 *
 * `alt` is intentionally empty — the company or school name always sits
 * directly beside the logo, so labelling the image repeats it for screen
 * readers.
 */
export function LogoTile({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-border/60",
        "bg-white p-1.5 shadow-sm",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        width={64}
        height={64}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
