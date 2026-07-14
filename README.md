# online-grocery

一个基于 Next.js 16 和 Tailwind CSS 的华人食材宅配商城模板。包含商品分类、商品详情、购物车、结账流程、订单成功页等电商基础功能，适合用于演示或继续扩展为实际的在线零售网站。

## 主要特性

- `app` 路由与服务端渲染 / 静态渲染混合
- 动态分类页与商品详情页
- 购物车状态管理与本地存储持久化
- 简单结账表单 + 订单成功页展示
- 响应式 UI 组件与 Tailwind CSS 样式
- 多语言字体支持（Noto Sans JP / SC）

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

## 运行与开发

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 查看本地开发站点。

### 其他常用命令

```bash
npm run build
npm start
npm run lint
```

## 目录说明

```text
app/
  layout.tsx          # 全局布局与页面元数据
  page.tsx            # 首页
  cart/page.tsx       # 购物车页面
  checkout/page.tsx   # 结账页面
  order-success/page.tsx # 订单成功页
  product/[id]/page.tsx  # 商品详情页
  category/[slug]/page.tsx # 分类页
components/
  layout/             # 站点头部、页脚、布局组件
  home/               # 首页展示组件
  product/            # 商品卡片与详情相关组件
  ui/                 # 通用 UI 组件
context/
  CartContext.tsx     # 购物车状态与本地存储逻辑
lib/
  data/               # 商品与分类数据源
  types/              # 类型定义
  utils/              # 工具函数
public/               # 静态资源
```

## 自定义与扩展建议

- 将 `public/hero-banner.png` 替换为自定义横幅图片
- 在 `lib/data/products.ts` 和 `lib/data/categories.ts` 中添加更多商品与分类
- 扩展 `components/ui` 以支持更多通用组件
- 引入后端 API 或 Shopify、Stripe 等支付服务

## 注意事项

- 购物车数据保存在浏览器 `localStorage` 中
- 订单详情在 `sessionStorage` 中临时保存并在成功页读取
- 项目当前未集成真实支付，仅用于演示与前端流程

## 部署

由于是标准 Next.js 应用，可直接部署到 Vercel、Netlify、Cloudflare Pages 等平台。

```bash
npm run build
npm start
```

如果部署到 Vercel，确保使用 `npm run build` 进行构建。