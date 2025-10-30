/* Interactive spheres background for 147x402 */
(function () {
  const canvasId = 'balls-canvas';
  const existing = document.getElementById(canvasId);
  if (existing) return;

  const canvas = document.createElement('canvas');
  canvas.id = canvasId;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  // Draw above page background but below any fixed overlays
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'auto';
  document.body.appendChild(canvas);

  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(0, 0, 60);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(1, 1, 1);
  scene.add(ambient, dir);

  const spheres = [];
  const sphereGeo = new THREE.SphereGeometry(3, 32, 32);
  for (let i = 0; i < 40; i++) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.3, roughness: 0.4 });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 70,
      (Math.random() * -80) - 10
    );
    mesh.userData.baseColor = mat.color.clone();
    scene.add(mesh);
    spheres.push(mesh);
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }
  function onClick() {
    if (!hovered) return;
    hovered.material.color.set(0x66a3ff);
    hovered.scale.setScalar(1.3);
    setTimeout(() => {
      hovered.material.color.copy(hovered.userData.baseColor);
      hovered.scale.setScalar(1);
    }, 400);
  }
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('click', onClick);

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
    spheres.forEach((s, i) => {
      s.position.y += Math.sin((t * 0.0005) + i) * 0.02;
      s.rotation.y += 0.002;
    });

    // raycast
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(spheres);
    const next = intersects.length ? intersects[0].object : null;
    if (hovered !== next) {
      if (hovered) hovered.material.emissive && hovered.material.emissive.setHex(0x000000);
      hovered = next;
      if (hovered) {
        if (!hovered.material.emissive) hovered.material.emissive = new THREE.Color(0x000000);
        hovered.material.emissive.setHex(0x222222);
      }
    }

    renderer.render(scene, camera);
  }
  animate(0);
})();


