import React from "react";

const days = ["S", "M", "T", "W", "T", "F", "S"];

function getLast7Days(history) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const str = d.toISOString().slice(0, 10);
    return history.includes(str);
  });
}

const MiniHeatmap = ({ history }) => {
  const last7 = getLast7Days(history || []);
  return (
    <div style={{ display: "flex", gap: 2, marginLeft: 8 }}>
      {last7.map((done, i) => (
        <div
          key={i}
          title={days[i]}
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            background: done ? "#38bdf8" : "#ececf1",
            border: "1px solid #d1d5db",
            transition: "background 0.2s",
          }}
        />
      ))}
    </div>
  );
};

export default MiniHeatmap;
