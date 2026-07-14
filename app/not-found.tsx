import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-6xl font-semibold text-stone-200">404</p>
      <h1 className="mt-4 text-xl font-semibold text-stone-900">页面未找到</h1>
      <p className="mt-2 text-sm text-stone-500">
        您访问的页面不存在，或商品已下架。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-800"
      >
        返回首页
      </Link>
    </div>
  );
}
