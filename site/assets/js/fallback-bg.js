// Lightweight canvas particles as a visual fallback when WebGL/GLB fails
(function () {
  if (document.getElementById('model-background') || document.getElementById('fallback-bg')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'fallback-bg';
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: '0', pointerEvents: 'none'
  });
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const NUM = 160;
  const particles = Array.from({ length: NUM }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.6 + Math.random() * 1.8,
    a: Math.random() * Math.PI * 2,
    s: 0.2 + Math.random() * 0.8
  }));

  function tick() {
    ctx.clearRect(0, 0, w, h);
    // subtle greish background wash
    const grd = ctx.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#14171b');
    grd.addColorStop(1, '#0e1114');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    for (const p of particles) {
      p.x += Math.cos(p.a) * p.s;
      p.y += Math.sin(p.a) * (p.s * 0.6);
      p.a += 0.003;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(126,166,255,0.35)';
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();


