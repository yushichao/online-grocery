"use client";

import Link, { useLinkStatus } from "next/link";

function AdminLinkLabel() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-busy={pending}
      className={`block transition-colors ${
        pending
          ? "cursor-wait text-stone-300"
          : "text-stone-500 group-hover:text-stone-900"
      }`}
    >
      {pending ? "进入中..." : "管理后台"}
    </span>
  );
}

export function AdminLink() {
  return (
    <Link
      href="/admin"
      className="group rounded-full px-3 py-2 text-sm transition-colors hover:bg-stone-100"
    >
      <AdminLinkLabel />
    </Link>
  );
}
