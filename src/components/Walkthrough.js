import React, { useEffect, useRef } from 'react';

const steps = [
  {
    selector: '.gender-btn-group',
    title: 'Choose Your Theme',
    content: 'Start by selecting your gender to personalize your experience.'
  },
  {
    selector: '.todo-input',
    title: 'Add Your First Task',
    content: 'Type your first todo here!'
  },
  {
    selector: '.add-btn',
    title: 'Add It!',
    content: 'Click the Add button to create your first task.'
  },
  {
    selector: '.todo-list',
    title: 'Manage Tasks',
    content: 'Here you can see, complete, edit, or delete your todos.'
  }
];

const Walkthrough = ({ step, onNext, onClose, isLast, visible }) => {
  const ref = useRef();
  useEffect(() => {
    if (!visible) return;
    const el = document.querySelector(steps[step].selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('walkthrough-highlight');
    }
    return () => {
      if (el) el.classList.remove('walkthrough-highlight');
    };
  }, [step, visible]);

  if (!visible) return null;
  const el = document.querySelector(steps[step].selector);
  let rect = el ? el.getBoundingClientRect() : { top: 100, left: 100, width: 200 };
  let style = {
    position: 'fixed',
    top: rect.top + window.scrollY - 80,
    left: rect.left + window.scrollX + rect.width / 2 - 160,
    zIndex: 10010,
    width: 320,
    maxWidth: '90vw',
    pointerEvents: 'auto',
  };
  return (
    <div className="walkthrough-overlay">
      <div className="walkthrough-card" style={style} ref={ref}>
        <h2>{steps[step].title}</h2>
        <p>{steps[step].content}</p>
        <div className="walkthrough-actions">
          <button onClick={onClose} className="tour-btn">Exit</button>
          {!isLast && <button onClick={onNext} className="tour-btn">Next</button>}
          {isLast && <button onClick={onClose} className="tour-btn">Finish</button>}
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
