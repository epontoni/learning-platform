import { CourseGrid } from '@/components/CourseGrid';
import { MathCanvas } from '@/components/MathCanvas';
import { readContentFile } from '@/utils/content';
import { Sparkles, Library, GraduationCap } from 'lucide-react';

async function getCourses() {
  try {
    const raw = await readContentFile('cursos/courses-index.json');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading courses index:', err);
    return [];
  }
}

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Hero Section with MathCanvas background */}
      <div className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-3xl p-8 md:p-12 shadow-sm">
        {/* Animated Cartesian grid background */}
        <MathCanvas />
        
        {/* Soft gradient overlay to blend canvas into secondary background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 bg-[var(--border)] text-[var(--accent)] px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Profesor de Matemática & Desarrollador Frontend Sandbox</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)]">
            Aprende Matemáticas con <span className="text-gradient">Rigor Lógico</span>
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Una propuesta educativa que une la rigurosidad analítica del álgebra y el cálculo con la interactividad de la web. Resuelve demostraciones formales, valida conceptos con Inteligencia Artificial e interactúa con un tutor socrático en tiempo real.
          </p>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)]">
              <GraduationCap className="h-4 w-4 text-[var(--accent)]" />
              <span>Plataforma interactiva</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)]">
              <Library className="h-4 w-4 text-[var(--accent)]" />
              <span>Soporte de LaTeX / Katex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Certificaciones que estás cursando
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Progreso acumulado y temario activo.
          </p>
        </div>

        <CourseGrid initialCourses={courses} />
      </section>
    </div>
  );
}
