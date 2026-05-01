export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-aurora animate-aurora" />
      <div className="absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full bg-[oklch(0.78_0.13_295/0.45)] blur-3xl animate-blob" />
      <div
        className="absolute top-20 -right-32 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.85_0.13_70/0.4)] blur-3xl animate-blob"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute -bottom-40 left-1/3 h-[34rem] w-[34rem] rounded-full bg-[oklch(0.82_0.09_230/0.4)] blur-3xl animate-blob"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
