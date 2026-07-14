import { Button } from "@/components/ui/Button";

export function PromotionBanner() {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col items-start gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-orange-600">
            限时优惠
          </p>
          <h2 className="text-xl font-semibold text-stone-900">
            满 ¥3,000 免配送费
          </h2>
          <p className="text-sm text-stone-600">
            新用户首单再享 95 折优惠，活动截至本月底。
          </p>
        </div>
        <Button href="/category/instant-noodles" variant="primary" size="md">
          立即选购
        </Button>
      </div>
    </section>
  );
}
