# online-grocery

这是一个使用 Next.js 16、React 19、Supabase 和 PostgreSQL 构建的在线食品商店。
顾客可以浏览商品、加入购物车、提交订单并查看付款二维码；管理员可以在受保护的
后台管理订单、商品、库存和商品图片。

[English README](../README.md)

## 当前功能

### 顾客端

- 浏览和搜索商品，并按分类查看
- 查看商品详情和热门商品
- 购物车保存在顾客浏览器中
- 提交订单时不需要选择配送时间
- 服务端重新校验价格、上下架状态和库存
- 创建订单时以事务方式扣减库存
- 订单成功页面显示固定的 PayPay 和微信/支付宝付款二维码

### 管理后台

- 使用 Supabase 邮箱和密码登录，并检查管理员权限
- 登录过程中显示加载状态，失败时显示具体错误
- 查看订单，通过带实时数量的状态标签筛选订单
- 修改订单状态：待确认、已确认、处理中、已完成、已取消
- 通过带实时数量的分类标签筛选商品
- 新增和编辑商品、价格、库存、分类及上下架状态
- 上传 HEIC/HEIF、JPG、PNG 和 WebP 商品图片
- 将商品图片最长边限制为 1400px，并压缩到 300KB 以内
- 优化后的商品图片以 WebP 保存到 Supabase Storage
- 更换商品图片时自动删除旧的 Storage 文件

目前不包含优惠、优惠券、配送费计算、配送时间选择和在线支付处理。付款二维码仅用于
向顾客展示付款方式，系统不会自动确认是否到账。

## 运行要求

- Node.js 22
- npm
- 已启用 PostgreSQL、Authentication 和 Storage 的 Supabase 项目

本项目不支持 Node.js 20 及更早版本。

## 环境变量

在项目根目录创建 `.env.local`：

```dotenv
DATABASE_URL=postgresql://postgres.project-ref:YOUR_PASSWORD@YOUR_POOLER_HOST:6543/postgres
MIGRATION_DATABASE_URL=postgresql://postgres.project-ref:YOUR_PASSWORD@YOUR_SESSION_POOLER_HOST:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

- `DATABASE_URL`：应用运行时数据库连接。本地和 Vercel 推荐使用 Supabase
  Transaction pooler。
- `MIGRATION_DATABASE_URL`：可选。数据库迁移和管理员脚本会优先使用它；未配置时
  自动使用 `DATABASE_URL`。迁移推荐使用 Session pooler 或 Direct connection。
- 如果数据库密码包含 URL 特殊字符，需要把密码进行 URL 编码后写入连接字符串。
- `.env.local` 已被 Git 忽略。不要提交密码、私钥或生产数据库连接。

部署到 Vercel 时，请在 **Project Settings → Environment Variables** 中添加所需
变量。部署 Production 和 Preview 时选择 **Production and Preview**，保存后重新
部署。电脑上的 `.env.local` 不会自动上传到 Vercel。

## 本地初始化

```bash
npm install
npm run db:migrate
npm run dev
```

访问：

- 商店：`http://localhost:3000`
- 后台登录：`http://localhost:3000/admin/login`

`npm run db:migrate` 会按顺序执行 `supabase/migrations` 中尚未运行的 SQL，并将记录
保存到 `public.app_migrations`。拉取到新的迁移文件后需要再次运行此命令。

## 创建管理员

1. 打开 **Supabase Dashboard → Authentication → Users**。
2. 创建一个邮箱和密码用户。
3. 为这个已经存在的用户授予管理员权限：

```bash
npm run db:make-admin -- admin@example.com
```

4. 使用同一邮箱和密码访问 `http://localhost:3000/admin/login`。

脚本不会创建 Supabase Authentication 用户，也不会设置密码。如果提示
`Auth user not found`，需要先在 Supabase 创建用户；忘记密码时请在 Supabase
Authentication 中重置。

## 付款二维码

订单成功页面直接读取以下两个静态文件：

```text
public/payment-codes/paypay.png
public/payment-codes/wechat-alipay.png
```

店家只需要用自己的 PNG 覆盖这两个文件，并保持文件名不变。PNG 内可以直接包含
PayPay、微信支付或支付宝的说明文字。本地开发时通常不需要重启；生产环境需要提交
文件并重新部署。

## 商品图片 Storage

- Bucket：`product-images`
- 数据库和 Storage 配置：`supabase/migrations/003_product_images.sql`
- 原始格式：HEIC/HEIF、JPG、PNG、WebP
- 原图最大尺寸：10MB
- 输出最长边：1400px
- 上传文件最大尺寸：300KB
- Storage 保存格式：WebP

HEIC 解码在浏览器中进行。如果浏览器不支持通过 Canvas 输出 WebP，会先上传优化后的
JPEG，再由服务端转换为 WebP 后保存。

## 数据与安全

- 商品、订单和订单明细保存在 Supabase PostgreSQL。
- 商品图片保存在公开的 `product-images` Storage Bucket。
- Supabase Auth 管理登录会话，`public.admin_profiles` 决定后台权限。
- 后台 API 会同时检查登录状态和管理员权限。
- 下单接口只接受商品 ID 和数量；价格、上下架状态及库存均在服务端校验。
- 数据库迁移会安装 Row Level Security 策略。
- 购物车保存在浏览器 `localStorage`。

## 常用命令

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm run start
npm run db:migrate
npm run db:make-admin -- admin@example.com
```

运行这些命令时请使用 Node.js 22。
