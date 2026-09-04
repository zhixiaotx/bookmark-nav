import { BookmarkItem, IconSource } from '../types'

// ==========================================
// 1. 图标源定义与多接口配置
// ==========================================
export const iconSources: { value: IconSource; label: string; detail: string }[] = [
  { value: 'favicon_im', label: 'favicon.im', detail: '聚合服务，默认' },
  { value: 'favicon_myhkw', label: 'MyHKW', detail: '国内高速，30天缓存' },
  { value: 'favicon_iowen', label: 'iowen.cn', detail: '国内聚合' },
  { value: 'favicon_baidu', label: '百度图标', detail: '国内聚合' },
  { value: 'favicon_afmax', label: 'AFMax', detail: '国内聚合' },
  { value: 'favicon_la4', label: 'La4', detail: '国内聚合' },
  { value: 'favicon_vvhan', label: 'Vvhan', detail: '国内聚合' },
  { value: 'favicon_xinac', label: 'xinac.net', detail: '聚合服务' },
  { value: 'favicon_vip', label: 'favicon.vip', detail: '聚合服务' },
  { value: 'favicon_cravatar', label: 'Cravatar', detail: '聚合服务' },
  { value: 'direct', label: '站点直连', detail: '直接请求 /favicon.ico' },
  { value: 'favicon_duckduckgo', label: 'DuckDuckGo', detail: '全球聚合' },
  { value: 'favicon_extractor', label: 'Favicon Extractor', detail: '聚合服务' },
  { value: 'favicon_pub', label: 'FaviconPub', detail: '聚合服务' },
  { value: 'google', label: 'Google S2', detail: '海外接口' },
  { value: 'clearbit', label: 'Clearbit', detail: '企业级图标服务' },
  { value: 'icons_duckduckgo', label: 'DDG Icons', detail: 'DuckDuckGo 稳定接口' },
  { value: 'iconhorse', label: 'Icon Horse', detail: '高质量图标服务' },
  { value: 'logo_surf', label: '文字图标', detail: '本地生成' },
  { value: 'iconify', label: 'Iconify', detail: '需在数据中指定图标' },
  { value: 'custom', label: '自定义', detail: '需在数据中指定图片地址' },
]

// 知名网站词典，用于自动补全和精准命名
const KNOWN_SITES: Record<string, string> = {
  'github.com': 'GitHub',
  'gitlab.com': 'GitLab',
  'gitee.com': 'Gitee 码云',
  'bilibili.com': '哔哩哔哩 (Bilibili)',
  'zhihu.com': '知乎',
  'youtube.com': 'YouTube',
  'google.com': 'Google 搜索',
  'baidu.com': '百度',
  'bing.com': 'Bing 必应',
  'taobao.com': '淘宝网',
  'jd.com': '京东',
  'weibo.com': '微博',
  'v2ex.com': 'V2EX 社区',
  'juejin.cn': '稀土掘金',
  'csdn.net': 'CSDN 技术社区',
  'segmentfault.com': '思否 SegmentFault',
  'chatgpt.com': 'ChatGPT',
  'openai.com': 'OpenAI',
  'claude.ai': 'Claude AI',
  'deepseek.com': 'DeepSeek 深度求索',
  'kimi.moonshot.cn': 'Kimi 智能助手',
  'perplexity.ai': 'Perplexity AI',
  'douyin.com': '抖音',
  'xiaohongshu.com': '小红书',
  'figma.com': 'Figma',
  'notion.so': 'Notion',
  'discord.com': 'Discord',
  'twitter.com': 'Twitter / X',
  'x.com': 'X (Twitter)',
  'reddit.com': 'Reddit',
  'stackoverflow.com': 'Stack Overflow',
  'npmjs.com': 'npm 包管理',
  'tailwindcss.com': 'Tailwind CSS',
  'react.dev': 'React 官方文档',
  'reactjs.org': 'React',
  'vuejs.org': 'Vue.js',
  'docker.com': 'Docker',
  'cloudflare.com': 'Cloudflare',
  'vercel.com': 'Vercel',
  'netlify.com': 'Netlify',
  'aliyun.com': '阿里云',
  'tencent.com': '腾讯云',
  'cloud.tencent.com': '腾讯云',
  'qiu.moe': '秋风博客',
  'sm.ms': 'SM.MS 图床',
  'unsplash.com': 'Unsplash 壁纸',
  'wikipedia.org': '维基百科',
  'yuque.com': '语雀知识库',
}

// ==========================================
// 2. 核心辅助函数 (Hostname 与 本地文字图标)
// ==========================================
export function getHostname(url?: string): string {
  if (!url) return ''
  try {
    let formatted = url.trim()
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted
    }
    const parsed = new URL(formatted)
    return parsed.hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].split('?')[0]
  }
}

export function extractDomain(urlStr: string): string {
  return getHostname(urlStr)
}

export function extractOrigin(urlStr: string): string {
  try {
    if (!urlStr) return ''
    let formatted = urlStr.trim()
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted
    }
    const parsed = new URL(formatted)
    return parsed.origin
  } catch {
    const domain = extractDomain(urlStr)
    return domain ? `https://${domain}` : ''
  }
}

export function logoSurfIcon(title?: string): string {
  const text = (title || '★').trim().charAt(0).toUpperCase() || '★'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4f46e5"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="28" font-family="system-ui, -apple-system, sans-serif" font-weight="bold">${text}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// ==========================================
// 3. 根据指定的源构建 Favicon 请求 URL
// ==========================================
export function getFaviconUrl(
  itemOrUrl:
    | BookmarkItem
    | string
    | { url?: string; title?: string; name?: string; icon?: string; iconifyIcon?: string; customIcon?: string },
  source: IconSource = 'favicon_im'
): string {
  let url = ''
  let title = ''
  let icon = ''
  let iconifyIcon = ''
  let customIcon = ''

  if (typeof itemOrUrl === 'string') {
    url = itemOrUrl
    title = itemOrUrl
  } else if (itemOrUrl) {
    url = itemOrUrl.url || ''
    title = itemOrUrl.title || (itemOrUrl as BookmarkItem).name || ''
    icon = itemOrUrl.icon || ''
    iconifyIcon = itemOrUrl.iconifyIcon || ''
    customIcon = itemOrUrl.customIcon || (itemOrUrl.icon?.startsWith('http') ? itemOrUrl.icon : '')
  }

  // 如果指定了自定义图片且 source 为 custom 或当前已有直接图片链接
  if (source === 'custom' && customIcon) {
    return customIcon
  }

  const hostname = getHostname(url)
  if (!hostname) return logoSurfIcon(title)

  switch (source) {
    case 'direct':
      return `https://${hostname}/favicon.ico`
    case 'favicon_im':
      return `https://favicon.im/${hostname}?larger=true`
    case 'favicon_iowen':
      return `https://api.iowen.cn/favicon/${hostname}.png`
    case 'favicon_xinac':
      return `https://api.xinac.net/icon/?url=${encodeURIComponent(hostname)}`
    case 'favicon_vip':
      return `https://www.favicon.vip/get.php?url=${encodeURIComponent(hostname)}`
    case 'favicon_cravatar':
      return `https://cn.cravatar.com/favicon/api/index.php?url=${encodeURIComponent(hostname)}`
    case 'favicon_baidu':
      return `https://favicon.baidu.com/favicon?site=${encodeURIComponent(hostname)}`
    case 'favicon_duckduckgo':
      return `https://icons.duckduckgo.com/ip3/${hostname}.ico`
    case 'favicon_extractor':
      return `https://www.faviconextractor.com/favicon/${hostname}?larger=true`
    case 'favicon_pub':
      return `https://faviconpub.app/favicon?domain=${encodeURIComponent(hostname)}`
    case 'favicon_afmax':
      return `https://api.afmax.cn/so/ico/index.php?r=${encodeURIComponent(hostname)}`
    case 'favicon_la4':
      return `https://ico.la4.cn/ico.php?url=${encodeURIComponent(hostname)}`
    case 'favicon_vvhan':
      return `https://api.vvhan.com/api/ico?url=${encodeURIComponent(hostname)}`
    case 'favicon_myhkw':
      return `https://myhkw.cn/open/web/fav?url=${encodeURIComponent(hostname)}`
    case 'google':
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`
    case 'clearbit':
      return `https://logo.clearbit.com/${hostname}?size=128`
    case 'icons_duckduckgo':
      return `https://icons.duckduckgo.com/ip3/${hostname}.ico`
    case 'iconhorse':
      return `https://icon.horse/icon/${hostname}`
    case 'iconify':
      return iconifyIcon ? `https://api.iconify.design/${iconifyIcon}.svg` : logoSurfIcon(title)
    case 'custom':
      return customIcon || (icon && icon.startsWith('http') ? icon : logoSurfIcon(title))
    case 'logo_surf':
    default:
      return logoSurfIcon(title)
  }
}

// 统一 UI 渲染解析方法 (支持 Emoji、图片直链、解析源和文字头像)
export function resolveFaviconDisplay(
  url?: string,
  icon?: string,
  preferredSource: IconSource = 'favicon_im'
): {
  type: 'emoji' | 'img' | 'letter'
  value: string
} {
  if (icon && icon.trim()) {
    const trimmed = icon.trim()
    if (
      trimmed.length <= 4 &&
      !trimmed.startsWith('http') &&
      !trimmed.startsWith('data:') &&
      !trimmed.includes('.') &&
      !trimmed.includes('/')
    ) {
      return { type: 'emoji', value: trimmed }
    }
    return { type: 'img', value: trimmed }
  }

  if (!url) {
    return { type: 'letter', value: '★' }
  }

  const hostname = getHostname(url)
  if (!hostname) {
    return { type: 'letter', value: '★' }
  }

  const generatedUrl = getFaviconUrl({ url, title: hostname }, preferredSource)
  return { type: 'img', value: generatedUrl }
}

// ==========================================
// 4. 源质量评分与优先级分组
// ==========================================
export function getSourceQuality(source: IconSource): number {
  const qualityMap: Record<IconSource, number> = {
    clearbit: 100,
    icons_duckduckgo: 95,
    google: 90,
    iconhorse: 90,
    favicon_im: 85,
    favicon_myhkw: 85,
    favicon_duckduckgo: 80,
    favicon_extractor: 75,
    favicon_pub: 75,
    favicon_iowen: 70,
    favicon_baidu: 70,
    favicon_afmax: 65,
    favicon_la4: 65,
    favicon_vvhan: 65,
    favicon_xinac: 60,
    favicon_vip: 60,
    favicon_cravatar: 55,
    direct: 40,
    logo_surf: 20,
    iconify: 90,
    custom: 100,
  }
  return qualityMap[source] || 50
}

// 源优先级
export const SOURCE_PRIORITY: IconSource[][] = [
  ['favicon_im', 'favicon_myhkw', 'favicon_iowen', 'favicon_baidu', 'favicon_afmax'],
  ['favicon_la4', 'favicon_vvhan', 'favicon_xinac', 'favicon_vip'],
  ['google', 'clearbit', 'icons_duckduckgo', 'iconhorse', 'favicon_duckduckgo'],
  ['direct'],
  ['logo_surf'],
]

// ==========================================
// 5. 探测测试与 Fallback 机制
// ==========================================

// 测试特定 API 的可用性
export async function testIconSource(
  item: BookmarkItem,
  source: IconSource,
  timeout = 5000
): Promise<{ success: boolean; url: string; statusCode?: number; error?: string }> {
  const url = getFaviconUrl(item, source)

  // SVG Data URL 无需发起网络请求
  if (url.startsWith('data:image')) {
    return { success: true, url, statusCode: 200 }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const checkImageLoad = new Promise<boolean>((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })

    const isImageValid = await Promise.race([
      checkImageLoad,
      new Promise<boolean>((_, reject) => {
        controller.signal.addEventListener('abort', () => reject(new Error('Timeout')))
      }),
    ]).catch(() => false)

    clearTimeout(timeoutId)

    if (isImageValid) {
      return { success: true, url, statusCode: 200 }
    }

    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
    }).catch(() => null)

    return {
      success: !!response,
      url,
      statusCode: response ? 200 : 404,
    }
  } catch (error) {
    return {
      success: false,
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// 多源 Fallback 机制
export async function getFaviconUrlWithFallback(
  item: BookmarkItem,
  sources: IconSource[] = ['favicon_im', 'favicon_myhkw', 'favicon_iowen', 'google']
): Promise<{ url: string; source: IconSource }> {
  const hostname = getHostname(item.url)
  if (!hostname) {
    return { url: logoSurfIcon(item.name || item.title), source: 'logo_surf' }
  }

  for (const source of sources) {
    const testResult = await testIconSource(item, source, 2500)
    if (testResult.success) {
      return { url: testResult.url, source }
    }
  }

  return {
    url: getFaviconUrl(item, sources[0] || 'favicon_im'),
    source: sources[0] || 'favicon_im',
  }
}

// ==========================================
// 6. UI 选择与建议辅助
// ==========================================
export function getFaviconSources(urlOrDomain: string): { id: string; name: string; url: string }[] {
  const domain = getHostname(urlOrDomain)
  if (!domain) return []
  return iconSources.map((s) => ({
    id: s.value,
    name: s.label,
    url: getFaviconUrl({ url: domain, title: domain }, s.value),
  }))
}

export function getAutoFavicon(urlOrDomain: string, preferredSource: IconSource = 'favicon_im'): string {
  const domain = getHostname(urlOrDomain)
  if (!domain) return ''
  return getFaviconUrl({ url: domain, title: domain }, preferredSource)
}

export function suggestSiteName(urlStr: string): string {
  if (!urlStr) return ''
  const domain = getHostname(urlStr)
  if (!domain) return ''

  if (KNOWN_SITES[domain]) {
    return KNOWN_SITES[domain]
  }

  const parts = domain.split('.')
  if (parts.length >= 2) {
    const rootDomain = parts.slice(-2).join('.')
    if (KNOWN_SITES[rootDomain]) {
      const sub = parts.slice(0, -2).join(' ')
      const subTitle = sub ? sub.charAt(0).toUpperCase() + sub.slice(1) + ' - ' : ''
      return `${subTitle}${KNOWN_SITES[rootDomain]}`
    }
  }

  const mainName = parts.length >= 2 ? parts[parts.length - 2] : domain
  return mainName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getLetterAvatar(name: string): string {
  if (!name) return '★'
  const clean = name.trim()
  const char = clean.charAt(0).toUpperCase()
  return char || '★'
}

export function getColorForString(str: string): string {
  const colors = [
    'linear-gradient(135deg, #00d4aa 0%, #00b494 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}