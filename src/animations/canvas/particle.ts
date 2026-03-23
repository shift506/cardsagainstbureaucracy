/**
 * Particle system — canvas 2D, isolated lifecycle.
 * Exports only mount/unmount.
 */
interface Particle {
  x: number; y: number; vx: number; vy: number; alpha: number
}

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animId: number | null = null

export function mount(el: HTMLElement): void {
  const canvas = document.createElement('canvas')
  canvas.width = el.clientWidth
  canvas.height = el.clientHeight
  el.appendChild(canvas)
  ctx = canvas.getContext('2d')

  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    alpha: Math.random(),
  }))

  const loop = () => {
    animId = requestAnimationFrame(loop)
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      ctx.beginPath()
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(100,200,255,${p.alpha})`
      ctx.fill()
    }
  }
  loop()
}

export function unmount(): void {
  if (animId !== null) cancelAnimationFrame(animId)
  ctx = null
  particles = []
  animId = null
}
