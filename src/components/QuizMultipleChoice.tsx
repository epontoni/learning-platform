'use client';

import * as React from 'react';
import { useMDXContext } from './MDXContext';
import { useProgress } from '@/hooks/useProgress';
import { Check, X, Award, HelpCircle } from 'lucide-react';
import { MathRenderer } from '@/components/MathRenderer';
import { playCorrectSound, playWrongSound } from '@/utils/celebration';

interface QuizMultipleChoiceProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
}

export function QuizMultipleChoice({
  question = '',
  options = [],
  correctIndex = 0,
  explanation = '',
  imageUrl = '',
}: QuizMultipleChoiceProps) {
  // Validamos que el correctIndex esté dentro del rango del arreglo
  if (correctIndex < 0 || correctIndex >= options.length) {
    console.error(`QuizMultipleChoice: correctIndex ${correctIndex} está fuera de los límites para options de longitud ${options.length}`);
  }
  const { courseId, unitId, topicId } = useMDXContext();
  const { getTopicProgress, updateQuizScore, markCompleted } = useProgress();

  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  // Sync state if already completed/answered in localStorage
  React.useEffect(() => {
    const topicProgress = getTopicProgress(courseId, unitId, topicId);
    if (topicProgress && topicProgress.quizScore !== undefined) {
      // For simplicity, we just mark submitted, but we can let them retake it
      // Let's check if they scored 100 to show the correct answer
      if (topicProgress.quizScore === 100) {
        setSelectedIdx(correctIndex);
        setSubmitted(true);
      }
    }
  }, [courseId, unitId, topicId, getTopicProgress, correctIndex]);

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setSubmitted(true);
    const score = selectedIdx === correctIndex ? 100 : 0;
    updateQuizScore(courseId, unitId, topicId, score);
    if (score === 100) {
      markCompleted(courseId, unitId, topicId, true);
      playCorrectSound();
    } else {
      playWrongSound();
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setSubmitted(false);
  };

  return (
    <div className="my-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-start space-x-3 mb-4">
        <HelpCircle className="h-6 w-6 text-primary-500 shrink-0 mt-0.5" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex-1">
          <MathRenderer text={question} />
        </h3>
      </div>

      {imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[250px] flex items-center justify-center bg-slate-50 dark:bg-slate-950/20 p-2">
          <img src={imageUrl} alt="Ilustración del cuestionario" className="max-h-[230px] w-auto object-contain rounded-lg" />
        </div>
      )}

      <div className="space-y-3 mb-5">
        {options.map((option, idx) => {
          let optionStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800';
          let icon = null;

          if (selectedIdx === idx) {
            optionStyle = 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20';
          }

          if (submitted) {
            if (idx === correctIndex) {
              optionStyle = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300';
              icon = <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
            } else if (selectedIdx === idx) {
              optionStyle = 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300';
              icon = <X className="h-5 w-5 text-rose-600 dark:text-rose-400" />;
            } else {
              optionStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              disabled={submitted}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-4 border rounded-xl flex items-center justify-between transition-all duration-200 font-medium ${optionStyle}`}
            >
              <span><MathRenderer text={option} /></span>
              {icon}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedIdx === null}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-semibold rounded-xl transition-all duration-200"
        >
          Verificar Respuesta
        </button>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${selectedIdx === correctIndex ? 'bg-emerald-50/30 border-emerald-200/50 text-emerald-900 dark:bg-emerald-950/10 dark:border-emerald-900/50 dark:text-emerald-300' : 'bg-rose-50/30 border-rose-200/50 text-rose-900 dark:bg-rose-950/10 dark:border-rose-900/50 dark:text-rose-300'}`}>
            <p className="font-bold flex items-center gap-2 mb-1">
              {selectedIdx === correctIndex ? (
                <>
                  <Award className="h-5 w-5 text-emerald-500" />
                  <span>¡Correcto!</span>
                </>
              ) : (
                <span>Incorrecto. Inténtalo de nuevo.</span>
              )}
            </p>
            <div className="text-sm opacity-90">
              <MathRenderer text={explanation} />
            </div>
          </div>
          {selectedIdx !== correctIndex && (
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition-all duration-200"
            >
              Volver a Intentar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
