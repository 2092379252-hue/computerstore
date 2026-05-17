# 电脑商城 5 人并行改版执行方案

## 1. 目标

本轮改版的目标不是小修小补，而是在保留现有图片资源和主要业务骨架的前提下，让项目在页面风格、信息组织、交互体验上看起来像一个新的项目。

本方案采用：

- 1 人总控
- 4 人模块负责人

这样做的原因是：

- 公共头部、导航、页脚、全局样式只能由 1 人统一控制
- 其余 4 人可以按模块并行开发，尽量减少 Git 冲突
- 最终由总控统一拼接和收口，避免风格碎片化

## 2. 人员分工

### 人员 1：总控 / 视觉壳层 / 最终拼接

负责内容：

- 公共组件
  - `src/main/resources/static/web/components/head.html`
  - `src/main/resources/static/web/components/footer.html`
  - `src/main/resources/static/web/components/middleNavigationBar.html`
- 全局样式
  - `src/main/resources/static/css/layout.css`
  - `src/main/resources/static/css/top.css`
  - `src/main/resources/static/css/footer.css`
- 页面
  - `src/main/resources/static/web/index.html`
  - `src/main/resources/static/web/404.html`
  - `src/main/resources/static/web/500.html`

职责：

- 先产出整站视觉基线
- 定义配色、字体层级、按钮风格、卡片风格、表单风格、导航结构
- 完成首页改版
- 最后负责合并所有分支并修冲突

限制：

- 只有总控可以改公共组件和全局 CSS
- 其他 4 人禁止改以上文件

### 人员 2：商品浏览与搜索模块

负责内容：

- 页面
  - `src/main/resources/static/web/product.html`
  - `src/main/resources/static/web/search.html`
- 样式
  - `src/main/resources/static/css/product.css`
  - `src/main/resources/static/css/search.css`
  - `src/main/resources/static/css/imgmove.css`
- 脚本
  - `src/main/resources/static/js/product.js`
  - `src/main/resources/static/js/imgmove.js`
  - 商品页和搜索页中的内联脚本
- 后端
  - `ProductController`
  - `IProductService` 及其实现
  - `ProductMapper`
  - `ProductMapper.xml`

职责：

- 重做商品详情页视觉
- 重做搜索结果页布局和展示逻辑
- 优化商品卡片、商品信息层级、筛选/排序/结果表现

限制：

- 不改首页
- 不改购物车、收藏、订单、用户模块接口

### 人员 3：用户账户与个人中心模块

负责内容：

- 页面
  - `src/main/resources/static/web/login.html`
  - `src/main/resources/static/web/register.html`
  - `src/main/resources/static/web/password.html`
  - `src/main/resources/static/web/userdata.html`
  - `src/main/resources/static/web/upload.html`
  - `src/main/resources/static/web/address.html`
  - `src/main/resources/static/web/addAddress.html`
  - `src/main/resources/static/web/editAddress.html`
- 样式
  - `src/main/resources/static/css/login.css`
  - `src/main/resources/static/css/reg.css`
  - 允许新增账户中心专属 CSS 文件
- 脚本
  - 上述页面中的内联脚本
  - `someFunction.js` 中仅账户模块相关逻辑
  - 如果共享脚本冲突风险高，则新建账户中心专属 JS 文件，由此人独占
- 后端
  - `UserController`
  - `AddressController`
  - `FileController`
  - 对应 Service / Mapper

职责：

- 把登录、注册、资料管理、头像上传、地址管理做成统一风格的个人中心

限制：

- 不改商品、购物车、订单模块页面和接口

### 人员 4：购物车与收藏模块

负责内容：

- 页面
  - `src/main/resources/static/web/cart.html`
  - `src/main/resources/static/web/favorites.html`
- 样式
  - `src/main/resources/static/css/cart.css`
  - `src/main/resources/static/css/favorites.css`
- 脚本
  - 购物车页和收藏页中的内联脚本
- 后端
  - `CartController`
  - `FavoritesController`
  - 对应 Service / Mapper

职责：

- 重做购物车列表和收藏列表
- 优化数量调节、批量操作、删除、加入购物车、状态反馈

限制：

- 不改订单确认页、支付页、商品页和用户中心

### 人员 5：订单、支付与售后模块

负责内容：

- 页面
  - `src/main/resources/static/web/orderConfirm.html`
  - `src/main/resources/static/web/orders.html`
  - `src/main/resources/static/web/orderInfo.html`
  - `src/main/resources/static/web/payment.html`
  - `src/main/resources/static/web/paySuccess.html`
  - `src/main/resources/static/web/payFail.html`
  - `src/main/resources/static/web/aftersales.html`
- 样式
  - `src/main/resources/static/css/order.css`
  - `src/main/resources/static/css/orderConfirm.css`
  - `src/main/resources/static/css/orderInfo.css`
- 脚本
  - 上述页面中的内联脚本
  - `src/main/resources/static/js/TimeTran.js`
  - `src/main/resources/static/js/herf.js` 中订单链路相关逻辑
  - 如有必要可抽出订单模块专属 JS 文件
- 后端
  - `OrderController`
  - `AliPayController`
  - 对应 Service / Mapper

职责：

- 把下单、订单列表、订单详情、支付反馈、售后说明做成统一流程体验

限制：

- 不改购物车、商品详情、账户中心模块

## 3. Git 分支与合并策略

### 分支命名

- 商品：`feature/product-discovery`
- 用户：`feature/account-center`
- 购物车收藏：`feature/cart-favorites`
- 订单支付：`feature/order-payment`
- 总控直接在：`main`

### 建分支步骤

所有人先回到同一个稳定基线，例如 `main`：

```powershell
git switch main
git pull
```

然后分别创建自己的分支：

```powershell
git switch -c feature/product-discovery
git switch -c feature/account-center
git switch -c feature/cart-favorites
git switch -c feature/order-payment
```

### 合并顺序

总控直接在 `main` 上按下面顺序收口：

1. 先在 `main` 完成公共壳层、首页和全局样式
2. 合入 `feature/product-discovery`
3. 合入 `feature/account-center`
4. 合入 `feature/cart-favorites`
5. 合入 `feature/order-payment`

然后继续在 `main` 上统一修冲突、调样式、做回归测试。

## 4. 文件归属与冲突规避规则

### 共享文件归属

- `components/*` 只允许人员 1 改
- `layout.css`、`top.css`、`footer.css` 只允许人员 1 改
- `product.js`、`imgmove.js` 归人员 2
- `someFunction.js` 默认归人员 3
- `herf.js`、`TimeTran.js` 默认归人员 5

### 通用规则

- 每人优先只改自己模块专属 CSS
- 不跨模块改 Controller / Service / Mapper
- 不修改别人已经依赖的接口路径
- `JsonResult` 返回结构不变
- 如果需要新增接口，只能服务于本模块页面，并在提交说明里写清楚用途

### 强制限制

以下文件和区域禁止多人同时改：

- 公共组件
- 全局 CSS
- 全局配置文件
- 公共基础实体和基类

## 5. 推荐实施节奏

### 第 1 天

- 人员 1 先做公共壳层和首页风格
- 产出整站视觉规范
- 其余 4 人只看代码、理解模块、先画草图或列改造点

### 第 2-4 天

- 4 个模块负责人正式开发
- 每人只在自己分支提交
- 每天同步一次进度和可能的接口变动

### 第 5 天

- 总控开始把各模块分支依次合到 `main`
- 修冲突和公共样式问题
- 全站联调

## 6. 每个人的最小自测要求

### 人员 1

- 首页能加载
- 公共导航跳转正常
- 404 / 500 页面风格正常
- 全局样式没有明显覆盖错误

### 人员 2

- 首页可以跳商品详情
- 商品详情页正常展示
- 搜索结果页正常展示
- 加入购物车 / 加入收藏入口可达

### 人员 3

- 注册、登录正常
- 修改资料、修改密码正常
- 头像上传正常
- 地址增删改查正常

### 人员 4

- 购物车展示正常
- 数量修改正常
- 删除商品正常
- 收藏展示正常
- 收藏加入购物车正常

### 人员 5

- 订单确认页正常
- 订单列表正常
- 订单详情正常
- 支付页可进入
- 支付成功 / 失败页展示正常

## 7. 最终集成回归链路

总控在 `main` 上至少走以下链路：

- 首页 -> 搜索 -> 商品详情 -> 加入购物车 -> 购物车 -> 下单 -> 支付页 -> 订单列表
- 登录 / 注册 -> 个人中心 -> 地址管理 -> 订单确认
- 收藏 -> 加购 -> 下单

## 8. 合并验收标准

- 页面风格统一
- 外观明显不像原项目原始版本
- 主要业务链路不报错
- 所有页面都能从导航或业务流程进入
- `main` 能成功构建并启动

## 9. 提交规范

每个人提交时建议写清楚模块：

```text
feat(product): redesign product detail and search result layout
feat(account): rebuild login register and profile center
feat(cart): redesign cart and favorites interaction
feat(order): redesign order flow and payment feedback pages
feat(shell): replace global theme, navigation and homepage
```

## 10. 备注

- 图片资源目录保持不动
- 本次允许模块内前后端一起改
- 不做数据库结构级重构
- 如果时间不够，优先把首页、商品详情、购物车、订单链路、个人中心做出“新项目感”
