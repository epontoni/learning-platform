'use client';

import * as React from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { celebrateCourseCompletion } from '@/utils/celebration';
import { AITutorPanel } from './AITutorPanel';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  HelpCircle,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  List,
  Image,
  Headphones,
  ExternalLink,
  Compass
} from 'lucide-react';

export interface Resource {
  title: string;
  type: 'pdf' | 'image' | 'audio' | 'geogebra' | 'link';
  url: string;
}

interface Topic {
  id: string;
  title: string;
  duration?: string;
  resources?: Resource[];
}

interface Unit {
  id: string;
  title: string;
  topics: Topic[];
}

interface Course {
  id: string;
  title: string;
  units: Unit[];
}

interface ReadingLayoutClientProps {
  course: Course;
  currentUnitId: string;
  currentTopicId: string;
  currentTopicTitle: string;
  rawContent: string;
  resources?: Resource[];
  children: React.ReactNode;
}

export function ReadingLayoutClient({
  course,
  currentUnitId,
  currentTopicId,
  currentTopicTitle,
  rawContent,
  resources = [],
  children,
}: ReadingLayoutClientProps) {
  const { progress, isLoaded, markCompleted, getCourseProgressPercentage } = useProgress();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [tutorOpen, setTutorOpen] = React.useState(false);
  const [rightTab, setRightTab] = React.useState<'content' | 'chat'>('content');
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(null);
  const [activePreviewResource, setActivePreviewResource] = React.useState<Resource | null>(null);

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'geogebra': return <Compass className="h-4 w-4" />;
      case 'link': return <ExternalLink className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleResourceClick = (res: Resource) => {
    if (res.type === 'link') {
      window.open(res.url, '_blank', 'noopener,noreferrer');
    } else {
      setActivePreviewResource(res);
    }
  };

  // Get progress for the active topic
  const isActiveTopicDone = progress[`${course.id}/${currentUnitId}/${currentTopicId}`]?.isCompleted || false;

  // Calculate course stats
  const totalTopicsCount = course.units.reduce((acc, unit) => acc + unit.topics.length, 0);
  const progressPercent = getCourseProgressPercentage(course.id, totalTopicsCount);

  // Find next/prev topics for navigation controls
  const flatTopics = course.units.flatMap(u => 
    u.topics.map(t => ({ ...t, unitId: u.id }))
  );
  const currentIdx = flatTopics.findIndex(t => t.id === currentTopicId && t.unitId === currentUnitId);
  const prevTopic = currentIdx > 0 ? flatTopics[currentIdx - 1] : null;
  const nextTopic = currentIdx < flatTopics.length - 1 ? flatTopics[currentIdx + 1] : null;

  const handleToggleComplete = () => {
    const nowCompleting = !isActiveTopicDone;
    markCompleted(course.id, currentUnitId, currentTopicId, nowCompleting);

    // Check if this was the last topic to complete, triggering a full-course celebration
    if (nowCompleting) {
      const completedAfter = Object.keys(progress).filter(
        key => key.startsWith(`${course.id}/`) && progress[key].isCompleted
      ).length + 1;
      if (completedAfter >= totalTopicsCount) {
        setTimeout(() => celebrateCourseCompletion(), 300);
      }
    }
  };

  // Icon selector based on topic properties
  const getTopicIcon = (topicId: string) => {
    if (topicId.includes('quiz') || topicId.includes('cuestionario')) {
      return <HelpCircle className="h-4 w-4 shrink-0" />;
    }
    if (topicId.includes('video') || topicId.includes('introduccion')) {
      return <PlayCircle className="h-4 w-4 shrink-0" />;
    }
    return <FileText className="h-4 w-4 shrink-0" />;
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-screen bg-[var(--bg-primary)]">
      
      {/* Mobile Top bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[var(--bg-secondary)] border-b border-[var(--glass-border)] sticky top-16 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 border border-[var(--glass-border)] rounded-xl text-[var(--text-secondary)]"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <span className="font-bold text-xs truncate max-w-[160px] text-[var(--text-primary)]">
          {currentTopicTitle}
        </span>
        <div className="flex space-x-1 bg-[var(--bg-tertiary)] p-0.5 rounded-lg text-[10px] font-bold">
          <button
            onClick={() => { setTutorOpen(true); setRightTab('content'); }}
            className={`px-2 py-1 rounded-md ${rightTab === 'content' ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)]'}`}
          >
            Temas
          </button>
          <button
            onClick={() => { setTutorOpen(true); setRightTab('chat'); }}
            className={`px-2 py-1 rounded-md ${rightTab === 'chat' ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)]'}`}
          >
            Tutor
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
        {/* Breadcrumbs like DigitalHouse */}
        <nav className="text-[11px] font-bold text-[var(--text-muted)] flex items-center space-x-2">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Mis cursos</Link>
          <span>&gt;</span>
          <span className="truncate hover:text-[var(--accent)] transition-colors">{course.title}</span>
          <span>&gt;</span>
          <span className="text-[var(--text-secondary)] truncate">{currentTopicTitle}</span>
        </nav>

        {/* Lesson Navigation Header */}
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4 mt-2">
          <h1 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {currentTopicTitle}
          </h1>

          <div className="flex items-center space-x-2">
            {prevTopic && (
              <Link
                href={`/cursos/${course.id}/${prevTopic.unitId}/${prevTopic.id}`}
                className="p-2 border border-[var(--glass-border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-xl text-[var(--text-secondary)] transition-colors"
                title="Clase Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}
            {nextTopic && (
              <Link
                href={`/cursos/${course.id}/${nextTopic.unitId}/${nextTopic.id}`}
                className="p-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-bold flex items-center space-x-1 text-xs px-3 py-2 transition-colors"
                title="Siguiente Clase"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile View: Toggle between MDX Content and AI Tutor */}
        <div className="lg:hidden">
          {rightTab === 'chat' ? (
            <div className="fixed inset-x-0 bottom-0 top-[120px] bg-[var(--bg-primary)] z-20 flex flex-col p-4 animate-in fade-in duration-200">
              <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col">
                <AITutorPanel contextContent={rawContent} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* MDX Content wrapper */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-6 md:p-8 rounded-2xl shadow-sm">
                {children}
              </div>

              {/* Resources Section */}
              {resources && resources.length > 0 && (
                <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] mb-3 flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-[var(--accent)]" />
                    <span>Recursos Adicionales</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {resources.map((res, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleResourceClick(res)}
                        className="flex items-center space-x-3 p-3 bg-[var(--bg-primary)]/50 hover:bg-[var(--bg-tertiary)] border border-[var(--glass-border)] rounded-xl cursor-pointer transition-all duration-200 group"
                      >
                        <div className="p-2 bg-[var(--border)] text-[var(--accent)] rounded-lg group-hover:scale-105 transition-transform">
                          {getResourceIcon(res.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                            {res.title}
                          </div>
                          <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider mt-0.5">
                            {res.type}
                          </div>
                        </div>
                        {res.type !== 'link' && (
                          <span className="text-[9px] font-bold text-[var(--accent)] border border-[var(--accent)]/20 px-1.5 py-0.5 rounded bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            Ver
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback and Progress Completer */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-5 rounded-2xl shadow-sm">
                {/* Feedback buttons */}
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Nos interesa tu opinión</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                      className={`p-2 border rounded-lg transition-colors ${
                        feedback === 'like'
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'border-[var(--glass-border)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}
                      aria-label="Like"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                      className={`p-2 border rounded-lg transition-colors ${
                        feedback === 'dislike'
                          ? 'border-rose-500 bg-rose-50/20 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                          : 'border-[var(--glass-border)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}
                      aria-label="Dislike"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mark completed */}
                {isLoaded && (
                  <button
                    onClick={handleToggleComplete}
                    className={`flex items-center space-x-2 py-2 px-5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      isActiveTopicDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400'
                        : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-transparent'
                    }`}
                  >
                    {isActiveTopicDone ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Completado</span>
                      </>
                    ) : (
                      <span>Marcar como Completado</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop View: Always show MDX Content (as tutor resides in sidebar aside) */}
        <div className="hidden lg:block space-y-6">
          {/* MDX Content wrapper */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-6 md:p-8 rounded-2xl shadow-sm">
            {children}
          </div>

          {/* Resources Section */}
          {resources && resources.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-[var(--text-primary)] mb-3 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-[var(--accent)]" />
                <span>Recursos Adicionales</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {resources.map((res, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleResourceClick(res)}
                    className="flex items-center space-x-3 p-3 bg-[var(--bg-primary)]/50 hover:bg-[var(--bg-tertiary)] border border-[var(--glass-border)] rounded-xl cursor-pointer transition-all duration-200 group"
                  >
                    <div className="p-2 bg-[var(--border)] text-[var(--accent)] rounded-lg group-hover:scale-105 transition-transform">
                      {getResourceIcon(res.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {res.title}
                      </div>
                      <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider mt-0.5">
                        {res.type}
                      </div>
                    </div>
                    {res.type !== 'link' && (
                      <span className="text-[9px] font-bold text-[var(--accent)] border border-[var(--accent)]/20 px-1.5 py-0.5 rounded bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback and Progress Completer */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-5 rounded-2xl shadow-sm">
            {/* Feedback buttons */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Nos interesa tu opinión</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                  className={`p-2 border rounded-lg transition-colors ${
                    feedback === 'like'
                      ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'border-[var(--glass-border)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  }`}
                  aria-label="Like"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                  className={`p-2 border rounded-lg transition-colors ${
                    feedback === 'dislike'
                      ? 'border-rose-500 bg-rose-50/20 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                      : 'border-[var(--glass-border)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  }`}
                  aria-label="Dislike"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Mark completed */}
            {isLoaded && (
              <button
                onClick={handleToggleComplete}
                className={`flex items-center space-x-2 py-2 px-5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                  isActiveTopicDone
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400'
                    : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-transparent'
                }`}
              >
                {isActiveTopicDone ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Completado</span>
                  </>
                ) : (
                  <span>Marcar como Completado</span>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar Container (Desktop) */}
      <aside className="hidden lg:flex flex-col w-96 border-l border-[var(--glass-border)] bg-[var(--bg-secondary)] shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {/* Tab Headers */}
        <div className="flex border-b border-[var(--glass-border)] bg-[var(--bg-primary)]/50 p-2">
          <button
            onClick={() => setRightTab('content')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              rightTab === 'content'
                ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <List className="h-4 w-4" />
            <span>Contenido</span>
          </button>
          <button
            onClick={() => setRightTab('chat')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              rightTab === 'chat'
                ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Tutor de IA</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">
          {rightTab === 'content' ? (
            <div className="h-full overflow-y-auto p-6 space-y-6">
              {/* Progress Summary Card like DigitalHouse */}
              <div className="bg-[var(--bg-primary)]/50 border border-[var(--glass-border)] p-4 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Tu progreso</span>
                  <div className="text-base font-extrabold text-[var(--text-primary)]">
                    {progressPercent}% Completado
                  </div>
                </div>
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" className="text-slate-200 dark:text-slate-800" fill="transparent" />
                    <circle cx="20" cy="20" r="16" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="100.5" strokeDashoffset={100.5 - (100.5 * progressPercent) / 100} fill="transparent" />
                  </svg>
                  <span className="absolute text-[9px] font-bold text-[var(--text-primary)]">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Units List */}
              <div className="space-y-4">
                {course.units.map(unit => (
                  <div key={unit.id} className="space-y-2">
                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--glass-border)] flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-secondary)] truncate max-w-[200px]">
                        {unit.title}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                        {unit.topics.length} temas
                      </span>
                    </div>

                    <ul className="space-y-1.5 pl-1">
                      {unit.topics.map(topic => {
                        const isActive = unit.id === currentUnitId && topic.id === currentTopicId;
                        const isDone = progress[`${course.id}/${unit.id}/${topic.id}`]?.isCompleted || false;

                        return (
                          <li key={topic.id}>
                            <Link
                              href={`/cursos/${course.id}/${unit.id}/${topic.id}`}
                              className={`flex items-center space-x-2.5 p-2 rounded-xl text-xs font-semibold transition-all group ${
                                isActive
                                  ? 'bg-[var(--border)] text-[var(--accent)]'
                                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                              ) : (
                                <div className="text-[var(--text-muted)] group-hover:text-[var(--accent)]">
                                  {getTopicIcon(topic.id)}
                                </div>
                              )}
                              <span className="truncate">{topic.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full">
              <AITutorPanel contextContent={rawContent} />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer (Sidebar contents) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/40 backdrop-blur-sm">
          <div className="w-80 max-w-[85vw] bg-[var(--bg-secondary)] h-full p-6 flex flex-col border-r border-[var(--glass-border)] animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-6">
              <span className="font-extrabold text-sm text-[var(--text-primary)]">Contenido del Curso</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 border border-[var(--glass-border)] rounded-xl"
                aria-label="Close Menu"
              >
                <X className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-6">
              {course.units.map(unit => (
                <div key={unit.id} className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                    {unit.title}
                  </h4>
                  <ul className="space-y-1">
                    {unit.topics.map(topic => {
                      const isActive = unit.id === currentUnitId && topic.id === currentTopicId;
                      const isDone = progress[`${course.id}/${unit.id}/${topic.id}`]?.isCompleted || false;

                      return (
                        <li key={topic.id}>
                          <Link
                            href={`/cursos/${course.id}/${unit.id}/${topic.id}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold ${
                              isActive
                                ? 'bg-[var(--border)] text-[var(--accent)]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                            ) : (
                              getTopicIcon(topic.id)
                            )}
                            <span className="truncate">{topic.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      {/* Resource Preview Modal Overlay */}
      {activePreviewResource && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-lg">
                  {getResourceIcon(activePreviewResource.type)}
                </div>
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  {activePreviewResource.title}
                </span>
              </div>
              <button
                onClick={() => setActivePreviewResource(null)}
                className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                aria-label="Close Preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/20">
              {activePreviewResource.type === 'image' && (
                <img 
                  src={activePreviewResource.url} 
                  alt={activePreviewResource.title} 
                  className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md border border-slate-200/50 dark:border-slate-800/50"
                />
              )}
              {activePreviewResource.type === 'pdf' && (
                <iframe 
                  src={activePreviewResource.url} 
                  title={activePreviewResource.title} 
                  className="w-full h-[70vh] rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white"
                />
              )}
              {activePreviewResource.type === 'geogebra' && (
                <iframe 
                  src={activePreviewResource.url} 
                  title={activePreviewResource.title} 
                  className="w-full h-[70vh] rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white"
                  allowFullScreen
                />
              )}
              {activePreviewResource.type === 'audio' && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-5 max-w-md w-full">
                  <div className="p-4 bg-primary-50 dark:bg-primary-950/30 text-primary-500 rounded-full animate-pulse">
                    <Headphones className="h-10 w-10" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {activePreviewResource.title}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Reproductor de Audio
                    </div>
                  </div>
                  <audio 
                    controls 
                    autoPlay
                    src={activePreviewResource.url} 
                    className="w-full focus:outline-none" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
