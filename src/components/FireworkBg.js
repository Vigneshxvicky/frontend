import React, { useEffect } from 'react';

const FireworkBg = () => {
  useEffect(() => {
    const canvas = document.getElementById('firework-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let fireworks = [];
    let particles = [];
    let animationFrameId;

    function randomColor() {
      const colors = ['#ff6f91', '#ffb6b9', '#38bdf8', '#2563eb', '#f6ad55', '#d72660'];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function Firework() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = 80 + Math.random() * (canvas.height * 0.4);
      this.color = randomColor();
      this.radius = 2 + Math.random() * 2;
      this.speed = 3 + Math.random() * 2;
      this.exploded = false;
    }
    Firework.prototype.update = function () {
      if (this.y > this.targetY) {
        this.y -= this.speed;
      } else if (!this.exploded) {
        this.exploded = true;
        for (let i = 0; i < 32; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    };
    Firework.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    };

    function Particle(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = 1 + Math.random() * 1.5;
      this.angle = Math.random() * 2 * Math.PI;
      this.speed = 1 + Math.random() * 3;
      this.alpha = 1;
      this.decay = 0.01 + Math.random() * 0.02;
    }
    Particle.prototype.update = function () {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= this.decay;
    };
    Particle.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    };

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.04) {
        fireworks.push(new Firework());
      }
      fireworks.forEach((fw, i) => {
        fw.update();
        fw.draw();
        if (fw.exploded) fireworks.splice(i, 1);
      });
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(i, 1);
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="firework-canvas"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default FireworkBg;
