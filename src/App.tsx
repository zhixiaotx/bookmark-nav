import { useEffect, useMemo, useRef, useState } from 'react'
import { BookmarkItem, SearchEngine } from './types'
import { INITIAL_BOOKMARKS, SEARCH_ENGINES, LIGHT_THEME, DARK_THEME } from './lib/constants'
import Logo, { hostnameOf } from './components/Logo'
import BackToTop from './components/BackToTop'
import ThemeToggle from './components/ThemeToggle'

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

export default function App() {
  const allLeaves = useMemo(() => flattenLeaves(INITIAL_BOOKMARKS), [])

  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState('all')
  const [engineValue, setEngineValue] = useState('bing')
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

  const onSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    if (engine.group === 'local') {
      // 站内搜索：滚动到结果区
      resultTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    // 站外搜索
    window.open(engine.url + encodeURIComponent(q), '_blank', 'noopener')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-logo">🧭</div>
            <div className="brand-text">
              <h1>导航聚合站</h1>
              <p>共 {allLeaves.length} 个精选站点 · 58 个分类</p>
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

      {/* 分组切换 */}
      <nav className="group-tabs">
        <button
          className={activeGroup === 'all' ? 'active' : ''}
          onClick={() => setActiveGroup('all')}
        >
          {GROUP_LABELS.all}
        </button>
        {groups.map((g) => (
          <button
            key={g.name}
            className={activeGroup === g.name ? 'active' : ''}
            onClick={() => setActiveGroup(g.name)}
          >
            {g.name}
          </button>
        ))}
      </nav>

      <main className="container">
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
            {groups
              .filter((g) => activeGroup === 'all' || g.name === activeGroup)
              .map((group) => (
                <section className="group" key={group.name}>
                  <h2 className="group-title">
                    <span className="group-name">{group.name}</span>
                    <span className="group-count">{(group.children || []).reduce((a, c) => a + (c.children ? c.children.length : 0), 0)} 站点</span>
                  </h2>
                  {group.children?.map((cat) => (
                    <Category key={cat.name} cat={cat} />
                  ))}
                </section>
              ))}
          </>
        )}
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

// ---------- 分类卡片组 ----------
function Category({ cat }: { cat: BookmarkItem }) {
  const items = cat.children || []
  return (
    <div className="category">
      <h3 className="cat-title">
        {cat.name}
        <span className="cat-count">{items.length}</span>
      </h3>
      <div className="grid">
        {items.map((it) => (
          <SiteCard key={(it.id || it.url) + it.name} item={it} />
        ))}
      </div>
    </div>
  )
}

// ---------- 单个站点卡片 ----------
function SiteCard({ item }: { item: BookmarkItem }) {
  const host = item.url ? hostnameOf(item.url) : ''
  return (
    <a className="card" href={item.url} target="_blank" rel="noopener noreferrer">
      <Logo item={item} />
      <div className="card-body">
        <div className="card-name">{item.name}</div>
        <div className="card-url">{host}</div>
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