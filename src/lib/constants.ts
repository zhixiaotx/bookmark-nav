import { BookmarkItem, SearchEngine, ThemeConfig } from '../types'
import mergedBookmarks from '../data/bookmarks.json'

export const SEARCH_ENGINES: SearchEngine[] = [
  { value: 'local', name: '本站', group: 'local', url: '', icon: '🔍' },
  {
    value: 'bing',
    name: '必应',
    group: 'general',
    url: 'https://www.bing.com/search?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 5v14l6-3.5V8.5L7 5zm6 3.5v7l6 3.5V8.5L13 8.5z" fill="#0089D6"/></svg>',
  },
  {
    value: 'baidu',
    name: '百度',
    group: 'general',
    url: 'https://www.baidu.com/s?wd=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 15c-.8 0-1.5-.7-1.5-1.5v-3c0-.8.7-1.5 1.5-1.5h3c.8 0 1.5.7 1.5 1.5v3c0 .8-.7 1.5-1.5 1.5h-3zm0-6c-.8 0-1.5-.7-1.5-1.5v-3c0-.8.7-1.5 1.5-1.5h3c.8 0 1.5.7 1.5 1.5v3c0 .8-.7 1.5-1.5 1.5h-3z" fill="#23B8E8"/></svg>',
  },
  {
    value: 'google',
    name: '谷歌',
    group: 'general',
    url: 'https://www.google.com/search?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.35 11.1H12v3.8h5.38c-.24 1.28-.96 2.37-2.05 3.1v2.58h3.32c1.94-1.78 3.06-4.4 3.06-7.48 0-.68-.06-1.34-.16-2z" fill="#4285F4"/><path d="M12 20.6c2.43 0 4.47-.8 5.96-2.18l-3.32-2.58c-.92.62-2.1.98-3.64.98-2.34 0-4.32-1.58-5.03-3.7H2.54v2.66C4.02 18.7 7.74 20.6 12 20.6z" fill="#34A853"/><path d="M6.97 13.12a5.16 5.16 0 0 1 0-3.24V7.22H2.54a8.98 8.98 0 0 0 0 9.56l4.43-3.66z" fill="#FBBC05"/><path d="M12 7.4c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 4.68 14.43 4 12 4c-4.26 0-7.98 1.9-9.46 4.66l4.43 3.66c.71-2.12 2.69-3.7 5.03-3.7z" fill="#EA4335"/></svg>',
  },
  {
    value: 'duckduckgo',
    name: 'DuckDuckGo',
    group: 'general',
    url: 'https://duckduckgo.com/?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#DE5833"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">D</text></svg>',
  },
  {
    value: 'sogou',
    name: '搜狗搜索',
    group: 'general',
    url: 'https://www.sogou.com/web?query=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#FB6022"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">搜</text></svg>',
  },
  {
    value: 'so',
    name: '360搜索',
    group: 'general',
    url: 'https://www.so.com/s?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#18B22B"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    value: 'sm',
    name: '神马搜索',
    group: 'general',
    url: 'https://m.sm.cn/s?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#FFB200"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">神</text></svg>',
  },
  {
    value: 'yahoo',
    name: '雅虎',
    group: 'general',
    url: 'https://search.yahoo.com/search?p=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#6001D2"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">Y</text></svg>',
  },
  {
    value: 'yandex',
    name: 'Yandex',
    group: 'general',
    url: 'https://yandex.com/search/?text=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#FC3F1D"/><text x="12" y="17" font-size="13" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">Я</text></svg>',
  },
  {
    value: 'brave',
    name: 'Brave',
    group: 'general',
    url: 'https://search.brave.com/search?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#FB542B"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">B</text></svg>',
  },
  {
    value: 'startpage',
    name: 'Startpage',
    group: 'general',
    url: 'https://www.startpage.com/sp/search?query=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#082A62"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">S</text></svg>',
  },
  {
    value: 'ecosia',
    name: 'Ecosia',
    group: 'general',
    url: 'https://www.ecosia.org/search?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#008060"/><path d="M12 6v12M8 10h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>',
  },
  {
    value: 'naver',
    name: 'Naver',
    group: 'general',
    url: 'https://search.naver.com/search.naver?query=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#03C75A"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">N</text></svg>',
  },
  {
    value: 'youtube',
    name: 'YouTube',
    group: 'general',
    url: 'https://www.youtube.com/results?search_query=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 12s0-3.85-.5-5.4a3 3 0 0 0-2.1-2.1C18.8 4 12 4 12 4s-6.8 0-8.4.5a3 3 0 0 0-2.1 2.1C1 8.15 1 12 1 12s0 3.85.5 5.4a3 3 0 0 0 2.1 2.1c1.6.5 8.4.5 8.4.5s6.8 0 8.4-.5a3 3 0 0 0 2.1-2.1c.5-1.55.5-5.4.5-5.4z" fill="#FF0000"/><path d="M9.5 8.5V15.5L15.5 12z" fill="#FFF"/></svg>',
  },
  {
    value: 'bilibili',
    name: '哔哩哔哩',
    group: 'general',
    url: 'https://search.bilibili.com/all?keyword=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#00AEEC"/><path d="M6 15h12M9 9h.01M15 9h.01" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>',
  },
  {
    value: 'zhihu',
    name: '知乎',
    group: 'general',
    url: 'https://www.zhihu.com/search?type=content&q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#0084FF"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">知</text></svg>',
  },
  {
    value: 'weixin',
    name: '微信搜一搜',
    group: 'general',
    url: 'https://weixin.sogou.com/weixin?type=2&query=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12c0-5 4.5-9 10-9s10 4 10 9-4.5 9-10 9c-1.2 0-2.3-.2-3.3-.6l-3 1 .8-2.5C3.5 16.5 2 14.5 2 12z" fill="#07C160"/><circle cx="8" cy="10" r="1.5" fill="#fff"/><circle cx="14" cy="10" r="1.5" fill="#fff"/></svg>',
  },
  {
    value: 'taobao',
    name: '淘宝',
    group: 'general',
    url: 'https://s.taobao.com/search?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#FF5000"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">淘</text></svg>',
  },
  {
    value: 'jd',
    name: '京东',
    group: 'general',
    url: 'https://search.jd.com/Search?keyword=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#E1251B"/><text x="12" y="17" font-size="14" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">东</text></svg>',
  },
  {
    value: 'metaso',
    name: '秘塔AI搜索',
    group: 'ai',
    url: 'https://metaso.cn/?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#5B67E8"/><text x="12" y="17" font-size="14" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">M</text></svg>',
  },
  {
    value: 'nami',
    name: '纳米AI搜索',
    group: 'ai',
    url: 'https://www.n.cn/search/?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#E1051B"/><text x="12" y="17" font-size="14" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">纳</text></svg>',
  },
  {
    value: 'felo',
    name: 'Felo AI搜索',
    group: 'ai',
    url: 'https://felo.ai/search?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#00A4FF"/><text x="12" y="17" font-size="14" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">F</text></svg>',
  },
  {
    value: 'tiangong',
    name: '天工AI搜索',
    group: 'ai',
    url: 'https://www.tiangong.cn/search?q=',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#6633CC"/><text x="12" y="17" font-size="14" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">天</text></svg>',
  },
]

// 经典明/暗主题色板（白天黑夜切换）
export const LIGHT_THEME = {
  id: 'minimal-light',
  name: '白天模式',
  primaryColor: '#2563eb',
  accentColor: '#3b82f6',
  bgColor: '#f6f8fc',
} as const

export const DARK_THEME = {
  id: 'minimal-dark',
  name: '夜间模式',
  primaryColor: '#38bdf8',
  accentColor: '#60a5fa',
  bgColor: '#0f172a',
} as const

export type NavTheme = typeof LIGHT_THEME | typeof DARK_THEME

export const THEMES: ThemeConfig[] = [
  {
    id: 'aurora-light',
    name: '极光流光',
    nameEn: 'Aurora Light',
    icon: '🌈',
    type: 'light',
    themeGroup: 'aurora',
    primaryColor: '#16a34a',
    accentColor: '#10b981',
    bgColor: '#f0fdf4',
    tags: ['流光', '自然', '活力'],
  },
  {
    id: 'aurora-dark',
    name: '极光流光',
    nameEn: 'Aurora Dark',
    icon: '✨',
    type: 'dark',
    themeGroup: 'aurora',
    primaryColor: '#22c55e',
    accentColor: '#4ade80',
    bgColor: '#052e16',
    tags: ['流光', '暗夜', '炫彩'],
  },
]

export const INITIAL_BOOKMARKS: BookmarkItem[] = mergedBookmarks as BookmarkItem[]