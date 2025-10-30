import * as THREE from './three.module.js';
import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';

// Create a fixed full-screen background canvas
const canvas = document.createElement('canvas');
canvas.id = 'model-background';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'none';
document.body.prepend(canvas);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121417); // greish background

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
camera.position.set(0, 0.5, 6);

// Soft lighting for pleasant shading
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
const dir1 = new THREE.DirectionalLight(0xffffff, 0.8);
dir1.position.set(2, 3, 4);
const dir2 = new THREE.DirectionalLight(0xffffff, 0.4);
dir2.position.set(-3, -2, -2);
scene.add(ambient, dir1, dir2);

let model;
const loader = new GLTFLoader();
loader.load('assets/models/base_basic_shaded.glb', (gltf) => {
  model = gltf.scene;
  model.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false;
      o.receiveShadow = false;
    }
  });
  // Center and scale model to fit view
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 3.5 / maxDim;
  model.scale.setScalar(scale);
  box.setFromObject(model);
  const center = new THREE.Vector3();
  box.getCenter(center);
  model.position.sub(center); // center at origin
  model.position.y -= 0.2; // slight offset down
  scene.add(model);
}, undefined, (err) => {
  console.error('GLB load error', err);
});

// --- Particles backdrop ---
const particleCount = 1200;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const speeds = new Float32Array(particleCount);
for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 60;   // x
  positions[i3 + 1] = (Math.random() - 0.5) * 35;   // y
  positions[i3 + 2] = -Math.random() * 80 - 10;     // z behind model
  speeds[i] = 0.02 + Math.random() * 0.08;          // per-particle drift
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMat = new THREE.PointsMaterial({
  color: 0x7ea6ff,
  size: 0.06,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeo, particleMat);
particles.renderOrder = -1; // ensure it stays in the back
scene.add(particles);

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function animate(t) {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.0025; // slow, subtle rotation
  }
  // animate particles: gentle horizontal drift + twinkle in shader-less way
  const pos = particleGeo.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    pos[i3 + 0] += Math.sin((t * 0.0005) + i) * 0.002; // x drift
    pos[i3 + 1] += Math.cos((t * 0.0004) + i) * 0.0015; // y drift
    // slow parallax towards camera then reset
    pos[i3 + 2] += speeds[i] * 0.01;
    if (pos[i3 + 2] > -8) {
      pos[i3 + 2] = -Math.random() * 80 - 10;
    }
  }
  particleGeo.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
animate(0);


