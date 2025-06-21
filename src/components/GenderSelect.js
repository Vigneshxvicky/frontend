import React from 'react';

const GenderSelect = ({ setGender, showWalk, walkStep, setWalkStep }) => (
  <div className="gender-select-container">
    <h1 className="gender-title">Welcome to Pinky Todo Princess!</h1>
    <p className="gender-desc">Please select your gender to personalize your experience:</p>
    <div className="gender-btn-group">
      <button className="gender-btn female" onClick={() => { setGender('female'); if (showWalk && walkStep === 0) setWalkStep(1); }}>Female</button>
      <button className="gender-btn male" onClick={() => { setGender('male'); if (showWalk && walkStep === 0) setWalkStep(1); }}>Male</button>
    </div>
  </div>
);

export default GenderSelect;
