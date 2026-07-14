export function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-cover bg-center px-6 py-14 text-white shadow-[0_4px_32px_rgba(0,0,0,0.12)] sm:px-10 sm:py-20"
      style={{ backgroundImage: "url('/hero-banner.png')" }}
    >
      <div className="absolute inset-0 bg-stone-950/50" aria-hidden="true" />
      <div className="relative z-10 max-w-lg space-y-4">
        <p className="text-sm font-medium tracking-wide text-stone-300">
          东京华人超市 · 宅配到家
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          家乡味道，
          <br />
          新鲜送达
        </h1>
        <p className="text-base leading-relaxed text-stone-300">
          蔬菜、零食、调味料一应俱全。下单后当日配送，让您在异国也能轻松烹饪中餐。
        </p>
      </div>
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/5 sm:h-64 sm:w-64"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 right-12 h-32 w-32 rounded-full bg-white/5"
        aria-hidden
      />
    </section>
  );
}
