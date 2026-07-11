import { useRef, useEffect, useState } from 'react'

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function FadeIn({ children, delay = 0, y = 28, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion()) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translateY(${y}px)`,
        filter: visible ? 'none' : 'blur(5px)',
        transition: [
          `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          `filter 0.6s ease-out ${delay}s`,
        ].join(', '),
        willChange: visible ? 'auto' : 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  )
}
