// import { fragmentShader } from './flame_frag.js'
// import { fragmentShader } from './simple_frag.js'
// import { fragmentShader } from './holes_frag.js'
// import { fragmentShader } from './holes-4D_frag.js'
// import { fragmentShader } from './holes-blend-seam_frag.js'
import { fragmentShader } from './holes-pos_frag.js'
// import { vertexShader } from './squash_vert.js'
import { vertexShader } from './squash-grow_vert.js'

let mouseX = 0
let mouseY = 0

const targetRotation = new THREE.Vector2()

function onMouseMove(event) {
    let clientX, clientY

    if (event.type === 'mousemove') {
        clientX = event.clientX
        clientY = event.clientY
    } else if (event.type === 'touchmove') {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
    }

    mouseX = (clientX / window.innerWidth) * 2 - 1
    mouseY = (clientY / window.innerHeight) * 2 + 1

    targetRotation.x = mouseY * Math.PI
    targetRotation.y = mouseX * Math.PI
}

window.addEventListener('mousemove', onMouseMove, false)
window.addEventListener('touchstart', onMouseMove, false)
window.addEventListener('touchmove', onMouseMove, false)

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    uniforms: {
        time: { value: 0.0 },
    },
})

const geometry = new THREE.SphereGeometry(2, 32, 32)
const mesh = new THREE.Mesh(geometry, shaderMaterial)

const scene = new THREE.Scene()
scene.add(mesh)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const rotationSpeed = 0.05

const animate = function () {
    requestAnimationFrame(animate)

    // shaderMaterial.uniforms.time.value += 0.01
    mesh.material.uniforms.time.value = performance.now() / 1000

    // Lerp the sphere's rotation towards the target rotation
    mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * rotationSpeed
    mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * rotationSpeed

    renderer.render(scene, camera)
}

animate()
