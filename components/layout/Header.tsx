"use client";

import { useEffect, useState, useTransition, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { CartLink } from "@/components/layout/CartLink";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigatingAdmin, setIsNavigatingAdmin] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isNavigatingAdmin) {
      setIsNavigatingAdmin(false);
    }
  }, [pathname, isNavigatingAdmin]);

  function handleAdminClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (isNavigatingAdmin) return;
    setIsNavigatingAdmin(true);
    startTransition(() => {
      router.push("/admin");
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#FAFAF8]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            SHOW LIFE
          </span>
          <span className="text-xs text-stone-500">中华食材宅配</span>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            onClick={handleAdminClick}
            aria-busy={isNavigatingAdmin || isPending}
            className={`rounded-full px-3 py-2 text-sm transition-colors ${
              isNavigatingAdmin || isPending
                ? "cursor-not-allowed text-stone-300"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            {isNavigatingAdmin || isPending ? "进入中..." : "管理后台"}
          </a>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
