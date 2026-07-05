import { CourseGrid } from '@/components/CourseGrid';
import { readContentFile } from '@/utils/content';
import { Compass } from 'lucide-react';

async function getCourses() {
  try {
    const raw = await readContentFile('cursos/courses-index.json');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading courses index:', err);
    return [];
  }
}

export default async function ExplorarPage() {
  const courses = await getCourses();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-200">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-[var(--accent)] bg-[var(--border)] px-3 py-1 rounded-full text-xs font-semibold">
          <Compass className="h-3.5 w-3.5" />
          <span>Explorar Catálogo</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Encuentra tu próximo desafío
        </h1>
        <p className="text-xs text-[var(--text-muted)] max-w-xl">
          Busca por tema, filtra por categoría o nivel de dificultad para encontrar el curso ideal para ti.
        </p>
      </div>

      <CourseGrid initialCourses={courses} initialTab="todos" hideFilters={false} />
    </div>
  );
}
