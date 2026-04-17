// src/components/common/Toast.js

import React, { useEffect } from 'react';

// Usage: <Toast message="Saved!" icon="✅" show={true} onClose={() => setShow(false)} />
export default function Toast({ message, icon = '✅', show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      <span style={{fontSize: 18}}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}
