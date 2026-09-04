import { useEffect, useMemo, useRef, useState } from 'react'
import { BookmarkItem, SearchEngine } from './types'
import { INITIAL_BOOKMARKS, SEARCH_ENGINES, LIGHT_THEME, DARK_THEME } from './lib/constants'
import Logo from './components/Logo'
import BackToTop from './components/BackToTop'
import ThemeToggle from './components/ThemeToggle'

// 统计某节点下的叶子站点总数（递归，支持任意多级）
function countLeaves(node?: BookmarkItem): number {
  if (!node) return 0
  if (!node.children || !node.children.length) return node.url ? 1 : 0
  return node.children.reduce((a, c) => a + countLeaves(c), 0)
}

// ---------- 工具 ----------
function flattenLeaves(items: BookmarkItem[]): BookmarkItem[] {
  const out: BookmarkItem[] = []
  const walk = (list: BookmarkItem[]) => {
    for (const it of list) {
      if (it.children && it.children.length) walk(it.children)
      else if (it.url && !it.deleted) out.push(it)
    }
  }
  walk(items)
  return out
}

function matchQuery(item: BookmarkItem, q: string): boolean {
  if (!q) return true
  const kw = q.toLowerCase()
  const hay = [item.name, item.title, item.url, item.desc, (item.tags || []).join(' ')]
    .join(' ')
    .toLowerCase()
  return hay.includes(kw)
}

const GROUP_LABELS: Record<string, string> = { all: '全部站点' }

// 为每个“分类节点”（有 children 的节点）分配稳定 id，用于导航点击后平滑定位到内容区
const catIdMap = new Map<BookmarkItem, string>()
{
  let i = 0
  const walk = (nodes: BookmarkItem[]) => {
    for (const n of nodes) {
      if (n.children && n.children.length) {
        catIdMap.set(n, 'cat-' + ++i)
        walk(n.children)
      }
    }
  }
  INITIAL_BOOKMARKS.forEach((g) => walk(g.children || []))
}
function catId(node?: BookmarkItem): string | undefined {
  return node ? catIdMap.get(node) : undefined
}

// 平滑滚动到某个内容模块；延迟到渲染完成后再滚
function scrollToEl(elm: HTMLElement | null | undefined) {
  if (elm) {
    requestAnimationFrame(() => elm.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
}

export default function App() {
  const allLeaves = useMemo(() => flattenLeaves(INITIAL_BOOKMARKS), [])
  const categoryCount = useMemo(() => {
    const walk = (nodes: BookmarkItem[]): number =>
      nodes.reduce((a, nd) => a + (nd.children && nd.children.length ? 1 + walk(nd.children) : 0), 0)
    return INITIAL_BOOKMARKS.reduce((a, g) => a + walk(g.children || []), 0)
  }, [])

  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [query, setQuery] = useState('')
  const [engineValue, setEngineValue] = useState('bing')
  // 当前定位：l1 一级分组索引，l2/l3/l4 为各级子分类索引；-1 表示未选中
  const [sel, setSel] = useState<{ l1: number; l2: number; l3: number; l4: number }>({
    l1: 0,
    l2: -1,
    l3: -1,
    l4: -1,
  })
  const resultTopRef = useRef<HTMLElement | null>(null)

  const groups = INITIAL_BOOKMARKS
  const engine = SEARCH_ENGINES.find((e) => e.value === engineValue) || SEARCH_ENGINES[1]

  // 主题写入 html 根节点 & 持久化
  useEffect(() => {
    const th = dark ? DARK_THEME : LIGHT_THEME
    const root = document.documentElement
    root.setAttribute('data-theme', dark ? 'dark' : 'light')
    root.style.setProperty('--primary', th.primaryColor)
    root.style.setProperty('--accent', th.accentColor)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  // 站内搜索结果
  const results = useMemo(() => {
    if (!query.trim()) return []
    return allLeaves.filter((it) => matchQuery(it, query.trim()))
  }, [query, allLeaves])

  const isExternal = engine.group !== 'local'
  const searching = query.trim().length > 0
  const { l1, l2, l3, l4 } = sel

  // 分类栏只展示“分类”，不展示网址模块：只保留有 children 的节点
  const catChildren = (n?: BookmarkItem | null) =>
    (n && n.children ? n.children : []).filter((c) => c.children && c.children.length)

  const node1 = l1 >= 0 ? groups[l1] : null
  const list1 = catChildren(node1)
  const node2 = l2 >= 0 ? list1[l2] : null
  const list2 = catChildren(node2)
  const node3 = l3 >= 0 ? list2[l3] : null
  const list3 = catChildren(node3)
  const node4 = l4 >= 0 ? list3[l4] : null

  // 当前定位面包屑
  const crumb: string[] = !node1
    ? ['全部站点']
    : [
        node1.name,
        node2?.name,
        node3?.name,
        node4?.name,
      ].filter((x): x is string => !!x)

  const onSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    if (engine.group === 'local') {
      resultTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.open(engine.url + encodeURIComponent(q), '_blank', 'noopener')
  }

  // 选中并平滑滚动到目标模块 id
  const go = (n: { l1: number; l2: number; l3: number; l4: number }, targetId?: string | null) => {
    setSel(n)
    if (targetId) scrollToEl(window.document.getElementById(targetId))
  }

  const onClickGroup = (i: number) =>
    go({ l1: i, l2: -1, l3: -1, l4: -1 }, catId(groups[i]))

  // 内容区：仅渲染当前一级分组（-1 表示全部）
  const contentGroups = l1 < 0 ? groups : groups.slice(l1, l1 + 1)

  return (
    <div className="app" data-hassearch={searching ? '1' : '0'}>
      <div className="top-bar">
        <header className="header">
          <div className="header-inner">
            <div className="brand">
              <div className="brand-logo">🧭</div>
              <div className="brand-text">
                <h1>导航聚合站</h1>
                <p>共 {allLeaves.length} 个精选站点 · {categoryCount} 个分类</p>
              </div>
            </div>
            <SearchBar
              query={query}
              setQuery={setQuery}
              engine={engine}
              onEngineChange={setEngineValue}
              onSubmit={onSearchSubmit}
              isExternal={isExternal}
            />
            <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
          </div>
        </header>

        {!searching && (
          <div className="bars">
            {/* 一级分类栏 */}
            <nav className="bar bar-1">
              <button
                className={l1 < 0 ? 'cat-pill active' : 'cat-pill'}
                onClick={() => go({ l1: -1, l2: -1, l3: -1, l4: -1 })}
              >
                {GROUP_LABELS.all}
                <span className="n">{allLeaves.length}</span>
              </button>
              {groups.map((g, i) => (
                <button
                  key={g.name}
                  className={l1 === i ? 'cat-pill active' : 'cat-pill'}
                  onClick={() => onClickGroup(i)}
                >
                  {g.name}
                  <span className="n">{countLeaves(g)}</span>
                </button>
              ))}
            </nav>

            {/* 二级分类栏：选中一级后出现（只列分类，不含网址） */}
            {node1 && list1.length > 0 && (
              <nav className="bar bar-2">
                {list1.map((c, j) => (
                  <button
                    key={(c.id || c.name) + j}
                    className={l2 === j ? 'sub-pill active' : 'sub-pill'}
                    onClick={() => go({ l1, l2: j, l3: -1, l4: -1 }, catId(c))}
                  >
                    {c.name}
                    <span className="n">{countLeaves(c)}</span>
                  </button>
                ))}
              </nav>
            )}

            {/* 三级分类栏：选中二级后出现（只列分类，不含网址） */}
            {node2 && list2.length > 0 && (
              <nav className="bar bar-3">
                {list2.map((c, k) => (
                  <button
                    key={(c.id || c.name) + k}
                    className={l3 === k ? 'sub-pill active' : 'sub-pill'}
                    onClick={() => go({ l1, l2, l3: k, l4: -1 }, catId(c))}
                  >
                    {c.name}
                    <span className="n">{countLeaves(c)}</span>
                  </button>
                ))}
              </nav>
            )}

            {/* 四级分类栏：选中三级后出现（只列分类，不含网址） */}
            {node3 && list3.length > 0 && (
              <nav className="bar bar-4">
                {list3.map((c, m) => (
                  <button
                    key={(c.id || c.name) + m}
                    className={l4 === m ? 'sub-pill active' : 'sub-pill'}
                    onClick={() => go({ l1, l2, l3, l4: m }, catId(c))}
                  >
                    {c.name}
                    <span className="n">{countLeaves(c)}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>
        )}
      </div>

      <main className="main-scroll">
        <div className="container">
          {searching ? (
            <section className="search-results" ref={resultTopRef}>
              <h2 className="results-title">
                站内搜索 “{query.trim()}” 共 {results.length} 条结果
                {isExternal && <span className="hint">按回车将跳转 {engine.name} 搜索</span>}
              </h2>
              {results.length ? (
                <div className="grid">
                  {results.map((it) => (
                    <SiteCard key={(it.id || it.url) + it.name} item={it} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  未找到相关内容，可切换“站外搜索”在 {engine.name} 中查询。
                </div>
              )}
            </section>
          ) : (
            <>
              <div className="crumb">
                当前定位：<b>{crumb.join(' › ')}</b>
              </div>
              {contentGroups.map((group) => (
                <section className="group" key={group.name}>
                  <h2 className="group-title">
                    <span className="group-name">{group.name}</span>
                    <span className="group-count">{countLeaves(group)} 站点</span>
                  </h2>
                  {group.children?.map((child, i) => (
                    <CategoryNode key={(child.id || child.name) + i} node={child} depth={1} />
                  ))}
                </section>
              ))}
            </>
          )}
        </div>
      </main>

      <footer className="footer">导航聚合站 · 图标由多源自动获取 · 支持日夜模式与站内/站外搜索</footer>
      <BackToTop />
    </div>
  )
}

// ---------- 搜索栏 ----------
function SearchBar(props: {
  query: string
  setQuery: (v: string) => void
  engine: SearchEngine
  onEngineChange: (v: string) => void
  onSubmit: (e?: React.FormEvent) => void
  isExternal: boolean
}) {
  const { query, setQuery, engine, onEngineChange, onSubmit, isExternal } = props

  const groupsOrder = ['local', 'general', 'ai']
  const groupName: Record<string, string> = { local: '站内', general: '综合引擎', ai: 'AI 搜索' }

  return (
    <form className="searchbar" onSubmit={onSubmit}>
      <select
        className="engine-select"
        value={engine.value}
        onChange={(e) => onEngineChange(e.target.value)}
        aria-label="选择搜索方式"
      >
        {groupsOrder.map((grp) => (
          <optgroup key={grp} label={groupName[grp]}>
            {SEARCH_ENGINES.filter((e) => e.group === grp).map((e) => (
              <option key={e.value} value={e.value}>
                {e.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <input
        className="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          engine.group === 'local'
            ? '站内搜索站点名称 / 网址 / 标签…'
            : `站外搜索：通过 ${engine.name} 查询…`
        }
      />
      <button className="search-btn" type="submit" title={isExternal ? `使用${engine.name}搜索` : '站内搜索'}>
        {isExternal ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </form>
  )
}

// ---------- 内容区递归渲染 ----------
// 有 url 的叶子渲染为站点卡片；有 children 的渲染为子分类并缩进归在父分类下
function CategoryNode({ node, depth = 1 }: { node: BookmarkItem; depth?: number }) {
  const kids = node.children || []

  if (!kids.length) return node.url ? <SiteCard item={node} /> : null

  const leaves = kids.filter((c) => !c.children || !c.children.length)
  const subs = kids.filter((c) => c.children && c.children.length)

  return (
    <div id={catId(node)} className={`category ${depth > 1 ? 'subcategory' : ''}`}>
      <h3 className="cat-title">
        <span className="cat-name">{node.name}</span>
        <span className="cat-count">{countLeaves(node)}</span>
      </h3>
      {leaves.length > 0 && (
        <div className="grid">
          {leaves.map((s) => (
            <SiteCard key={(s.id || s.url) + s.name} item={s} />
          ))}
        </div>
      )}
      {subs.map((sc, i) => (
        <CategoryNode key={(sc.id || sc.name) + i} node={sc} depth={depth + 1} />
      ))}
    </div>
  )
}

// ---------- 单个站点卡片 ----------
function SiteCard({ item }: { item: BookmarkItem }) {
  return (
    <a className="card" href={item.url} target="_blank" rel="noopener noreferrer">
      <Logo item={item} />
      <div className="card-body">
        <div className="card-name">{item.name}</div>
        {item.desc && <div className="card-intro">{item.desc}</div>}
        {item.tags && item.tags.length > 0 && (
          <div className="card-tags">
            {item.tags.slice(0, 4).map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}