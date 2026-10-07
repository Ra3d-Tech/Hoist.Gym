window.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Menu Toggle
  const toggleBtn = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // 2. FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('active');
    });
  });

  // 3. تشغيل أنيميشن الرزعة (Intro Slam)
  const introOverlay = document.getElementById('introOverlay');
  const canvas = document.getElementById('dustCanvas');
  const wordHoist = document.getElementById('wordHoist');
  const wordGym = document.getElementById('wordGym');
  const tagline = document.getElementById('tagline');
  const body = document.getElementById('body');

  if (introOverlay && canvas && wordHoist && wordGym) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let shockwaves = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    class DustParticle {
      constructor(x, y, isDebris = false) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = isDebris ? (Math.random() * 12 + 6) : (Math.random() * 6 + 2);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed * 0.5 - (Math.random() * 3);
        this.size = isDebris ? (Math.random() * 4 + 2) : (Math.random() * 22 + 10);
        this.alpha = 1;
        this.decay = Math.random() * 0.025 + 0.015;
        this.isDebris = isDebris;
        const colors = ['#333', '#555', '#777', '#FFE600', '#222'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15;
        this.vx *= 0.94;
        this.alpha -= this.decay;
        if (!this.isDebris) this.size += 0.35;
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Shockwave {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.alpha = 0.9;
      }
      update() {
        this.radius += 16;
        this.alpha -= 0.04;
      }
      draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 230, 0, ${this.alpha})`;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      shockwaves.forEach((w, i) => {
        w.update();
        w.draw(ctx);
        if (w.alpha <= 0) shockwaves.splice(i, 1);
      });
      particles.forEach((p, i) => {
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) particles.splice(i, 1);
      });
      requestAnimationFrame(animate);
    }
    animate();

    function triggerImpact(el) {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.bottom;
      body.classList.remove('shake');
      void body.offsetWidth;
      body.classList.add('shake');
      shockwaves.push(new Shockwave(x, y));
      for (let i = 0; i < 50; i++) particles.push(new DustParticle(x, y, false));
      for (let i = 0; i < 25; i++) particles.push(new DustParticle(x, y, true));
    }

    setTimeout(() => {
      wordHoist.classList.add('slammed');
      triggerImpact(wordHoist);
      setTimeout(() => {
        wordGym.classList.add('slammed');
        triggerImpact(wordGym);
        setTimeout(() => {
          tagline.classList.add('show');
          setTimeout(() => {
            introOverlay.classList.add('hide');
          }, 1100);
        }, 300);
      }, 450);
    }, 250);
  }
});