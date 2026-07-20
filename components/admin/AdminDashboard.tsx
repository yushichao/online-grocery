"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { logout } from "@/app/admin/login/actions";
import { useProducts } from "@/context/ProductContext";
import { categories } from "@/lib/data/categories";
import type { CategorySlug, Order, OrderStatus, Product } from "@/lib/types";
import { compressProductImage } from "@/lib/utils/compress-product-image";
import { formatPrice } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/product-image-url";

type AdminTab = "orders" | "products";

const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "待确认" },
  { value: "confirmed", label: "已确认" },
  { value: "preparing", label: "处理中" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  nameJa: "",
  description: "",
  price: 0,
  stock: 0,
  categorySlug: "vegetables",
  unit: "",
  popular: false,
  active: true,
  imagePath: null,
};

export function AdminDashboard({
  initialOrders,
  initialProducts,
}: {
  initialOrders: Order[];
  initialProducts: Product[];
}) {
  const [tab, setTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
              管理后台
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              Supabase
            </span>
          </div>
          <p className="text-sm text-stone-500">
            管理订单状态、商品信息、价格与库存。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full bg-stone-100 p-1">
            <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
              订单（{orders.length}）
            </TabButton>
            <TabButton
              active={tab === "products"}
              onClick={() => setTab("products")}
            >
              商品（{products.length}）
            </TabButton>
          </div>
          <form action={logout}>
            <button className="text-sm text-stone-500 hover:text-stone-900">
              退出
            </button>
          </form>
        </div>
      </header>

      {tab === "orders" ? (
        <OrderManager orders={orders} setOrders={setOrders} />
      ) : (
        <ProductManager products={products} setProducts={setProducts} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
      }`}
    >
      {children}
    </button>
  );
}

function OrderManager({
  orders,
  setOrders,
}: {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}) {
  const [error, setError] = useState("");

  async function changeStatus(orderId: string, status: OrderStatus) {
    const previous = orders;
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("订单状态更新失败");
      setError("");
    } catch {
      setOrders(previous);
      setError("订单状态更新失败，请重试");
    }
  }

  if (orders.length === 0) {
    return <EmptyState message="还没有顾客订单" />;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-3xl bg-white p-5 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-6"
        >
          <div className="flex flex-col gap-4 border-b border-stone-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-sm font-semibold text-stone-900">
                {order.id}
              </p>
              <p className="mt-1 text-xs text-stone-400">
                {new Date(order.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-stone-500">
              订单状态
              <select
                value={order.status ?? "pending"}
                onChange={(event) =>
                  void changeStatus(
                    order.id,
                    event.target.value as OrderStatus,
                  )
                }
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 font-medium text-stone-900 outline-none focus:border-stone-400"
              >
                {orderStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 pt-4 md:grid-cols-2">
            <dl className="space-y-2 text-sm">
              <InfoRow label="顾客" value={order.formData.customerName} />
              <InfoRow label="电话" value={order.formData.phone} />
              <InfoRow label="地址" value={order.formData.address} />
              <InfoRow label="时间" value={order.formData.deliveryTime} />
              {order.formData.notes ? (
                <InfoRow label="备注" value={order.formData.notes} />
              ) : null}
            </dl>
            <div className="space-y-2 text-sm">
              {order.items.map((item) => (
                <div
                  key={`${order.id}-${item.productId}`}
                  className="flex justify-between gap-4 text-stone-600"
                >
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-stone-100 pt-2 font-semibold text-stone-900">
                <span>合计</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[4rem_1fr] gap-2">
      <dt className="text-stone-400">{label}</dt>
      <dd className="break-words text-stone-700">{value}</dd>
    </div>
  );
}

function ProductManager({
  products,
  setProducts,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}) {
  const { refreshProducts } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  function startCreate() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function startEdit(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          + 新增商品
        </button>
      </div>

      {showForm ? (
        <ProductForm
          key={editingProduct?.id ?? "new-product"}
          product={editingProduct}
          onCancel={() => setShowForm(false)}
          onSave={async (data, imageFile) => {
            let uploadedPath: string | null = null;
            try {
              if (imageFile) {
                const uploadBody = new FormData();
                uploadBody.append("image", imageFile);
                const uploadResponse = await fetch(
                  "/api/admin/product-images",
                  { method: "POST", body: uploadBody },
                );
                const uploadResult = (await uploadResponse.json()) as {
                  path?: string;
                  error?: string;
                };
                if (!uploadResponse.ok || !uploadResult.path) {
                  throw new Error(uploadResult.error ?? "图片上传失败");
                }
                uploadedPath = uploadResult.path;
              }

              const response = await fetch(
                editingProduct
                  ? `/api/admin/products/${editingProduct.id}`
                  : "/api/admin/products",
                {
                  method: editingProduct ? "PATCH" : "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...data,
                    imagePath: uploadedPath ?? data.imagePath,
                  }),
                },
              );
              if (!response.ok) {
                const result = (await response.json()) as { error?: string };
                throw new Error(result.error ?? "商品保存失败");
              }
              const saved = (await response.json()) as Product;
              if (editingProduct) {
                setProducts((current) =>
                  current.map((product) =>
                    product.id === saved.id ? saved : product,
                  ),
                );
              } else {
                setProducts((current) => [...current, saved]);
              }
              await refreshProducts();
              setShowForm(false);
            } catch (saveError) {
              if (uploadedPath) {
                await fetch("/api/admin/product-images", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ path: uploadedPath }),
                }).catch(() => undefined);
              }
              throw saveError;
            }
          }}
        />
      ) : null}

      <div className="overflow-x-auto rounded-3xl bg-white shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-stone-100 text-xs text-stone-400">
              <tr>
                <th className="px-5 py-4 font-medium">商品</th>
                <th className="px-5 py-4 font-medium">分类</th>
                <th className="px-5 py-4 font-medium">价格</th>
                <th className="px-5 py-4 font-medium">库存</th>
                <th className="px-5 py-4 font-medium">规格</th>
                <th className="px-5 py-4 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-stone-900">{product.name}</p>
                    <p className="text-xs text-stone-400">{product.nameJa}</p>
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {categories.find((item) => item.slug === product.categorySlug)
                      ?.name ?? product.categorySlug}
                  </td>
                  <td className="px-5 py-4 font-medium text-stone-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        product.stock === 0 ? "text-red-600" : "text-stone-600"
                      }
                    >
                      {product.stock}
                    </span>
                    {!product.active ? (
                      <span className="ml-2 text-xs text-stone-400">已下架</span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-stone-600">{product.unit}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="font-medium text-stone-600 hover:text-stone-900"
                    >
                      编辑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (
    data: Omit<Product, "id">,
    imageFile: File | null,
  ) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Omit<Product, "id">>(
    product ? omitProductId(product) : emptyProduct,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const source = event.target.files?.[0];
    event.target.value = "";
    if (!source) return;

    setIsProcessingImage(true);
    setImageError("");
    try {
      const compressed = await compressProductImage(source);
      setImageFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch (imageProcessingError) {
      setImageError(
        imageProcessingError instanceof Error
          ? imageProcessingError.message
          : "图片处理失败",
      );
    } finally {
      setIsProcessingImage(false);
    }
  }

  function removeImage() {
    setImageFile(null);
    setPreviewUrl(null);
    setImageError("");
    update("imagePath", null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      await onSave(
        {
          ...formData,
          name: formData.name.trim(),
          nameJa: formData.nameJa.trim(),
          description: formData.description.trim(),
          unit: formData.unit.trim(),
          price: Math.max(0, Number(formData.price)),
          stock: Math.max(0, Math.floor(Number(formData.stock))),
        },
        imageFile,
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "商品保存失败");
    } finally {
      setIsSaving(false);
    }
  }

  function update<K extends keyof Omit<Product, "id">>(
    field: K,
    value: Omit<Product, "id">[K],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  const displayImageUrl =
    previewUrl ?? getProductImageUrl(formData.imagePath);

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-8"
    >
      <h2 className="mb-6 text-lg font-semibold text-stone-900">
        {product ? "编辑商品" : "新增商品"}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3 sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">商品图片</span>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-stone-100 sm:w-56">
              {displayImageUrl ? (
                <Image
                  src={displayImageUrl}
                  alt="商品图片预览"
                  fill
                  unoptimized={Boolean(previewUrl)}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-stone-400">
                  暂无图片
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="inline-flex cursor-pointer rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-400">
                {isProcessingImage ? "正在压缩..." : "选择图片"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => void selectImage(event)}
                  disabled={isProcessingImage || isSaving}
                  className="sr-only"
                />
              </label>
              {previewUrl || formData.imagePath ? (
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isSaving}
                  className="ml-2 text-sm text-red-600 hover:text-red-700"
                >
                  删除图片
                </button>
              ) : null}
              <p className="text-xs leading-relaxed text-stone-400">
                JPG、PNG 或 WebP；自动缩放至最长边 1400px，并压缩为不超过 300KB 的 WebP。
              </p>
              {imageFile ? (
                <p className="text-xs text-emerald-600">
                  处理完成：{Math.ceil(imageFile.size / 1024)}KB
                </p>
              ) : null}
              {imageError ? (
                <p className="text-sm text-red-600">{imageError}</p>
              ) : null}
            </div>
          </div>
        </div>
        <AdminInput
          label="中文名称"
          value={formData.name}
          onChange={(value) => update("name", value)}
          required
        />
        <AdminInput
          label="日文名称"
          value={formData.nameJa}
          onChange={(value) => update("nameJa", value)}
          required
        />
        <AdminInput
          label="价格（¥）"
          type="number"
          min="0"
          value={formData.price}
          onChange={(value) => update("price", Number(value))}
          required
        />
        <AdminInput
          label="库存"
          type="number"
          min="0"
          step="1"
          value={formData.stock}
          onChange={(value) => update("stock", Number(value))}
          required
        />
        <AdminInput
          label="规格"
          value={formData.unit}
          onChange={(value) => update("unit", value)}
          placeholder="例如：500g、1袋"
          required
        />
        <label className="space-y-2 text-sm font-medium text-stone-700">
          <span>分类</span>
          <select
            value={formData.categorySlug}
            onChange={(event) =>
              update("categorySlug", event.target.value as CategorySlug)
            }
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none focus:border-stone-400"
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-stone-700 sm:col-span-2">
          <span>商品描述</span>
          <textarea
            value={formData.description}
            onChange={(event) => update("description", event.target.value)}
            className="min-h-28 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none focus:border-stone-400"
            required
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={Boolean(formData.popular)}
            onChange={(event) => update("popular", event.target.checked)}
            className="h-4 w-4 rounded border-stone-300"
          />
          设为人气商品
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(event) => update("active", event.target.checked)}
            className="h-4 w-4 rounded border-stone-300"
          />
          上架销售
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving || isProcessingImage}
          className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSaving || isProcessingImage}
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          {isSaving ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-stone-700">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none focus:border-stone-400"
        {...props}
      />
    </label>
  );
}

function omitProductId(product: Product): Omit<Product, "id"> {
  return {
    name: product.name,
    nameJa: product.nameJa,
    description: product.description,
    price: product.price,
    stock: product.stock,
    categorySlug: product.categorySlug,
    unit: product.unit,
    popular: product.popular,
    active: product.active,
    imagePath: product.imagePath,
  };
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl bg-white px-6 py-16 text-center text-stone-500 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
      {message}
    </div>
  );
}
