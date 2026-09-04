import { useEffect, useState } from 'react'
import { BookmarkItem, IconSource } from '../types'
import {
  getFaviconUrl,
  getHostname,
  getLetterAvatar,
  getColorForString,
} from '../lib/favicon'

// 自动获取 Logo：多源回退 + 最终文字头像兜底
export default function Logo({ item, size = 40 }: { item: BookmarkItem; size?: number }) {
  const icon = item.icon?.trim()
  const isEmoji = !!icon && icon.length <= 4 && !icon.startsWith('http') && !icon.startsWith('data:' )
  const url = item.url || ''

  const [failedSources, setFailedSources] = useState<IconSource[]>([])
  const [useLetter, setUseLetter] = useState(isEmoji ? false : false)

  const fallbackChain: IconSource[] = ['favicon_im', 'favicon_baidu', 'google', 'icons_duckduckgo']
  const currentSource =
    fallbackChain.find((s) => !failedSources.includes(s)) || ('logo_surf' as IconSource)

  const src = isEmoji ? '' : getFaviconUrl({ url, title: item.name }, currentSource)
  const letter = getLetterAvatar(item.name)
  const gradient = getColorForString(item.name || url)

  // 数据项图标变化时重置
  useEffect(() => {
    setFailedSources([])
    setUseLetter(isEmoji)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, item.name, isEmoji])

  if (isEmoji) {
    return (
      <div className="site-logo emoji" style={{ width: size, height: size, fontSize: size * 0.5 }}>
        {icon}
      </div>
    )
  }

  if (useLetter) {
    return (
      <div
        className="site-logo letter"
        style={{ width: size, height: size, fontSize: size * 0.46, background: gradient }}
      >
        {letter}
      </div>
    )
  }

  return (
    <div className="site-logo" style={{ width: size, height: size }}>
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => {
          if (failedSources.length >= fallbackChain.length) {
            setUseLetter(true)
          } else {
            setFailedSources((p) => [...p, currentSource])
          }
        }}
      />
    </div>
  )
}

export function hostnameOf(url: string) {
  return getHostname(url)
}