import React from 'react';

export default function ScrollRevealSection({ children, className = '', aos = 'fade-up', ...props }) {
  return (
    <section
      data-aos={aos}
      className={`scroll-reveal-section ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
