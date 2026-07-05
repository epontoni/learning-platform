import { CourseGrid } from '@/components/CourseGrid';
import { readContentFile } from '@/utils/content';
import { GraduationCap } from 'lucide-react';

async function getCourses() {
  try {
    const raw = await readContentFile('cursos/courses-index.json');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading courses index:', err);
    return [];
  }
}

export default async function MisCursosPage() {
  const courses = await getCourses();
  
  // Only started courses (active)
  const activeCourses = courses.filter((c: any) => c.active);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-200">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-[var(--accent)] bg-[var(--border)] px-3 py-1 rounded-full text-xs font-semibold">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Área Académica</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Certificaciones que estás cursando
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Progreso acumulado y temario activo.
        </p>
      </div>

      <CourseGrid initialCourses={activeCourses} initialTab="en-curso" hideFilters={true} />
    </div>
  );
}
