/**
 * Decorative soft radial glow behind the hero. Purely presentational —
 * hidden from assistive tech, and the drift stops under reduced motion
 * (handled globally in globals.css).
 */
export function GradientMesh() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ opacity: "var(--mesh-opacity)" }}
    >
      <div
        className="absolute left-[10%] top-[-10%] h-[38rem] w-[38rem] rounded-full
                   bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.55),transparent_65%)]
                   blur-3xl animate-drift-a"
      />
      <div
        className="absolute right-[5%] top-[10%] h-[32rem] w-[32rem] rounded-full
                   bg-[radial-gradient(circle_at_center,hsl(var(--accent-alt)/0.45),transparent_65%)]
                   blur-3xl animate-drift-b"
      />
      <div
        className="absolute bottom-[-15%] left-[30%] h-[26rem] w-[26rem] rounded-full
                   bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.3),transparent_70%)]
                   blur-3xl animate-drift-b"
      />
    </div>
  );
}
