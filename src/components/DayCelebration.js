import React from "react";

const DayCelebration = ({ show }) => {
  if (!show) return null;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
      <div style={{
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle, #38bdf8 0%, #fff0 70%)",
        opacity: 0.25,
        borderRadius: 10,
        animation: "celebrate-fade 1.2s"
      }} />
      <style>{`
        @keyframes celebrate-fade {
          0% { opacity: 0.5; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default DayCelebration;
