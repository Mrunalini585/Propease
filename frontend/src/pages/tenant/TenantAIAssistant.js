import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../../services/api';

export default function TenantAIAssistant({ showToast }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I'm your PropEase AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await aiAPI.chat({ message: userMsg });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.data }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
      showToast('Error connecting to AI', '❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>✨ AI Assistant</h2>
          <p style={styles.subtitle}>Ask me anything about your property, rent, or maintenance</p>
        </div>
      </div>

      <div style={styles.chatArea}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.messageWrapper,
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {msg.sender === 'ai' && <div style={styles.avatarAI}>🤖</div>}
            <div style={{
              ...styles.messageBox,
              background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--accent), var(--purple))' : 'var(--bg3)',
              color: msg.sender === 'user' ? '#fff' : 'var(--text)',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{...styles.messageWrapper, justifyContent: 'flex-start'}}>
            <div style={styles.avatarAI}>🤖</div>
            <div style={{...styles.messageBox, background: 'var(--bg3)', color: 'var(--text3)'}}>
              <span className="dot-pulse">Typing...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={handleSend} style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.sendButton} disabled={loading || !input.trim()}>
          {loading ? '⏳' : 'Send'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r3)',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 40px)', // adjust based on dashboard padding
    overflow: 'hidden'
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.02)'
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
    background: 'linear-gradient(135deg, #a8c0ff, #3f2b96)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--text3)'
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  messageWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end'
  },
  avatarAI: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--bg1)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18
  },
  messageBox: {
    padding: '12px 16px',
    borderRadius: '16px',
    maxWidth: '75%',
    fontSize: 14,
    lineHeight: 1.5,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  inputArea: {
    padding: '16px 24px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: '12px',
    background: 'rgba(255,255,255,0.01)'
  },
  input: {
    flex: 1,
    padding: '14px 20px',
    borderRadius: '100px',
    border: '1px solid var(--border)',
    background: 'var(--bg1)',
    color: 'var(--text)',
    outline: 'none',
    fontSize: 14
  },
  sendButton: {
    padding: '0 24px',
    borderRadius: '100px',
    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    transition: '0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
