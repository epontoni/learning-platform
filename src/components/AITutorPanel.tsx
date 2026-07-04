'use client';

import * as React from 'react';
import { Send, Loader2, Sparkles, BookOpen, MessageSquare, Info } from 'lucide-react';
import { MathRenderer } from '@/components/MathRenderer';
import { useMDXContext } from '@/components/MDXContext';

interface Message {
  role: 'user' | 'model';
  message: string;
}

interface AITutorPanelProps {
  contextContent: string;
}

export function AITutorPanel({ contextContent }: AITutorPanelProps) {
  const { courseId, unitId, topicId } = useMDXContext();
  const storageKey = `sigmamath-chat-history/${courseId}/${unitId}/${topicId}`;

  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'model',
      message: '¡Hola! Soy tu tutor matemático. ¿Qué tema o demostración de esta unidad te gustaría analizar juntos?',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<'socratic' | 'theoretic'>('socratic');
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Load chat history from localStorage when topic changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setMessages(JSON.parse(stored));
        } else {
          setMessages([
            {
              role: 'model',
              message: '¡Hola! Soy tu tutor matemático. ¿Qué tema o demostración de esta unidad te gustaría analizar juntos?',
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    }
  }, [courseId, unitId, topicId, storageKey]);

  const saveChatHistory = (newMessages: Message[]) => {
    setMessages(newMessages);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newMessages));
      } catch (err) {
        console.error('Failed to save chat history:', err);
      }
    }
  };

  // Auto-scroll to bottom of chat
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages: Message[] = [...messages, { role: 'user', message: userMessage }];
    saveChatHistory(updatedMessages);
    setLoading(true);

    // Prepare history payload for API
    const historyPayload = messages.slice(1).map(m => ({
      role: m.role,
      parts: [{ text: m.message }]
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: contextContent,
          history: historyPayload,
          mode: mode,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo conectar con el tutor de IA.');
      }

      const data = await response.json();
      
      let reply = data.message;
      if (data.error) {
        reply = `Error: ${data.error}`;
      }

      saveChatHistory([...updatedMessages, { role: 'model', message: reply }]);
    } catch (err: any) {
      console.error(err);
      saveChatHistory([
        ...updatedMessages,
        {
          role: 'model',
          message: 'Lo siento, ocurrió un error de comunicación. Verifica tu conexión de red o la API Key de Gemini.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary-500" />
          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Tutor IA Matemático
          </span>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
          <button
            onClick={() => setMode('socratic')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'socratic'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Socrático
          </button>
          <button
            onClick={() => setMode('theoretic')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'theoretic'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Teórico
          </button>
        </div>
      </div>

      {/* Mode explanation alert */}
      <div className="px-4 py-2 bg-primary-50/40 dark:bg-primary-950/10 border-b border-slate-200/50 dark:border-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
        <Info className="h-3.5 w-3.5 text-primary-500 shrink-0" />
        <span>
          {mode === 'socratic'
            ? 'Modo Socrático: El tutor te guiará con preguntas estratégicas sin dar respuestas directas.'
            : 'Modo Teórico: El tutor responderá basándose estrictamente en el texto de esta lección.'}
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 lg:min-h-[300px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] ${
              m.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div
              className={`p-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              <MathRenderer text={m.message} />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 font-medium">
              {m.role === 'user' ? 'Tú' : 'Tutor IA'}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-xs pl-1">
            <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
            <span>El tutor está pensando...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Escribe tu duda o paso lógico aquí..."
          className="flex-1 p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white rounded-xl transition-all duration-200"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
