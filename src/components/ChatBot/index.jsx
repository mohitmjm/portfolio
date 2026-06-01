import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { systemPrompt } from './systemPrompt';
import './ChatBot.css';

const QUICK_REPLIES = [
  { text: '✨ HR Portal Overview', isHighlight: true },
  { text: '✨ HR Portal AI Features', isHighlight: true },
  { text: '✨ Voice Assistant & Attrition', isHighlight: true },
  { text: '👥 Resume AI Analyzer', isHighlight: false },
  { text: '👁️ Drowsiness Detector', isHighlight: false },
  { text: '🤖 About AntiGravity', isHighlight: false }
];

const parseLinks = (text) => {
  if (!text) return '';
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    if (part.match(/^https?:\/\//)) {
      const trailingPuncMatch = part.match(/([!.,?)]+)$/);
      let url = part;
      let suffix = '';
      if (trailingPuncMatch) {
        url = part.slice(0, -trailingPuncMatch[0].length);
        suffix = trailingPuncMatch[0];
      }
      return (
        <span key={i}>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#06b6d4', textDecoration: 'underline', fontWeight: 600 }}
          >
            {url}
          </a>
          {suffix}
        </span>
      );
    }
    return part;
  });
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi, I'm Mohit's AI persona! Ask me anything about his skills, projects, or availability. 🚀"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Close tooltip when chatbot is opened
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Helper to handle local fallback queries
  const generateLocalResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('hr') || q.includes('portal') || q.includes('predictive') || q.includes('attrition') || q.includes('turnover') || q.includes('flight risk') || q.includes('voice') || q.includes('burnout') || q.includes('mood') || q.includes('workforce')) {
      if (q.includes('voice') || q.includes('speak') || q.includes('microphone')) {
        return "The Smart HR Portal features a hands-free AI Voice Assistant powered by Gemini API and the Web Speech API. Employees can speak commands naturally like 'What is my leave balance?', 'Show my last payslip', or 'Mark my attendance' to navigate the portal.";
      }
      if (q.includes('turnover') || q.includes('attrition') || q.includes('flight risk') || q.includes('predict')) {
        return "Turnover Prediction in the Smart HR Portal integrates Python machine learning models and Gemini AI to calculate employee flight risk (High/Medium/Low). It flags factors like frequent absences, low appraisals, and salary gaps, and suggests retention recommendations.";
      }
      if (q.includes('mood') || q.includes('burnout') || q.includes('wellbeing') || q.includes('intelligence')) {
        return "The Risk & Mood Intelligence dashboard tracks employee sentiment and flags burnout alerts. It aggregates data from check-in logs, surveys, and chat sentiments to present a department-level mood heatmap and individual wellness trends.";
      }
      if (q.includes('ai') || q.includes('ml') || q.includes('model') || q.includes('feature')) {
        return "The Smart HR Portal includes 4 main AI features:\n1. AI Turnover Prediction: Forecasts employee flight risks.\n2. Risk & Mood Intelligence: Collects sentiment scores and flags burnout alerts.\n3. AI Employee Analysis: Evaluates productivity and generates recommendation scores.\n4. AI Voice Assistant: Hands-free voice command system via Gemini.";
      }
      return "The Smart HR Portal is an advanced HRMS project integrating predictive analytics. It features comprehensive employee workflows, admin tools, and AI turnover/mood models. For a complete interactive walkthrough and live screenshot demo of all 27 modules, visit the Smart HR Portal details page at https://mohitmohatkar.in/smart-hr-portal!";
    }
    
    if (q.includes('resume') || q.includes('parser') || q.includes('nlp')) {
      return "The Resume AI Analyzer parses and grades resumes against specific job descriptions using NLP techniques like TF-IDF and cosine similarity models. It features a React frontend with a Python/Flask backend and provides compatibility scores and automated feedback.";
    }
    
    if (q.includes('diabetes') || q.includes('streamlit') || q.includes('glucose')) {
      return "The Diabetes Prediction App is a machine learning dashboard built with Streamlit and Scikit-Learn. It takes health parameters (glucose levels, BMI, etc.) and uses a classification model to predict diabetes risk in real-time.";
    }
    
    if (q.includes('drowsiness') || q.includes('driver') || q.includes('eye') || q.includes('ear') || q.includes('opencv') || q.includes('mediapipe')) {
      return "The Drowsiness Detector calculates the Eye Aspect Ratio (EAR) using OpenCV and MediaPipe to detect driver drowsiness in real-time. It triggers alerts and is built in Python using Streamlit.";
    }
    
    if (q.includes('antigravity') || q.includes('anti-gravity') || q.includes('deepmind') || q.includes('agent')) {
      return "AntiGravity is Google DeepMind's agentic AI coding assistant that executes coding tasks autonomously. Mohit utilized AntiGravity as an advanced AI pair programmer to build, polish, and verify features on this website! It showcase how Mohit integrates cutting-edge AI agent technologies directly into his development workflow.";
    }
    
    if (q.includes('hire') || q.includes('why should') || q.includes('collaborate')) {
      return "Mohit doesn't just write code — he builds solutions that are polished and reliable. With a strong foundation in both Full Stack and AI/ML, he brings end-to-end thinking to every project. Check the contact section to start a conversation!";
    }
    
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('message') || q.includes('social')) {
      return "You can reach Mohit directly through the contact form at the bottom of the page, or check out his GitHub and LinkedIn profiles linked in the footer. Let's connect!";
    }
    
    if (q.includes('skills') || q.includes('tech') || q.includes('languages') || q.includes('frameworks') || q.includes('react') || q.includes('python')) {
      return "Mohit works with React, JavaScript, HTML/CSS, and Next.js on the frontend. For backend and AI/ML, he uses Python (Flask, Streamlit, Scikit-Learn, OpenCV, MediaPipe), Node.js, and MongoDB. Check the skills section for details!";
    }
    
    return "Mohit will get back to you — hit the contact section! (Note: Connect the Gemini API by setting VITE_GEMINI_API_KEY in your environment to unlock my full live AI persona!)";
  };

  // Submit message to Gemini API or Fallback
  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
      try {
        // Format history for Gemini (filtering out the initial bot welcome message)
        const formattedHistory = newMessages.slice(1).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: formattedHistory,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              }
            })
          }
        );

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "Mohit will get back to you — hit the contact section!";
        
        setMessages(prev => [...prev, { sender: 'bot', text: botReply.trim() }]);
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        // Fallback to local response
        const fallbackReply = generateLocalResponse(textToSend);
        setMessages(prev => [...prev, { sender: 'bot', text: fallbackReply }]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Simulate network delay for natural feel
      setTimeout(() => {
        const fallbackReply = generateLocalResponse(textToSend);
        setMessages(prev => [...prev, { sender: 'bot', text: fallbackReply }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <>
      {/* Floating launcher container with bobbing animation */}
      <div className={`chatbot-launcher-container ${isOpen ? 'open' : ''}`}>
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              className="chatbot-tooltip"
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              <span>Chat with my AI! 🤖</span>
              <button 
                type="button"
                className="chatbot-tooltip-close" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setShowTooltip(false); 
                }}
                aria-label="Dismiss tooltip"
              >
                <FiX />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <>
            <div className="chatbot-launcher-ping ping-1" />
            <div className="chatbot-launcher-ping ping-2" />
          </>
        )}

        <button 
          className="chatbot-launcher" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
        >
          {isOpen ? <FiX /> : <FiMessageSquare />}
          {!isOpen && <span className="chatbot-launcher-pulse" />}
        </button>
      </div>

      {/* Chat window with Framer Motion animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">🤖</div>
                <div className="chatbot-title-container">
                  <span className="chatbot-title">Mohit's AI Persona</span>
                  <div className="chatbot-status">
                    <span className="chatbot-status-dot" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button 
                className="chatbot-close-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Close Chatbot"
              >
                <FiX />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`chatbot-msg-wrapper ${msg.sender}`}
                >
                  <div className="chatbot-bubble" style={{ whiteSpace: 'pre-line' }}>
                    {parseLinks(msg.text)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chatbot-msg-wrapper bot">
                  <div className="chatbot-bubble typing">
                    <span className="chatbot-typing-dot" />
                    <span className="chatbot-typing-dot" />
                    <span className="chatbot-typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="chatbot-quick-replies">
              {QUICK_REPLIES.map((reply, i) => (
                <button
                  key={i}
                  className={`chatbot-chip ${reply.isHighlight ? 'highlight' : ''}`}
                  onClick={() => handleSendMessage(reply.text.replace(/^[✨👥👁️💡🤖]\s*/, ''))}
                  disabled={isTyping}
                >
                  {reply.text}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form className="chatbot-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="chatbot-input"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                className="chatbot-send-btn"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send Message"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
