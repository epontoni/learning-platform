'use client';

import * as React from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { Search, Filter } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  active?: boolean;
  entryPoint?: string;
}

interface CourseGridProps {
  initialCourses: Course[];
}

export function CourseGrid({ initialCourses }: CourseGridProps) {
  const { isLoaded, progress } = useProgress();
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('Todos');
  const [activeTab, setActiveTab] = React.useState<'todos' | 'en-curso' | 'finalizados'>('todos');

  // Total topics mapping per course
  const totalTopicsMap: { [id: string]: number } = {
    algebra: 2,
    calculo: 2,
    numeros: 1,
    "geometria-diferencial": 7,
  };

  const categories = ['Todos', ...Array.from(new Set(initialCourses.map(c => c.category)))];
  const difficulties = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

  const getCourseProgressStats = (courseId: string) => {
    const total = totalTopicsMap[courseId] || 2;
    if (!isLoaded) return { completed: 0, total, percent: 0 };
    const completed = Object.keys(progress).filter(key => {
      return key.startsWith(`${courseId}/`) && progress[key].isCompleted;
    }).length;
    const percent = Math.min(Math.round((completed / total) * 100), 100);
    return { completed, total, percent };
  };

  const filteredCourses = initialCourses.filter(course => {
    const { percent } = getCourseProgressStats(course.id);
    
    // Tab filter
    if (activeTab === 'en-curso' && (percent === 0 || percent === 100)) return false;
    if (activeTab === 'finalizados' && percent < 100) return false;

    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Todos' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-8">
      {/* Tabs like DigitalHouse (En curso, Finalizados, Todos) */}
      <div className="flex space-x-2 border-b border-[var(--glass-border)] pb-1">
        <button
          onClick={() => setActiveTab('todos')}
          className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
            activeTab === 'todos'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          Todos los cursos
        </button>
        <button
          onClick={() => setActiveTab('en-curso')}
          className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
            activeTab === 'en-curso'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          En curso
        </button>
        <button
          onClick={() => setActiveTab('finalizados')}
          className={`px-4 py-2 text-sm font-bold transition-all rounded-lg ${
            activeTab === 'finalizados'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          Finalizados
        </button>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar por tema o materia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[var(--glass-border)] bg-[var(--bg-primary)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1">
              <Filter className="h-3 w-3" /> Categoría:
            </span>
            <div className="flex gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Dificultad:</span>
            <div className="flex gap-1">
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[var(--glass-border)] rounded-2xl bg-[var(--bg-secondary)]/50">
          <p className="text-sm text-[var(--text-muted)]">No se encontraron cursos con los criterios seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const { completed, total, percent } = getCourseProgressStats(course.id);
            const radius = 18;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (circumference * percent) / 100;

            return (
              <div
                key={course.id}
                className="group bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-[var(--accent)]/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual Top Decorative Accent line like DigitalHouse layout */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />

                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                      {course.category} • Curso Universitario
                    </span>
                    <h3 className="text-base font-extrabold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors pr-2">
                      {course.title}
                    </h3>
                  </div>

                  {/* Circular progress SVG */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-slate-100 dark:text-slate-800"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke="var(--accent)"
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-extrabold text-[var(--text-primary)]">
                      {completed}/{total}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mt-3 mb-5 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4 mt-auto">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold bg-[var(--bg-tertiary)] px-2 py-1 rounded-md text-[var(--text-secondary)]">
                      {total} {total === 1 ? 'lección' : 'lecciones'}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">
                      {course.difficulty === 'Principiante' ? '∽ Iniciante' : course.difficulty === 'Intermedio' ? '∽ Intermedio' : '↗ Avanzado'}
                    </span>
                  </div>

                  {course.active && course.entryPoint ? (
                    <Link
                      href={course.entryPoint}
                      className="inline-flex items-center justify-center px-3 py-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Ver contenido
                    </Link>
                  ) : (
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-primary)] px-2.5 py-1 rounded-lg">
                      Próximamente
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
