// src/pages/tenant/TenantFAQ.js

import React, { useState } from 'react';

const FAQS = [
  {
    question: "How do I book a property?",
    answer: "Navigate to the 'All Properties' tab from your dashboard. Find an available property you wish to view, and click the 'Book Property' button. You'll be prompted to select a payment method (UPI, Netbanking) to pay your first month's rent along with a security deposit."
  },
  {
    question: "How do I communicate with property owners?",
    answer: "Go to the 'Messages' tab on your dashboard. From there, you will see a list of all active property owners. Click on any owner's name to directly start a conversation with them. You do not need to be assigned to their property first to send a message."
  },
  {
    question: "How can I raise a maintenance request?",
    answer: "If you have booked a property and have an active tenancy, go to the 'Maintenance' tab. Click 'Raise Request', describe your issue (e.g., plumbing, electrical), and it will automatically notify your property owner."
  },
  {
    question: "How does the rent payment process work?",
    answer: "Under the 'Payments' tab, you can view your monthly rental invoice. Currently, only manual recording of payments is natively supported (unless configured with automated UPI via Netbanking by the admin). Make your transaction and the system will automatically reconcile the status to 'paid'."
  },
  {
    question: "What happens if I cancel a booking?",
    answer: "Booking cancellations are subject to the property owner's discretion. Please reach out to your property owner via the 'Messages' tab as soon as possible to request a deposit refund."
  }
];

export default function TenantFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-subtitle">Find answers to common questions about your tenancy</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 800, margin: '0 auto', gap: 12, display: 'flex', flexDirection: 'column' }}>
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              style={{
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: isOpen ? 'rgba(108,143,255,0.05)' : 'var(--bg2)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                onClick={() => toggleFAQ(index)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 15,
                  color: isOpen ? 'var(--accent)' : 'var(--text)'
                }}
              >
                {faq.question}
                <span style={{ fontSize: 18, transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </div>
              
              {isOpen && (
                <div style={{ padding: '0 20px 16px', color: 'var(--text3)', fontSize: 14, lineHeight: 1.6 }}>
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
