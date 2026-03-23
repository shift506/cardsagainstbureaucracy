/**
 * Three.js scene lifecycle — isolated from React tree.
 * Exports only mount/unmount to prevent JSX coupling.
 */
import * as THREE from 'three'

let renderer: THREE.WebGLRenderer | null = null
let animationId: number | null = null

export function mount(el: HTMLElement): void {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshNormalMaterial()
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  camera.position.z = 3

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    cube.rotation.x += 0.005
    cube.rotation.y += 0.005
    renderer?.render(scene, camera)
  }
  animate()
}

export function unmount(): void {
  if (animationId !== null) cancelAnimationFrame(animationId)
  renderer?.dispose()
  renderer = null
  animationId = null
}
