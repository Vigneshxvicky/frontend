import React, { useEffect, useRef } from 'react';

const FireworkBg = () => {
  const scrollRef = useRef({ freq: 0.07, brightness: 1.1 });
  const colorRevealed = useRef(false);

  useEffect(() => {
    const canvas = document.getElementById('firework-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let fireworks = [];
    let particles = [];
    let animationFrameId; 

    function randomColor() {
      const colors = [
        '#ff6f91', '#ffb6b9', '#38bdf8', '#2563eb', '#f6ad55', '#d72660',
        '#fff176', '#7c3aed', '#00e6e6', '#ff8c00', '#00ffb3', '#ff61a6'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function revealColor() {
      if (!colorRevealed.current) {
        colorRevealed.current = true;
        document.body.classList.add('color-revealed');
      }
    }

    function Firework() {
      this.x = Math.random() * canvas.width * 0.9 + canvas.width * 0.05;
      this.y = canvas.height;
      this.targetY = 80 + Math.random() * (canvas.height * 0.4);
      this.color = randomColor();
      this.radius = 2 + Math.random() * 2;
      this.speed = 1.5 + Math.random() * 0.5; // Slightly faster than slow version
      this.exploded = false;
      this.sparkle = Math.random() > 0.5;
    }
    Firework.prototype.update = function () {
      if (this.y > this.targetY) {
        this.y -= this.speed;
      } else if (!this.exploded) {
        this.exploded = true;
        revealColor(); // Reveal color on first burst
        for (let i = 0; i < 48; i++) {
          particles.push(new Particle(this.x, this.y, this.color, this.sparkle));
        }
      }
    };
    Firework.prototype.draw = function () {
      ctx.save();
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    function Particle(x, y, color, sparkle) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = 1 + Math.random() * 2.2;
      this.angle = Math.random() * 2 * Math.PI;
      this.speed = 0.8 + Math.random() * 1.5; // Slightly faster
      this.alpha = 1;
      this.decay = 0.007 + Math.random() * 0.012; // Slightly faster
      this.sparkle = sparkle;
    }
    Particle.prototype.update = function () {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= this.decay;
      if (this.sparkle && Math.random() > 0.7) {
        this.radius = 2.5 + Math.random() * 2.5;
      } else {
        this.radius = 1 + Math.random() * 2.2;
      }
    };
    Particle.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    };

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Use scrollRef for frequency
      if (Math.random() < scrollRef.current.freq) {
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

  // Scroll effect: adjust firework frequency and brightness
  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      // Frequency: 0.07 (top) to 0.18 (bottom)
      // Brightness: 1.1 (top) to 1.35 (bottom)
      scrollRef.current.freq = 0.07 + scrollPercent * 0.11;
      scrollRef.current.brightness = 1.1 + scrollPercent * 0.25;
      const canvas = document.getElementById('firework-canvas');
      if (canvas) {
        canvas.style.filter = `blur(0.5px) brightness(${scrollRef.current.brightness})`;
      }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
        zIndex: -1,
        pointerEvents: 'none',
        filter: 'blur(0.5px) brightness(1.1)'
      }}
    />
  );
};

export default FireworkBg;
