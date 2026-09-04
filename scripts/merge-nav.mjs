import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(PROJECT_ROOT, 'src/data')
const DATA_FILE = path.join(OUT_DIR, 'bookmarks.json')

const SRC_DIR = 'c:/Users/12243/.trae-cn/attachments/6a9a36de11782bf37184688c/'

// ---------- 通用工具 ----------
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

const attr = (s, key) => {
  const m = new RegExp(`${key}\\s*=\\s*["']([^"']*)["']`, 'i').exec(s || '')
  return m ? m[1] : ''
}

// ---------- Netscape 书签 HTML 解析 ----------
// 把 `<DT><H3>..</H3><DL>..</DL>`(文件夹) 与 `<DT><A>..</A>`(链接) 递归解析成：
// 文件夹 -> { name, children:[...] }，链接 -> { name, url, desc }
function parseBookmarkHtml(html) {
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  function walkDl(str, i) {
    const open = /^<DL(?:\s[^>]*)?>/i.exec(str.slice(i, i + 60))
    let j = open ? i + open[0].length : i
    const items = []
    while (j < str.length) {
      const nextDt = str.indexOf('<DT>', j)
      const nextClose = str.indexOf('</DL>', j)
      if (nextClose !== -1 && (nextDt === -1 || nextDt > nextClose)) {
        return { items, end: nextClose + 5 }
      }
      if (nextDt === -1) return { items, end: str.length }
      const rest = str.slice(nextDt + 4)
      const mLink = /^<A([^>]*)>([\s\S]*?)<\/A>/i.exec(rest)
      if (mLink) {
        const href = attr(mLink[1], 'href')
        const title = attr(mLink[1], 'title')
        const name = stripTags(mLink[2])
        if (href && !href.startsWith('javascript') && !href.startsWith('#') && name) {
          items.push({ name, url: href, desc: title || undefined })
        }
        j = nextDt + 4 + mLink[0].length
        continue
      }
      const mFolder = /^<H3([^>]*)>([\s\S]*?)<\/H3>/i.exec(rest)
      if (mFolder) {
        const name = stripTags(mFolder[2])
        j = nextDt + 4 + mFolder[0].length
        const nextDl = str.indexOf('<DL', j)
        const nextDt2 = str.indexOf('<DT>', j)
        let children = []
        if (nextDl !== -1 && (nextDt2 === -1 || nextDl < nextDt2)) {
          const r = walkDl(str, nextDl)
          children = r.items
          j = r.end
        }
        if (name) items.push({ name, children })
        continue
      }
      j = nextDt + 4
    }
    return { items, end: j }
  }

  const start = html.indexOf('<DL')
  if (start === -1) return []
  return walkDl(html, start).items
}

// ---------- JSON 用药导航源转统一树形 ----------
function convertJsonNode(src) {
  const leaves = (src.sites || []).map((s) => ({ name: s.name, url: s.url, desc: s.description || s.name }))
  const subs = (src.children || []).map(convertJsonNode)
  return { name: src.name, isFolder: true, children: [...leaves, ...subs] }
}

// ------------------------------------------------------------------
// 源配置：先 JSON，后 Netscape 书签 HTML
// ------------------------------------------------------------------
const JSON_SOURCES = [
  ['977e69da-b4fb-46bc-844b-bc7ad7b83e74_00c93c66-32ea-41ba-a401-29161f39e2f6_drugx_nested.json', 'DrugX 用药导航'],
  ['bdb831e2-b97a-41d6-a6d0-b14652117799_aeabf2be-6c19-42a2-9b7f-d09f459eefd8_drugrd_nested.json', 'DrugRD 用药导航'],
  ['7b3ba9cc-96f7-47d2-b94a-f6506ecf8cbc_300f5a9a-2108-4273-9587-d1e1d540b46d_drugsnav_nested.json', 'DrugSNav 用药导航'],
]
const BOOKMARK_HTML_SOURCES = [
  ['61c6a8da-2c8b-4aa7-a1f2-389faff65a89_ac3dd64a-bbd3-469e-aaf3-7fdead5c515d_全网AI合集_浏览器书签.html', '全网AI合集'],
  ['2f4aac4d-a97c-419d-8731-85e2e3a4c37d_e1cf7971-6926-42a9-aa1b-6ffd2a7a8732_bookmarks-iLinks备份-小帅同学20260824.html', '小帅同学 iLinks 备份'],
  ['51f4cab6-fceb-4634-bdae-16cb261b3a73_cab35e79-647c-4f51-8df5-3f11eed18851_小帅同学的储物间_浏览器书签.html', '小帅同学的储物间'],
]

// 读取现有数据 & 建立全局去重集合 & 已有分组名
const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
const existingNames = new Set(existing.map((g) => g && g.name))
const seenUrls = new Set()
const collect = (nodes) => {
  for (const n of nodes) {
    if (n.url) seenUrls.add(normUrl(n.url))
    if (n.children) collect(n.children)
  }
}
collect(existing)

let totalAdded = 0
let deduped = 0
const newGroups = []

function dedupTree(nodes) {
  const out = []
  for (const n of nodes) {
    if (n.url) {
      const k = normUrl(n.url)
      if (seenUrls.has(k)) {
        deduped++
        continue
      }
      seenUrls.add(k)
      totalAdded++
      out.push(n)
    } else if (n.children && n.children.length) {
      const kept = dedupTree(n.children)
      if (kept.length) out.push({ ...n, children: kept })
    } else {
      out.push(n)
    }
  }
  return out
}

function makeGroup(name, children) {
  const kept = dedupTree(children)
  if (!kept.length) return null
  return { name, isFolder: true, children: kept }
}

for (const [file, label] of JSON_SOURCES) {
  const full = path.join(SRC_DIR, file)
  if (!fs.existsSync(full)) {
    console.warn('skip missing:', file)
    continue
  }
  if (existingNames.has(label)) {
    console.log('已有分组，跳过:', label)
    continue
  }
  const raw = JSON.parse(fs.readFileSync(full, 'utf8'))
  const children = (raw.categories || []).map(convertJsonNode)
  const g = makeGroup(label, children)
  if (g) {
    newGroups.push(g)
    existingNames.add(g.name)
  }
}

for (const [file, label] of BOOKMARK_HTML_SOURCES) {
  const full = path.join(SRC_DIR, file)
  if (!fs.existsSync(full)) {
    console.warn('skip missing:', file)
    continue
  }
  const html = fs.readFileSync(full, 'utf8')
  const top = parseBookmarkHtml(html)
  // 若顶层只有单一根文件夹，则用其名与子项作为分组
  let name = label
  let children = top
  if (top.length === 1 && top[0].children) {
    name = top[0].name || label
    children = top[0].children
  }
  if (existingNames.has(name)) {
    console.log('已有分组，跳过:', name)
    continue
  }
  const g = makeGroup(name, children)
  if (g) {
    newGroups.push(g)
    existingNames.add(g.name)
  }
}

const output = [...existing, ...newGroups]
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2), 'utf8')
console.log(`已合并 → ${DATA_FILE}`)
console.log(`原有分组: ${existing.length}，本次新增分组: ${newGroups.map((g) => g.name).join(' / ') || '无'}`)
console.log(`现共分组: ${output.length}，新增站点: ${totalAdded}，去重移除: ${deduped}`)