// ============================================================
// controllers/ai.controller.js
// Handles AI Assistance requests
// ============================================================

// Mock responses for now until a real LLM is connected
const MOCK_START = "Hi there! I'm your PropEase AI Assistant. You can ask me anything about maintenance, payments, or properties.";

exports.handleAiChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // A simple mock AI logic 
    let reply = "I am a simulated AI assistant. To connect a true AI, add your Google Gemini API key to the backend logic!";
    
    const text = message.toLowerCase();
    if (text.includes('rent') || text.includes('pay') || text.includes('payment')) {
      reply = "You can view your rent balance and make payments under the 'Payments' tab in your dashboard. We support card and bank transfers.";
    } else if (text.includes('maintenance') || text.includes('broken') || text.includes('leak') || text.includes('fix')) {
      reply = "If something is broken, please submit a Maintenance Request through the 'Maintenance' tab. Your property manager will see it immediately.";
    } else if (text.includes('hi') || text.includes('hello')) {
      reply = "Hello! How can I assist you with your rental today?";
    } else if (text.includes('rule') || text.includes('pets') || text.includes('guest')) {
      reply = "For specific property rules such as pet policies or guest rules, please refer to the FAQ section or reach out to your owner directly via Messages.";
    }

    // Optional delay to simulate AI typing...
    await new Promise(r => setTimeout(r, 1000));

    res.json({
      success: true,
      data: reply
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
