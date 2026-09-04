import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const SRC_DIR = 'c:/Users/12243/.trae-cn/attachments/6a9a36de11782bf37184688c/'
const OUT_DIR = path.join(PROJECT_ROOT, 'src/data')

// ---------------------------------------------------------------
// 工具函数：去除 HTML 标签 / 解码实体
// ---------------------------------------------------------------
function stripTags(html) {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function normUrl(u) {
  if (!u) return ''
  let s = (u || '').trim()
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s
  try {
    const p = new URL(s)
    return (p.hostname + p.pathname).replace(/\/+$/, '').toLowerCase()
  } catch {
    return s.replace(/\/+$/, '').toLowerCase()
  }
}

// ------------------------------------------------------------------
// 通用卡片解析：在一个 category 块里提取所有 `<a ...>...</a>` 站点
// ------------------------------------------------------------------
function extractCards(blockHtml) {
  const cards = []
  const re = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
  let m
  while ((m = re.exec(blockHtml)) !== null) {
    const href = m[1]
    const inner = m[2]
    if (!href || href.startsWith('#') || href.startsWith('javascript')) continue
    const innerText = stripTags(inner)
    if (!innerText) continue

    // 站点名：优先取具有语义 class 的元素
    let name = ''
    const nameMatch =
      inner.match(/<[a-z0-9]+[^>]*class="[^"]*card-name[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/i) ||
      inner.match(/<[a-z0-9]+[^>]*class="[^"]*site-name[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/i) ||
      inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)
    if (nameMatch) name = stripTags(nameMatch[1])
    if (!name) {
      const title = (blockHtml.slice(0, blockHtml.indexOf('>') + 1) && m[0].match(/title="([^"]*)"/)) || null
      name = title ? title[1] : innerText.split(' ')[0]
    }

    // 简介
    let desc = ''
    const descMatch =
      inner.match(/<[a-z0-9]+[^>]*class="[^"]*card-intro[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/i) ||
      inner.match(/<[a-z0-9]+[^>]*class="[^"]*site-intro[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/i) ||
      inner.match(/<[a-z0-9]+[^>]*class="[^"]*intro[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/i)
    if (descMatch) desc = stripTags(descMatch[1])

    // 标签
    const tags = []
    const tagRe = /<[a-z0-9]+[^>]*class="[^"]*(?:tag|ctag)[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/gi
    let tn
    while ((tn = tagRe.exec(inner)) !== null) {
      const t = stripTags(tn[1])
      if (t && !tags.includes(t)) tags.push(t)
    }
    if (!tags.length) {
      const st = inner.match(/<[a-z0-9]+[^>]*class="[^"]*site-tags[^"]*"[^>]*>([\s\S]*?)<\/[a-z0-9]+>/i)
      if (st) {
        stripTags(st[1])
          .split(/[#·,，\s]+/)
          .filter(Boolean)
          .forEach((t) => tags.includes(t) || tags.push(t))
      }
    }

    cards.push({ url: href, name, desc, tags })
  }
  return cards
}

// ------------------------------------------------------------------
// 按文件类型解析出 [{ name, cards }]
// ------------------------------------------------------------------
function parseFile(html) {
  const cats = []
  // 1) 通用定位所有分类标题块（cat-title 或 cat-header）
  // 记录每个标题的开始位置与名称
  const headRe =
    /<(?:h[0-9]|div|section)[^>]*class="[^"]*(?:cat-title|section-title|cat-header)[^"]*"[^>]*>([\s\S]*?)<\/(?:h[0-9]|div|section)>/gi
  const heads = []
  let hh
  while ((hh = headRe.exec(html)) !== null) {
    let inner = hh[1]
    // 先剔除 cat-count 计数元素
    inner = inner.replace(/<[a-z0-9]+\s+class="[^"]*cat-count[^"]*"[^>]*>[\s\S]*?<\/[a-z0-9]+>/gi, '')
    let name = stripTags(inner)
    // 去掉结尾的计数，如 " 35"、"13个"、" (16)"、"（10）"
    name = name.replace(/\s*[（(\[]\s*\d+\s*[)）\]]\s*$/, '')
    name = name.replace(/\s*\d+\s*个?\s*$/, '')
    name = name.replace(/^\d+[\.、)\s]+/, '').trim()
    if (name) heads.push({ name, index: hh.index, end: hh.index + hh[0].length })
  }
  if (!heads.length) {
    // 兜底：按 zhaoshuba 结构，cat-header 名称在 style 后的文本
    const z = /<div class="cat-header"[^>]*>([\s\S]*?)<\/div>/g
    let zm
    while ((zm = z.exec(html)) !== null) {
      const nm = stripTags(zm[1])
      if (nm) heads.push({ name: nm, index: zm.index, end: zm.index + zm[0].length })
    }
  }
  if (!heads.length) return cats

  for (let i = 0; i < heads.length; i++) {
    const start = heads[i].end
    const end = i + 1 < heads.length ? heads[i + 1].index : html.length
    const block = html.slice(start, end)
    const section = block.slice(0, block.indexOf('</div>') === -1 ? block.length : undefined)
    // 找 section 闭合：从第一个分类标题后，切到列表区域
    const listStart = block.indexOf('>')
    const listEnd = block.lastIndexOf('</div>')
    const listBlock = block.slice(listStart + 1, listEnd === -1 ? undefined : listEnd + 6)
    const cards = extractCards(listBlock)
    cats.push({ name: heads[i].name, cards })
  }
  return cats
}

// ------------------------------------------------------------------
// 入口
// ------------------------------------------------------------------
const SOURCES = [
  ['97db59ee-4880-4575-b40f-abfde7f00627_40a74690-6c40-44df-909d-4657172592d3_aaaabbb_nav.html', 'aaaabbb 综合导航'],
  ['43382daf-6f0d-463f-afa5-b9c2594d0d15_76020405-9fb1-4a5c-9157-7b90c793add9_ebook_nav.html', '电子书站点精选'],
  ['28743e09-2451-489e-b012-5ba87c9f95f2_cc6b2cb4-2bf9-48c5-89be-3ab2e946635d_jiafangbb_nav.html', '甲方导航'],
  ['412dc2b3-1175-4856-857f-505dbbcbe89a_5ce495d6-e694-4352-8244-937d84f0edb4_xmsoushu_nav.html', '熊猫搜书导航'],
  ['9d61c77a-033a-4914-8811-9d9d1e293a5f_1494886b-efb3-45e7-8046-93c156534f4e_zhaoshuba_nav.html', '找书吧'],
  ['05d39907-94fa-469e-9fcc-87f8ae95c51c_c9e0c4e3-5df7-4041-9980-84ee7aaf3dde_toollu_nav.html', 'tool.lu 网址导航'],
]

const groups = []
const seenUrls = new Set()
let totalSites = 0
let deduped = 0

for (const [file, label] of SOURCES) {
  const full = path.join(SRC_DIR, file)
  if (!fs.existsSync(full)) {
    console.warn('skip missing:', file)
    continue
  }
  const html = fs.readFileSync(full, 'utf8')
  const cats = parseFile(html)
  const children = []
  for (const cat of cats) {
    const bookmarks = []
    for (const c of cat.cards) {
      const key = normUrl(c.url)
      if (seenUrls.has(key)) {
        deduped++
        continue
      }
      seenUrls.add(key)
      totalSites++
      bookmarks.push({
        name: c.name,
        url: c.url,
        desc: c.desc,
        tags: c.tags && c.tags.length ? c.tags : undefined,
      })
    }
    if (bookmarks.length) {
      children.push({ name: cat.name, isFolder: true, children: bookmarks })
    }
  }
  if (children.length) {
    groups.push({ name: label, isFolder: true, children })
  }
}

const output = groups
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(path.join(OUT_DIR, 'bookmarks.json'), JSON.stringify(output, null, 2), 'utf8')
console.log(`已生成 bookmarks.json`)
console.log(`来源组: ${groups.length}，分类: ${output.reduce((a, g) => a + g.children.length, 0)}，站点: ${totalSites}，去重移除: ${deduped}`)