import React, { useState } from 'react';

// Simple ELIZA-like responses
function elizaReply(input) {
  const rules = [
    [/\badd (a )?(todo|task|reminder|habit)\b (.+)/i, (m, _, __, task) => `Task added: "${task.trim()}". You can see it in your list!`],
    [/\b(todo|task|remind|habit)\b/i, "Sure! Would you like to add a new task? Please type your task and I'll add it to your list."],
    [/\bhello\b|\bhi\b|\bhey\b/i, "Hello! How can I help you today?"],
    [/\bhow are you\b/i, "I'm just a bot, but I'm here to help!"],
    [/\bname\b/i, "I'm your Life Hub assistant."],
    [/\bhelp\b|\bwhat can you do\b/i, "I can chat, motivate, and help you organize your life!"],
    [/\bbye\b|\bexit\b|\bsee you\b/i, "Goodbye! Have a productive day!"],
    [/\b(.*)\?$/, "That's an interesting question. What do you think?"],
    [/./, "I'm here to help you manage your tasks. Please describe the task you want to add, or ask me anything else!"]
  ];
  for (const [pattern, reply] of rules) {
    const match = input.match(pattern);
    if (match) return typeof reply === 'function' ? reply(...match) : reply;
  }
  return "I'm not sure I understand, but I'm here to listen!";
}

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setHistory(h => [...h, { user: userMsg, bot: '' }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const botMsg = elizaReply(userMsg);
      setHistory(h => h.map((msg, i) => i === h.length - 1 ? { ...msg, bot: botMsg } : msg));
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      width: 340,
      maxWidth: '90vw',
      background: 'rgba(255,255,255,0.98)',
      borderRadius: 16,
      boxShadow: '0 4px 24px 0 rgba(60,72,100,0.18)',
      zIndex: 99999,
      padding: 0,
      fontFamily: 'Inter,Segoe UI,Arial,sans-serif',
      display: 'flex',
      flexDirection: 'column',
      border: '1.5px solid #ececf1',
    }}>
      <div style={{padding:'12px 18px',fontWeight:700,fontSize:'1.1rem',color:'#6366f1',borderBottom:'1px solid #ececf1'}}>AI ChatBot</div>
      <div style={{flex:1,overflowY:'auto',maxHeight:260,padding:'12px 18px 0 18px'}}>
        {history.length === 0 && <div style={{color:'#aaa',fontSize:'0.98rem'}}>Ask me anything!</div>}
        {history.map((msg, i) => (
          <div key={i}>
            <div style={{color:'#232946',margin:'8px 0 2px 0',fontWeight:600}}>&gt; {msg.user}</div>
            <div style={{color:'#374151',marginBottom:8}}>{msg.bot || (i === history.length-1 && loading ? <span style={{color:'#6366f1'}}>...</span> : null)}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{display:'flex',borderTop:'1px solid #ececf1',padding:'10px 12px 10px 12px',gap:8}}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{flex:1,border:'none',outline:'none',fontSize:'1rem',padding:'8px',borderRadius:8,background:'#f7f7f8'}}
          disabled={loading}
        />
        <button type="submit" style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:700,cursor:'pointer',fontSize:'1rem'}} disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
