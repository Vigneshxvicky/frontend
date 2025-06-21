import React from "react";

const emojiList = [
  "💧", "📖", "🏃‍♂️", "🧘‍♀️", "🍎", "🛏️", "🦷", "☀️", "🌙", "📝", "🎨", "🎵", "💪", "🚴", "🥗", "🧹", "🧑‍💻", "🧑‍🎓", "🧑‍🍳"
];

const HabitIconPicker = ({ value, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
    {emojiList.map((emoji) => (
      <button
        key={emoji}
        onClick={() => onChange(emoji)}
        style={{
          fontSize: 22,
          background: value === emoji ? "#6366f1" : "#fff",
          color: value === emoji ? "#fff" : "#232946",
          border: value === emoji ? "2px solid #6366f1" : "1.5px solid #ececf1",
          borderRadius: 8,
          padding: "6px 10px",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s, border 0.2s",
        }}
      >
        {emoji}
      </button>
    ))}
  </div>
);

export default HabitIconPicker;
