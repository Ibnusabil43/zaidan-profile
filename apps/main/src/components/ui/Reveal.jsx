import { motion, useReducedMotion } from 'framer-motion'

/**
 * Subtle, monochrome-friendly scroll reveal.
 * Fades + lifts content into place once, when it enters the viewport.
 *
 * When the visitor asks for reduced motion, the content renders straight to its
 * resting state — visible, in place, no transition. It must never stay at
 * opacity 0 waiting for an animation that will not run.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const MotionTag = motion[as] ?? motion.div
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <MotionTag className={className}>{children}</MotionTag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
