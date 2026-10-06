import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  X,
  Send,
  ShieldCheck,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  ChevronDown,
} from 'lucide-react';
import { chatbotService } from '@/services/chatbotService';
import { ChatMessage, ChatbotSourceCitation } from '@/types';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

const DEFAULT_PROMPTS = [
  'Salary slip nahi hai to kya kare?',
  'What documents are required for VIT Bhopal loan?',
  'Can hostel and laptop expenses be included?',
  'Is collateral mandatory under 7.5 Lakhs?',
];

export const AskEdu4LoanChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [animationClass, setAnimationClass] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content:
        'Hello! I am **Ask EDU4LOAN**, your source-based education loan assistant. I answer questions strictly using official bank circulars, IBA guidelines, and VIT Bhopal procedures. How can I help you today?',
      citations: [
        {
          title: 'IBA Model Educational Loan Scheme & RBI Circulars',
          source: 'Indian Banks Association',
          sourceUrl: 'https://www.iba.org.in',
          lastVerified: '2026-03-01',
          status: 'verified',
        },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: DEFAULT_PROMPTS,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
    }
  }, [messages, isOpen]);

  // Robot animation and tooltip logic
  useEffect(() => {
    if (isOpen) return;

    // Show tooltip initially after 2s
    const initialTooltip = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 2000);

    // Show tooltip every 12 seconds for 3 seconds
    const tooltipInterval = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 12000);

    // Random robot animations every 3.5 seconds
    const animations = [
      '-rotate-12',
      'rotate-12',
      'scale-110',
      'scale-90 -translate-y-1',
      '-rotate-6 scale-110',
      'rotate-6 scale-110',
      '-translate-x-1 rotate-3',
      'translate-x-1 -rotate-3',
    ];

    const animationInterval = setInterval(() => {
      const randomAnim = animations[Math.floor(Math.random() * animations.length)];
      setAnimationClass(randomAnim);
      
      // Return to normal quickly
      setTimeout(() => setAnimationClass(''), 500);
    }, 3500);

    return () => {
      clearTimeout(initialTooltip);
      clearInterval(tooltipInterval);
      clearInterval(animationInterval);
    };
  }, [isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const response = await chatbotService.ask(textToSend.trim());

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: response.answer,
        citations: response.citations,
        suggestedPrompts: response.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        content:
          'We encountered an issue communicating with the verified knowledge engine. Please try again or refer to the Practical Help section.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        content:
          'Conversation cleared. Ask any question regarding loan interest rates, documents, collateral, or co-borrower rules.',
        suggestedPrompts: DEFAULT_PROMPTS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="relative flex flex-col items-end">
          {/* Periodic Ask Tooltip */}
          {showTooltip && (
            <div className="absolute -top-12 right-1 bg-brand-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-brand-800 animate-in fade-in zoom-in duration-200">
              Ask?
              {/* Tooltip triangle */}
              <div className="absolute -bottom-1 right-5 w-2.5 h-2.5 bg-brand-900 border-r border-b border-brand-800 rotate-45" />
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="flex items-center justify-center h-14 w-14 bg-brand-900 hover:bg-brand-950 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 border border-brand-700/50 group hover:scale-105"
            aria-label="Open Ask Edu4Loan Chat"
          >
            <Bot className={`h-6 w-6 text-blue-100 transition-all duration-200 ${animationClass}`} />
          </button>
        </div>
      )}

      {/* Slide-over / Modal Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-brand-900 text-white p-3.5 flex items-center justify-between border-b border-brand-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-brand-800 flex items-center justify-center border border-brand-700">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold leading-tight">Ask EDU4LOAN</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-medium border border-emerald-500/30">
                    Source-Based
                  </span>
                </div>
                <p className="text-[11px] text-blue-200">Factual Financial Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="text-blue-200 hover:text-white p-1.5 rounded-lg hover:bg-brand-800 transition-colors"
                title="Clear Chat History"
                aria-label="Clear Chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white p-1.5 rounded-lg hover:bg-brand-800 transition-colors"
                title="Close Chat"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Strict Impartiality Micro-Notice */}
          <div className="bg-blue-50/90 border-b border-blue-200/60 px-3 py-1.5 text-[10px] text-blue-900 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-700 shrink-0" />
            <span className="truncate">
              Zero hallucination policy: Answers cite regulatory circulars directly.
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-brand-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 space-y-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-900 text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-line text-xs font-normal">
                    {msg.content}
                  </div>

                  {/* Citations if available */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Verified Sources:
                      </span>
                      {msg.citations.map((cite, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center justify-between text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100"
                        >
                          <span className="text-slate-700 font-medium truncate max-w-[200px]">
                            {cite.title}
                          </span>
                          {cite.sourceUrl ? (
                            <a
                              href={cite.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-700 hover:underline inline-flex items-center gap-0.5 shrink-0 ml-1 font-semibold"
                            >
                              <span>Circular</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Verified</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow-up Prompts */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="pt-2 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Suggested Follow-ups:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedPrompts.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSend(prompt)}
                            className="text-[11px] text-left px-2 py-1 rounded bg-blue-50 text-brand-900 border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[9px] block text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="h-6 w-6 rounded-full bg-brand-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-start">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-brand-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-xs text-xs text-slate-500 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-brand-700 animate-ping" />
                  <span>Consulting verified regulatory sources...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar (when empty or initial) */}
          {messages.length === 1 && (
            <div className="p-2 border-t border-slate-100 bg-white flex flex-wrap gap-1">
              {DEFAULT_PROMPTS.slice(0, 2).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors truncate max-w-full"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about salary slips, collateral, or rules..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-slate-50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-brand-900 text-white rounded-xl hover:bg-brand-950 disabled:opacity-50 transition-colors shrink-0"
                aria-label="Send Message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
