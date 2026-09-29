import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  Minimize2, 
  ExternalLink,
  Settings,
  ChevronDown
} from 'lucide-react';
import { BloodDropLogo } from './common/BloodDropLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const DEFAULT_WEBHOOK_URL = 'https://likhitha-2912.app.n8n.cloud/webhook/6fd380e1-6da4-46ed-91b7-71032d149f19/chat';
const TEST_WEBHOOK_URL = 'https://likhitha-2912.app.n8n.cloud/webhook-test/6fd380e1-6da4-46ed-91b7-71032d149f19/chat';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_WEBHOOK_URL);
  const [showConfig, setShowConfig] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [n8nStatus, setN8nStatus] = useState<'ready' | 'offline' | 'checking'>('ready');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hello! I am your BloodConnect Assistant powered by your n8n workflow. I can help answer questions about blood donation requirements, blood group compatibility, hospital coordination, or finding donors. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize unique session ID
  useEffect(() => {
    let savedSession = localStorage.getItem('bloodconnect_chat_session');
    if (!savedSession) {
      savedSession = `bc_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('bloodconnect_chat_session', savedSession);
    }
    setSessionId(savedSession);

    const savedWebhook = localStorage.getItem('bloodconnect_n8n_webhook');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const quickPrompts = [
    'Who can receive O- blood?',
    'How do I register as a donor?',
    'How to submit an emergency blood request?',
    'What are the eligibility requirements for donating?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to n8n chat webhook
      // n8n Chat Trigger typically accepts JSON with chatInput / message & sessionId
      const payload = {
        action: 'sendMessage',
        chatInput: message,
        message: message,
        sessionId: sessionId || 'default-session',
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            'n8n Webhook returned 404. Make sure your workflow is "Active" in n8n (toggle in the top-right of your n8n canvas), or switch to the test webhook URL if testing.'
          );
        }
        throw new Error(`n8n webhook error: HTTP ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let replyText = '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        // Support common n8n Chat response structures:
        // { output: "..." }, { text: "..." }, { response: "..." }, { message: "..." }, or array
        if (typeof data === 'string') {
          replyText = data;
        } else if (data.output) {
          replyText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
        } else if (data.text) {
          replyText = data.text;
        } else if (data.response) {
          replyText = data.response;
        } else if (data.message) {
          replyText = data.message;
        } else if (Array.isArray(data) && data[0]?.output) {
          replyText = data[0].output;
        } else if (Array.isArray(data) && data[0]?.text) {
          replyText = data[0].text;
        } else {
          replyText = JSON.stringify(data);
        }
      } else {
        replyText = await response.text();
      }

      if (!replyText || replyText.trim() === '') {
        replyText = 'Received response from n8n workflow.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setN8nStatus('ready');
    } catch (error: any) {
      console.warn('n8n Webhook call failed:', error);

      // Helpful fallback and explanation for n8n configuration
      const errorDetail = error?.message || 'Could not connect to n8n webhook.';
      
      // Smart local fallback so the assistant remains useful even if the user's n8n workflow isn't active yet:
      let smartFallback = '';
      const lower = message.toLowerCase();
      if (lower.includes('o-') || lower.includes('universal')) {
        smartFallback = '\n\n💡 Quick Info: O- is the universal red cell donor and can be given to all blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-). O- patients can only receive O- blood.';
      } else if (lower.includes('register') || lower.includes('donor')) {
        smartFallback = '\n\n💡 Quick Info: You can register as a voluntary donor by clicking "Become a Donor" or visiting /register-donor.';
      } else if (lower.includes('emergency')) {
        smartFallback = '\n\n💡 Quick Info: For urgent surgical or trauma transfusions, submit directly through the Emergency Request portal at /emergency.';
      }

      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ **n8n Connection Notice**: ${errorDetail}${smartFallback}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMsg]);
      setN8nStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: 'Chat history cleared. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSaveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('bloodconnect_n8n_webhook', url);
    setShowConfig(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-red-700 hover:bg-red-800 text-white shadow-xl hover:shadow-2xl transition-all duration-200 group focus:outline-none focus:ring-4 focus:ring-red-200 select-none animate-in fade-in slide-in-from-bottom-4"
          aria-label="Open BloodConnect n8n Chatbot"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-red-700"></span>
          </div>
          <span className="text-xs font-extrabold tracking-wide hidden sm:inline">
            Chat with Assistant
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[85vh] rounded-3xl bg-white shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-700/80 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-tight text-white">
                    BloodConnect AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-red-950 text-[10px] font-bold text-red-300 border border-red-800">
                    n8n
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${n8nStatus === 'ready' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                  {n8nStatus === 'ready' ? 'Connected to n8n Cloud' : 'Active / Reconnecting'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Webhook Configuration"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear Chat History"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Minimize Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Webhook Configuration Sub-panel */}
          {showConfig && (
            <div className="p-3.5 bg-slate-800 text-white border-b border-slate-700 text-xs space-y-2.5 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-slate-300">n8n Webhook Endpoint:</span>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-slate-400 hover:text-white text-[10px]"
                >
                  Done
                </button>
              </div>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://.../webhook/.../chat"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveWebhook(DEFAULT_WEBHOOK_URL)}
                  className="flex-1 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] font-medium"
                >
                  Production URL
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveWebhook(TEST_WEBHOOK_URL)}
                  className="flex-1 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] font-medium"
                >
                  Webhook-Test URL
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Tip: If n8n returns 404, toggle your workflow to <strong>Active</strong> in the n8n canvas.
              </p>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-red-700 text-white rounded-br-xs'
                      : msg.isError
                      ? 'bg-amber-50 text-amber-950 border border-amber-200/90 rounded-bl-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-red-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl rounded-bl-xs bg-white border border-slate-200 px-4 py-3 shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-3.5 py-2 bg-slate-100/80 border-t border-slate-200/70 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-semibold text-slate-700 hover:text-red-700 hover:border-red-300 transition-colors shrink-0 shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about blood donation, matching..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Non-clinical information assistant</span>
              <span className="font-mono text-[9px] truncate max-w-[130px]">
                {webhookUrl.split('/webhook')[1] ? `.../webhook${webhookUrl.split('/webhook')[1]}` : 'n8n chat'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
