import { type CSSProperties, type ElementType, type ReactNode } from 'react'
import {
  scrollRevealClass,
  useScrollReveal,
  type ScrollRevealVariant,
} from '../../hooks/useScrollReveal'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  variant?: ScrollRevealVariant
  delay?: number
  as?: ElementType
  id?: string
}

export function ScrollReveal({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  id,
}: ScrollRevealProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>()

  return (
    <Tag
      ref={ref}
      id={id}
      className={scrollRevealClass(revealed, variant, className)}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
