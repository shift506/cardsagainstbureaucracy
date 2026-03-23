# Approved Animation Patterns

## Page Transition Pattern
Use `AnimatePresence` with `mode="wait"` at the router level.
Use `layoutId` for shared-element transitions between routes.
All pages wrap content in `<m.main variants={pageVariants}>`.

```tsx
<AnimatePresence mode="wait">
  <m.main key={route} variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </m.main>
</AnimatePresence>
```

## Scroll Reveal Pattern
Use `useScrollReveal()` hook which wraps `useInView` with `once: true`.
Apply `scrollReveal` or `staggerContainer` variants.
Always respect `useReducedMotion()` — skip animation if true.

```tsx
const { ref, isInView } = useScrollReveal()
<m.div ref={ref} variants={scrollReveal} initial="offscreen" animate={isInView ? 'onscreen' : 'offscreen'} />
```

## Canvas Isolation Pattern
Three.js and canvas 2D animations NEVER appear as JSX/React components.
Use a `useEffect` to call `mount(el)` and return `unmount` as cleanup.
Canvas modules live in `src/animations/canvas/` and export only `mount` and `unmount`.

```tsx
useEffect(() => {
  if (!containerRef.current) return
  mount(containerRef.current)
  return unmount
}, [])
```
