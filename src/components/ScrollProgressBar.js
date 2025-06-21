import React, { useEffect, useState } from 'react';

const ScrollProgressBar = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScroll(percent);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '6px',
      zIndex: 9999,
      background: 'transparent',
      pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${scroll * 100}%`,
        background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #ff61a6 100%)',
        boxShadow: '0 0 12px 2px #6366f1aa, 0 0 24px 4px #ff61a655',
        borderRadius: '0 8px 8px 0',
        transition: 'width 0.18s cubic-bezier(.4,0,.2,1)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default ScrollProgressBar;
