---
name: "bookmark-nav"
description: "书签导航网站维护技能，用于合并导航数据、修改分类栏样式、构建部署等。Invoke when maintaining the bookmark navigation site, adding new data sources, or adjusting UI."
---

# Bookmark Nav 书签导航网站

React + Vite + TypeScript 打造的个人导航聚合网站。支持 Logo 自动获取、站内/站外搜索、多级分类导航、响应式适配。

## 项目结构

```
src/
  App.tsx                # 核心应用组件：分类栏渲染、搜索、主题切换、站点卡片
  index.css              # 全局样式：CSS变量主题系统、响应式设计
  types/index.ts         # TypeScript 类型定义
  components/
    Logo.tsx             # Logo 组件：21种图标源+文字头像回退
    BackToTop.tsx        # 一键置顶按钮
    ThemeToggle.tsx      # 主题切换按钮
  lib/
    favicon.ts           # Logo 获取逻辑（21个源回退机制）
    constants.ts         # 搜索引擎、主题色、初始数据常量
  data/
    bookmarks.json       # 导航数据（12分组 x 5501站点）
scripts/
  merge-nav.mjs          # 数据合并脚本：支持JSON和HTML书签格式
.vscode/
  settings.json         # VSCode 配置
.github/
  workflows/
    deploy.yml          # GitHub Actions 自动部署到 gh-pages
vite.config.ts          # Vite 构建配置（base: './'）
vercel.json             # Vercel 部署配置
netlify.toml            # Netlify 部署配置
```

## 核心功能

| 功能 | 说明 |
|------|------|
| Logo 自动获取 | 21个图标源（favicon.im、百度、Google等），失败自动回退，最终兜底文字头像 |
| 站内搜索 | 关键词过滤站名/网址/简介/标签 |
| 站外搜索 | 24个搜索引擎，默认必应 |
| 明暗主题 | 一键切换，localStorage 持久化 |
| 多级分类 | 分层 pill 栏固定顶部，点击父级自动展开子分类，多列弹性排布 |
| 一键置顶 | 右下角悬浮按钮 |
| 响应式 | 适配手机/平板/电脑 |

## 常用操作

### 1. 新增导航数据源

修改 `scripts/merge-nav.mjs`：

- JSON 格式：添加到 `JSON_SOURCES` 数组
- HTML 书签（Netscape格式）：添加到 `BOOKMARK_HTML_SOURCES` 数组

运行：
```bash
node scripts/merge-nav.mjs
npm run build
```

### 2. 不去重合并（保留全部原始站点）

在调用 `makeGroup()` 时传入 `false` 作为第三个参数：
```javascript
const g = makeGroup(name, children, false)  // 不去重
// const g = makeGroup(name, children)      // 默认去重
```

### 3. 修改分类栏样式

- 组件逻辑：`src/App.tsx`（分层 pill 栏渲染逻辑）
- 样式：`src/index.css`（`.bar-1`/`.bar-2`/`.bar-3`/`.bar-4`，`.cat-pill`/`.sub-pill`）

### 4. 统计分组/站点

```bash
node -e "
const d=JSON.parse(require('fs').readFileSync('src/data/bookmarks.json','utf8'));
d.forEach(g=>{
  let c=0;
  function w(x){
    if(x.children) x.children.forEach(w);
    else if(x.url) c++;
  }
  if(g.children) g.children.forEach(w);
  console.log(g.name+':', c);
})
"
```

### 5. 本地预览

```bash
npm run preview
```

### 6. 构建检查

```bash
npm run build
```

### 7. 提交部署

```bash
git add -A
git commit -m "your commit message"
git push origin main
```

GitHub Actions 会自动构建并部署到 `gh-pages` 分支。

## 部署平台支持

- **GitHub Pages**: 自动通过 GitHub Actions 部署
- **Cloudflare Pages**: 连接 GitHub 仓库，构建设置 `npm run build`，输出目录 `dist`
- **Vercel**: 已配置 `vercel.json`，直接导入仓库即可
- **Netlify**: 已配置 `netlify.toml`，直接导入仓库即可

所有平台均使用 `base: './'` 相对路径配置。

## 开发注意事项

- 数据文件 `bookmarks.json` 较大，构建时会有 chunk size 提示，不影响功能
- 使用 CSS Variables 实现主题切换，明暗主题通过 `data-theme` 属性切换
- 分类栏使用 `position: sticky` 固定在顶部，内容区正常滚动
- 多级分类使用递归组件渲染，支持任意深度
- 自适应：flex-wrap 自动换行，不同屏幕尺寸自动适配

## 常见坑与解决方案

1. **PowerShell 不支持 `&&` 操作符** → 改用分号 `;` 分隔命令
2. **相对路径不生效** → 确保 `vite.config.ts` 中 `base: './'`
3. **JSON 解析错误** → 检查书签文件编码，确保 UTF-8
4. **页面无法滚动** → 不要给 body 设置 `height: 100vh; overflow: hidden`，改用 `position: sticky`
