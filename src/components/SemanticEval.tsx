'use client';

import * as React from 'react';
import { useMDXContext } from './MDXContext';
import { useProgress } from '@/hooks/useProgress';
import { Brain, Loader2, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { MathRenderer } from '@/components/MathRenderer';

interface SemanticEvalProps {
  prompt: string;
}

interface EvalResponse {
  passed: boolean;
  feedback: string;
}

export function SemanticEval({ prompt }: SemanticEvalProps) {
  const { courseId, unitId, topicId, content } = useMDXContext();
  const { markCompleted, getTopicProgress } = useProgress();

  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<EvalResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Sync state if already completed in localStorage
  React.useEffect(() => {
    const topicProgress = getTopicProgress(courseId, unitId, topicId);
    // If the topic is completed, we don't force load a result, but they can see it's completed
  }, [courseId, unitId, topicId, getTopicProgress]);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: value,
          context: content,
          mode: 'eval',
          promptObjective: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('La evaluación por IA falló. Verifica que la API Key de Gemini esté configurada.');
      }

      const data = await response.json();
      
      let parsedResult: EvalResponse;
      try {
        // Try parsing JSON if next route sends structured JSON
        if (typeof data.message === 'string') {
          parsedResult = JSON.parse(data.message);
        } else {
          parsedResult = data.message;
        }
      } catch (e) {
        // Fallback if the AI returned non-json string for some reason
        parsedResult = {
          passed: data.passed !== undefined ? data.passed : false,
          feedback: typeof data.message === 'string' ? data.message : 'No se pudo analizar el formato.',
        };
      }

      setResult(parsedResult);
      
      if (parsedResult.passed) {
        markCompleted(courseId, unitId, topicId, true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de red al intentar conectar con el tutor de IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-xl">
      <div className="flex items-start space-x-3 mb-4">
        <Brain className="h-6 w-6 text-primary-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Evaluación Conceptual de IA
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            <MathRenderer text={prompt} />
          </div>
        </div>
      </div>

      <form onSubmit={handleEvaluate} className="space-y-4">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          rows={5}
          placeholder="Escribe tu justificación paso a paso usando lógica formal. Puedes mencionar cuantificadores y contradicciones..."
          className="w-full p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 text-sm font-sans"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="flex items-center space-x-2 py-2.5 px-5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-semibold rounded-xl transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Evaluando con Gemini...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Enviar para Evaluación</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 border border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 rounded-xl text-sm">
          {error}
        </div>
      )}

      {result && (
        <div
          className={`mt-6 p-5 border rounded-xl transition-all duration-300 ${
            result.passed
              ? 'bg-emerald-50/30 border-emerald-200/50 text-emerald-950 dark:bg-emerald-950/10 dark:border-emerald-900/50 dark:text-emerald-300'
              : 'bg-amber-50/30 border-amber-200/50 text-amber-950 dark:bg-amber-950/10 dark:border-amber-900/50 dark:text-amber-300'
          }`}
        >
          <div className="flex items-start space-x-3">
            {result.passed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-base mb-1">
                {result.passed ? 'Demostración Aprobada' : 'Demostración con Errores Lógicos'}
              </h4>
              <div className="text-sm opacity-90 leading-relaxed">
                <MathRenderer text={result.feedback} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
