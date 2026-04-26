import { useState, useRef, useEffect } from 'react';
import API from '../services/api';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! 👋 I'm your Smart Health Assistant. Ask me about:\n\n• General health questions\n• Safe OTC medicine guidance\n• Diet & exercise advice\n• Home remedies (Gharelu Upchar)\n\n⚕️ *I'm not a doctor — always consult a professional for medical concerns.*" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/chatbot', {
        message: userMsg.content,
        history: messages.filter(m => m.role !== 'system')
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What's a healthy diet for high BP?",
    "Home remedies for cold and cough",
    "How to lower cholesterol naturally?",
    "Safe painkiller for headache"
  ];

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary-400" /> AI Health Chat
        </h1>
        <p className="text-gray-400 mt-1">Ask health questions — get instant guidance</p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 bg-warning-400/5 border border-warning-400/20 rounded-xl p-3 mb-4 text-warning-400 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0" />
        This chatbot provides general health information only. Not a substitute for professional medical advice.
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-slide-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-primary-500/20' : 'bg-accent-500/20'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-primary-400" /> : <Bot className="w-4 h-4 text-accent-400" />}
            </div>
            <div className={`max-w-[80%] glass-card p-4 !rounded-2xl ${
              msg.role === 'user' ? '!bg-primary-500/10 !border-primary-500/20' : ''
            }`}>
              <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-slide-in">
            <div className="w-8 h-8 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent-400" />
            </div>
            <div className="glass-card p-4 !rounded-2xl">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={chatEnd} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickQuestions.map((q, i) => (
            <button key={i} onClick={() => setInput(q)}
              className="px-3 py-1.5 text-xs glass-card !rounded-full text-gray-300 hover:text-white hover:!bg-primary-500/10 transition-all">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask a health question..."
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
          disabled={loading}
        />
        <button type="submit" disabled={!input.trim() || loading}
          className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
