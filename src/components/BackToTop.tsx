import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      className={`back-top ${visible ? 'show' : ''}`}
      onClick={onClick}
      aria-label="回到顶部"
      title="回到顶部"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}