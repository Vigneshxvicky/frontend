import React from "react";
import Confetti from "react-confetti";

const ConfettiCelebration = ({ run }) => {
  if (!run) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 2000 }}>
      <Confetti numberOfPieces={180} recycle={false} gravity={0.25} />
    </div>
  );
};

export default ConfettiCelebration;
