import React, { useEffect, useState } from 'react';

const ORB_SIZE = 54;

const ScrollFloatingOrb = () => {
  const [top, setTop] = useState(120);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      // Orb moves from 120px to (window.innerHeight - 180) as you scroll
      const min = 120, max = window.innerHeight - 180;
      const percent = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      setTop(min + (max - min) * percent);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      right: 32,
      top: top,
      zIndex: 10000,
      pointerEvents: 'none',
      transition: 'top 0.25s cubic-bezier(.4,0,.2,1)',
    }}>
      <div style={{
        width: ORB_SIZE,
        height: ORB_SIZE,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 60% 40%, #ff61a6 0%, #6366f1 80%)',
        boxShadow: '0 0 32px 8px #ff61a6aa, 0 0 24px 4px #6366f188',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        color: '#fff',
        filter: 'blur(0.2px) brightness(1.15)',
        userSelect: 'none',
        transition: 'box-shadow 0.3s',
      }}>
        <span role="img" aria-label="orb">✨</span>
      </div>
    </div>
  );
};

export default ScrollFloatingOrb;
