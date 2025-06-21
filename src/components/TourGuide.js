import React, { useState } from 'react';

const steps = [
  {
    title: 'Welcome!',
    content: 'Welcome to your innovative Todo App! Let’s take a quick tour.'
  },
  {
    title: 'Choose Your Theme',
    content: 'First, select your gender to personalize the look and feel of your app.'
  },
  {
    title: 'Add Your First Task',
    content: 'Use the input at the top to type your first todo, pick a due date and priority, then click Add.'
  },
  {
    title: 'Manage Tasks',
    content: 'Mark tasks as complete, edit, or delete them. Use filters, search, and sort to organize your list.'
  },
  {
    title: 'Enjoy the Experience!',
    content: 'Enjoy the fireworks, floating blobs, and beautiful design as you stay productive!'
  }
];

const TourGuide = ({ onClose }) => {
  const [step, setStep] = useState(0);

  return (
    <div className="tour-guide-overlay">
      <div className="tour-guide-card">
        <h2>{steps[step].title}</h2>
        <p>{steps[step].content}</p>
        <div className="tour-guide-actions">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="tour-btn">Back</button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="tour-btn">Next</button>
          ) : (
            <button onClick={onClose} className="tour-btn">Finish</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourGuide;
