export interface BookmarkItem {
  id?: string
  name: string
  title?: string
  url?: string
  desc?: string
  tags?: string[]
  icon?: string
  customIcon?: string
  iconifyIcon?: string
  isFolder?: boolean
  children?: BookmarkItem[]
  deleted?: boolean
}

export type IconSource =
  | 'favicon_im'
  | 'favicon_myhkw'
  | 'favicon_iowen'
  | 'favicon_baidu'
  | 'favicon_afmax'
  | 'favicon_la4'
  | 'favicon_vvhan'
  | 'favicon_xinac'
  | 'favicon_vip'
  | 'favicon_cravatar'
  | 'direct'
  | 'favicon_duckduckgo'
  | 'favicon_extractor'
  | 'favicon_pub'
  | 'google'
  | 'clearbit'
  | 'icons_duckduckgo'
  | 'iconhorse'
  | 'logo_surf'
  | 'iconify'
  | 'custom'

export interface SearchEngine {
  value: string
  name: string
  group: 'local' | 'general' | 'ai' | string
  url: string
  icon: string
}

export interface ThemeConfig {
  id: string
  name: string
  nameEn: string
  icon: string
  type: 'light' | 'dark'
  themeGroup: string
  primaryColor: string
  accentColor: string
  bgColor: string
  tags: string[]
}