import React from 'react';

const FeatureCard = ({ image, alt, title, color, description, noDivider }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      maxWidth: 1100,
      minHeight: 140,
      margin: '0 auto',
      gap: 40,
      padding: '24px 0',
      borderBottom: noDivider ? 'none' : '1px solid #e5e7eb',
      background: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      border: 'none',
      transition: 'none',
      cursor: 'default',
      overflow: 'visible',
    }}
  >
    <div
      style={{
        flex: '0 0 180px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={image}
        alt={alt}
        style={{ width: 140, maxWidth: '100%', borderRadius: 12 }}
      />
    </div>
    <div
      style={{
        flex: 1,
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: '2rem',
          color: color || '#6366f1',
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '1.08rem',
          color: '#232946',
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  </div>
);

export default FeatureCard;
