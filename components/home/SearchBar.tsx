interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  return (
    <form action="/" method="get" className="relative">
      <label htmlFor="search" className="sr-only">
        搜索商品
      </label>
      <input
        id="search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="搜索商品名称..."
        className="w-full rounded-full border border-stone-200 bg-white py-3.5 pl-12 pr-4 text-stone-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] outline-none transition-shadow placeholder:text-stone-400 focus:border-stone-300 focus:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
      />
      <SearchIcon />
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
