# 🧭 导航聚合站 (Bookmark Nav)

一个用 **React + Vite + TypeScript** 打造的个人导航网页。把散落各处的书签/导航数据整理成一个站点，支持 **站点 Logo 自动获取（多源回退）**、**站内搜索 + 站外搜索**、**白天/黑夜模式**、**一键置顶**，并且**在不同尺寸的设备（手机/平板/电脑）上都能良好显示**。

> “小白友好”：本文会从项目结构讲到部署上线，照着做就能跑起来、能一键发布到 GitHub Pages / Cloudflare / Vercel / Netlify。

***

## ✨ 功能特性

| 功能            | 说明                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| 🖼️ 自动获取 Logo | 输入网址即可自动拉取站点图标；内置 **21 个图标源**（favicon.im、MyHKW、百度、Google、DuckDuckGo、IconHorse 等），失败时**多源自动回退**，最终兜底为“首字彩色头像”，永远不会出现裂图 |
| 🔍 站内搜索       | 输入关键词，实时过滤“站名 / 网址 / 简介 / 标签”，在当前站点里找到对应导航                                                                            |
| 🌐 站外搜索       | 默认**必应**，可切换百度 / 谷歌 / 搜狗 / DuckDuckGo / 秘塔 AI 等 **20+ 搜索引擎**，回车即跳转外部搜索                                                |
| 🌗 白天黑夜切换     | 一键切换亮/暗主题，配色自动适配，选择会记住（localStorage）                                                                                  |
| ⬆️ 一键置顶       | 页面右下角悬浮按钮，滚动超过一定高度出现，点击平滑回到顶部                                                                                         |
| 📱 移动端适配      | 针对手机 / 平板 / 笔记本做了响应式布局与触控优化，适配刘海屏安全区                                                                                  |
| 📚 分组导航       | 多套数据源按“分组 → 分类 → 站点”层级组织，可在顶部分组标签间切换，支持**任意多级分类自动展开**：点选某个一级分组后，其下二级、三级……子分类全部自动展开并缩进固定在父分类下方                         |

***

## 🧱 技术栈

- **前端框架**：React 18（函数组件 + Hooks）

- **构建工具**：Vite 6（秒开热更新、开箱即用的 TS 支持）

- **语言**：TypeScript（类型安全，减少运行时 Bug）

- **样式**：原生 CSS + CSS 变量（明暗主题切换的关键实现）

- **测试/构建**：`npm run build` / `npx tsc -b`

***

## 📁 目录结构与每个文件的作用

```
bookmark-nav/
├── .github/workflows/deploy.yml   # GitHub Actions：自动构建并推到 gh-pages 分支部署
├── public/
│   └── favicon.svg                # 浏览器标签页小图标（SVG，任意尺寸不糊）
├── scripts/
│   └── generate-data.mjs          # 数据生成脚本：把 8 个 HTML 导航抓成一份 bookmarks.json（按 URL 去重）
├── src/
│   ├── main.tsx                   # 程序入口：把 <App/> 挂载到 #root，并引入全局样式
│   ├── App.tsx                    # 主界面：页头、搜索栏、分组切换、分类网格、页脚、置顶按钮的“总调度”
│   ├── types.ts                   # 全局类型定义：BookmarkItem(书签) / SearchEngine(引擎) / ThemeConfig(主题) / IconSource(图标源)
│   ├── index.css                  # 全站样式：明暗两套 CSS 变量 + 响应式（手机/平板/PC）
│   ├── data/
│   │   └── bookmarks.json         # ✅ 站点数据本体（由 generate-data.mjs 生成，已提交进仓库，部署时直接使用）
│   ├── lib/
│   │   ├── favicon.ts             # ⭐ Logo 自动获取：21 个图标源、域名解析、文字头像、多源回退探测
│   │   └── constants.ts           # 常量：20+ 搜索引擎配置、明暗主题色板、初始书签(读取 bookmarks.json)
│   └── components/
│       ├── Logo.tsx               # ⭐ 自动获取 Logo 组件：按站点渲染图标，加载失败自动换源/兜底文字头像
│       ├── BackToTop.tsx          # 右下角“一键置顶”按钮
│       └── ThemeToggle.tsx        # 白天/黑夜切换按钮
├── index.html                     # HTML 外壳：挂载点 #root、浏览器标题、移动端 viewport 适配
├── vite.config.ts                 # Vite 配置：base:'./' 用相对路径，保证子路径(如 GitHub Pages)也能部署
├── tsconfig.json / tsconfig.node.json  # TypeScript 编译配置
├── package.json                   # 项目依赖与脚本命令（dev / build / preview / data）
├── vercel.json                    # Vercel 部署配置
├── netlify.toml                   # Netlify 部署配置
└── .gitignore                     # 忽略 node_modules、dist 等不该提交的文件
```

> 注：`favicon.ts` 是“逻辑文件”（只算地址、判断是否可用），`Logo.tsx` 才是渲染用的“组件”。两者配合实现自动获取 Logo。

***

## 🚀 快速开始（本地预览）

环境要求：安装 [Node.js](https://nodejs.org/)（建议 ≥ 18，本文写法在 20 上测试）。

```bash
# 1. 进入项目目录
cd bookmark-nav

# 2. 安装依赖（第一次）——会自动生成 node_modules 和 package-lock.json
npm install

# 3. 启动开发服务器（默认 http://localhost:5173，改动自动刷新）
npm run dev

# 4. 打包上线版本（输出到 dist/ 文件夹）
npm run build

# 5. 本地预览打包结果（模拟线上环境）
npm run preview
```

> 💡 打不开依赖？国内网络慢可换镜像：`npm config set registry https://registry.npmmirror.com` 后再 `npm install`。

***

## 🔄 如何更新你的书签数据

站点数据都在 `src/data/bookmarks.json`。有两种更新方式：

**方式 A：直接改 JSON（推荐小白）**
打开 `bookmarks.json`，仿照现有结构加一条：

```json
{
  "name": "我的新站",
  "isFolder": true,
  "children": [
    { "name": "示例", "url": "https://example.com", "desc": "一句话介绍", "tags": ["标签1"] }
  ]
}
```

保存后刷新页面即可。

**方式 B：从 HTML 导航重新生成**
把任意“.html 导航文件”放进 `scripts/generate-data.mjs` 里的 `SOURCES` 列表，然后：

```bash
npm run data   # 重新解析并生成 bookmarks.json
```

脚本会对所有站点**按 URL 去重**，避免重复。

***

## 🔍 站内搜索 & 🌐 站外搜索（默认必应）

顶部搜索栏左侧是一个**引擎选择下拉框**：

- **站内**（`本站` 🔍）：选择后输入即实时过滤当前站点的书签，无需回车。

- **站外**（默认 `必应`，可选百度/谷歌/搜狗/DuckDuckGo/秘塔等）：输入关键词后按 **回车** 或点右侧按钮，就会用该引擎在**新标签页**搜索。

引擎配置集中在 `src/lib/constants.ts` 的 `SEARCH_ENGINES` 数组里，每个引擎只有 4 个字段：

```ts
{
  value: 'bing',                          // 唯一标识
  name: '必应',                            // 显示名
  group: 'general',                       // 分组：local(站内) / general(综合) / ai(AI)
  url: 'https://www.bing.com/search?q=',  // 搜索前缀，回车时把关键词拼在后面
  icon: '<svg .../>',                     // 图标
}
```

想加引擎？复制一条改一下 `value/name/url` 即可。

***

## 🖼️ Logo 自动获取机制（重点）

一个完整流程：

1. **Logo.tsx 组件**拿到站点 `url`，调 `favicon.ts` 的 `getFaviconUrl()` 生成“某个图标源”的图片地址。
2. 默认优选 **favicon.im**（国内较稳、质量好）。
3. 图片加载**失败**（`onError`）时，自动尝试下一个源：`favicon.im → 百度 → Google → DuckDuckGo → 图标候选兜底`。
4. 所有源都失败，则渲染**首字彩色头像**（`Logo.tsx` 里的 letter 分支），保证显示不死链。

`favicon.ts` 已内置 **21 个图标源**，都有统一入口 `getFaviconUrl(url, source)`：
`favicon.im` / MyHKW / iowen / 百度 / AFMax / La4 / Vvhan / xinac / favicon.vip / Cravatar / direct(站点直连 /favicon.ico) / DuckDuckGo / FaviconExtractor / FaviconPub / Google S2 / Clearbit / DDG Icons / IconHorse / Iconify / logo\_surf(文字) / custom(自定义)。

> ⚠️ 国内网络下，`google` 和 `clearbit` 可能被墙导致图标加载慢或失败——我们的**回退机制**会自动跳到下一源，不会出现裂图。这就是本项目比其他导航更稳的原因。

***

## 🌗 白天黑夜切换

- 点击页头右侧的太阳/月亮按钮即可切换。

- 原理：`App.tsx` 在切换时给 `<html>` 加上 `data-theme="dark"` 属性，`index.css` 通过两套 CSS 变量（`:root` 亮色 / `[data-theme='dark']` 暗色）整体变色，过渡平滑。

- 选择会用 `localStorage` 记住，下次打开自动保持；首次访问跟随系统 `prefers-color-scheme`。

***

## ⬆️ 一键置顶

- 右下角圆形按钮，`BackToTop.tsx` 监听滚动：`scrollY > 300px` 才显示。

- 点击调用 `window.scrollTo({ top: 0, behavior: 'smooth' })` 平滑回顶。

- 已处理刘海屏安全区（`env(safe-area-inset-bottom)`）。

***

## 📱 移动端适配（不同设备）

`index.css` 底部按分辨率分档：

- **>1024px 电脑**：多列网格

- **761–1024px 平板**：适配较窄卡片

- **561–760px 手机横屏/小平板**：两列

- **≤760px 手机竖屏**：两列 + 顶栏紧凑 + 分组标签横向滑动

- **≤400px 极窄屏**：单列

同时做了移动端优化：触控禁用 hover、去除点击高亮、分组标签可横滑、输入框字号设 15px 防止 iOS 聚焦自动放大、支持刘海屏 `env(safe-area-inset)`、`viewport-fit=cover`。

***

## 🌐 部署上线（四种平台任选）

### 1️⃣ GitHub Pages（含自动部署工作流）

我们已内置 Actions 工作流 `.github/workflows/deploy.yml`，流程是：**推送代码 → 自动** **`npm run build`** **→ 打包到** **`gh-pages`** **分支 → GitHub Pages 部署**。

操作步骤：

1. 把项目推到你的 GitHub 仓库（默认分支 `main` 或 `master`）。
2. 仓库 **Settings → Pages**：

   - Build and deployment → **Source** 选 **Deploy from a branch**

   - **Branch** 选 `gh-pages`，**folder** 选 `/(root)` → Save
3. 之后每次 `git push` 到 `main`，Actions 会自动重新构建并部署。
4. 也可以手动触发：Actions 页面 → **Run workflow**。
5. 访问地址：`https://<你的用户名>.github.io/<仓库名>/`

> ⚠️ 第一次需要等 Action 运行完成，gh-pages 分支生成后 Pages 才能访问；可能要多刷一两次缓存。

### 2️⃣ Cloudflare Pages

Cloudflare Dashboard（或 Wrangler CLI）两种方式：

- **Dashboard（推荐小白）**：

  1. Cloudflare 控制台 → Workers & Pages → Create → Pages → Connect to Git
  2. 选你的仓库，构建配置填：

     - Build command：`npm run build`

     - Build output directory：`dist`
  3. Save and Deploy。

- **CLI（可选）**：

  ```bash
  npm i -g wrangler
  wrangler login
  wrangler pages deploy dist   # 上传本地打包好的 dist
  ```

### 3️⃣ Vercel

- 打开 [vercel.com](https://vercel.com) → **Add New → Project** → 导入 GitHub 仓库。

- Vercel 会自动识别 `vercel.json`（构建命令 `npm run build`、输出目录 `dist`），直接 **Deploy** 即可。

- 之后推代码自动触发更新，还会自动分配 `https://<项目名>.vercel.app` 域名。

### 4️⃣ Netlify

- 打开 [netlify.com](https://netlify.com) → **Add new site → Import an existing project** → 选仓库。

- Netlify 会读取 `netlify.toml`（build command `npm run build`、publish `dist`），点击 Deploy。

- 完成后可绑自定义域名，或直接使用 `https://<项目名>.netlify.app`。

> 💡 之所以能“一套代码部署四个平台”，是因为：
>
> 1. `vite.config.ts` 用了 `base: './'`（相对路径），在子路径下资源也不会 404；
> 2. 数据是打包进 `bookmarks.json` 的静态站点，不需要后端/数据库。

***

## 🐛 常见坑（新手必看）

| 问题                                             | 原因 & 解决                                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `npm install` 很久 / 失败                          | 网络问题。换成国内镜像：`npm config set registry https://registry.npmmirror.com` 后重试。         |
| GitHub Pages 打开是 404 / 样式丢失                    | ① 确认 Pages 源分支选的是 `gh-pages`；② 确认已跑通一次 Action；③ 确认 `base: './'`。多刷新几次清除 CDN 缓存。   |
| 图标(Logo)有些是灰色文字头像                              | 该站点图标源均失败或源被墙。这是**正常兜底**，可换可用源或等网络恢复；不会裂图。                                        |
| 搜索框在手机上一聚焦就放大                                  | 已通过 `.search-input{font-size:15px}` 规避。若自行改动可再检查该样式。                              |
| 改完代码不生效                                        | 确认 `npm run dev` 仍在运行；改 `bookmarks.json` 无需重启，保存即刷新。                              |
| 部署后首页空白                                        | 多为资源路径问题。检查 `base` 是否为 `'./'`，以及构建产物 `dist/index.html` 里引用的是相对路径（`./assets/...`）。 |
| Actions 部署一直红                                  | 点开失败那步看报错；常见是 `gh-pages` 分支已存在且历史不一致，把工作流里 `force_orphan: true` 打开即可（我已默认开启）。     |
| Windows PowerShell 里 `&&` 报错                   | PowerShell 旧版不支持 `&&`。本项目文档统一用分步命令；如在终端手动串联命令，把 `&&` 换成 `;`。                      |
| 找不到 `node_modules` / `vite: command not found` | 没有先执行 `npm install`。先安装依赖再 `dev`/`build`。                                         |

***

## 📄 说明

- 数据来自多份公开导航 HTML，由 `scripts/generate-data.mjs` 合并去重生成，**仅供个人学习/导航使用**。

- 图标均来自第三方图标聚合服务，版权归原作者所有；若涉及侵权请联系移除。

- 该演示项目对你修改代码、增删站点、换主题色、加搜索引擎都是完全开放的。

Enjoy 🎉 如果觉得有用，给个 ⭐ 支持一下吧！
