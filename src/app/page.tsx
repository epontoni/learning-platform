import { MathCanvas } from '@/components/MathCanvas';
import { readContentFile } from '@/utils/content';
import { Sparkles, Library, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

  // Take the 3 active/latest courses for the Home Page
  const latestCourses = courses.filter((c: any) => c.active).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Hero Section with MathCanvas background */}
      <div className="relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-3xl p-8 md:p-12 shadow-sm">
        {/* Animated Cartesian grid background */}
        <MathCanvas />

        {/* Soft gradient overlay to blend canvas into secondary background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-secondary)]/85 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 bg-[var(--border)] text-[var(--accent)] px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explora los mejores recursos para aprender</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)]">
            Aprende <span className="text-gradient">Matemáticas</span>
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

      {/* Latest Courses Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Nuestros últimos cursos destacados
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Explora las materias activas y empieza a aprender ahora mismo.
          </p>
        </div>

        {/* Simplified Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestCourses.map((course: any) => (
            <div
              key={course.id}
              className="group bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-[var(--accent)]/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  {course.category} • Curso Universitario
                </span>
                <h3 className="text-base font-extrabold text-[var(--text-primary)] mt-2 mb-3 leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4 mt-auto">
                <span className="text-[10px] font-bold text-[var(--text-muted)]">
                  {course.difficulty === 'Principiante' ? '∽ Iniciante' : course.difficulty === 'Intermedio' ? '∽ Intermedio' : '↗ Avanzado'}
                </span>

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
          ))}
        </div>

        {/* CTA to Explore all courses */}
        <div className="flex justify-center pt-4">
          <Link
            href="/explorar"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-extrabold rounded-xl transition-all shadow-md shadow-[var(--accent)]/10 hover:scale-105 active:scale-95 duration-200"
          >
            <span>Explorar todos los cursos</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
