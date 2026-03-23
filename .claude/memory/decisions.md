# Architecture Decisions

## Why Framer Motion over CSS animations
Framer Motion animations are composited by default (transform + opacity), avoiding layout
recalculations. React tree integration via `m.*` components enables declarative variant
composition and AnimatePresence exit animations that pure CSS cannot handle cleanly.

## Why GSAP for scroll sequences
GSAP ScrollTrigger provides fine-grained timeline control (scrub, pin, snap) that Framer
Motion's useInView cannot replicate. GSAP is battle-tested for complex scroll-linked sequences
with > 10 synchronized elements.

## Why Zustand over Context for animation state
React Context causes full subtree re-renders on every state change. Zustand's selector-based
subscriptions mean only components that read `progress` re-render on progress updates —
critical for 60fps animation loops that update state on every frame.

## Why LazyMotion bundle
LazyMotion with domAnimation (16kb) instead of full motion (34kb) keeps the main chunk lean.
Three.js and GSAP are split into separate chunks loaded on demand.
