# online-grocery

基于 Next.js 16、Supabase 与 PostgreSQL 的在线食品商店。顾客可以浏览商品、加入购物车并下单；管理员登录后台后可以查看订单、修改订单状态，以及新增和编辑商品、价格与库存。

## 当前功能

- 商品目录、分类、详情与本地购物车
- 服务端创建订单、重新核价并原子扣减库存
- Supabase PostgreSQL 持久化商品、订单和订单明细
- Supabase Auth 管理员登录
- 后台查看订单并修改状态
- 后台新增、编辑、上下架商品以及修改价格和库存
- 后台上传商品图片，自动转换为最长边 1400px、最大 300KB 的 WebP
- 更换或移除商品图片时自动清理 Supabase Storage 中的旧文件
- 数据库 Row Level Security 策略

优惠、优惠券和配送费计算暂未启用；订单总额目前只包含商品金额。

## 环境变量

在 `.env.local` 中配置：

```dotenv
DATABASE_URL=postgresql://...
MIGRATION_DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

- `DATABASE_URL`：应用运行时连接，推荐使用 Transaction pooler，并关闭 prepared statements。
- `MIGRATION_DATABASE_URL`：迁移脚本连接，推荐 Session pooler 或 Direct connection。
- `.env.local` 已被 Git 忽略，不要提交数据库密码。

## 初始化

```bash
npm install
npm run db:migrate
npm run dev
```

打开 `http://localhost:3000`。

## 创建后台管理员

先在 Supabase Dashboard 的 `Authentication > Users` 创建邮箱密码用户，然后执行：

```bash
npm run db:make-admin -- admin@example.com
```

随后访问 `http://localhost:3000/admin/login` 登录。

## 常用命令

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## 数据说明

- 商品和订单保存在 Supabase PostgreSQL。
- 商品图片保存在公开的 Supabase Storage `product-images` Bucket，上传和删除仅限管理员。
- 购物车保存在顾客浏览器的 `localStorage`。
- 下单接口只接受商品 ID 和数量；价格、上下架状态与库存都在服务端校验。
- 当前未接入在线支付。
