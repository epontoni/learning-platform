import { notFound } from 'next/navigation';
import { readContentFile } from '@/utils/content';
import { MDXContextProvider } from '@/components/MDXContext';
import { MDXWrapper } from '@/components/MDXWrapper';
import { ReadingLayoutClient } from '@/components/ReadingLayoutClient';

interface PageProps {
  params: Promise<{
    curso: string;
    unidad: string;
    tema: string;
  }>;
}

async function getCourseMeta(cursoId: string) {
  try {
    const raw = await readContentFile(`cursos/${cursoId}/course-meta.json`);
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to get course meta for ${cursoId}:`, err);
    return null;
  }
}

async function getUnitMeta(cursoId: string, unitId: string) {
  try {
    const raw = await readContentFile(`cursos/${cursoId}/${unitId}/unit-meta.json`);
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to get unit meta for ${cursoId}/${unitId}:`, err);
    return null;
  }
}

async function getTopicContent(cursoId: string, unitId: string, topicId: string) {
  try {
    const content = await readContentFile(`cursos/${cursoId}/${unitId}/${topicId}.mdx`);
    return content;
  } catch (err) {
    console.error(`Failed to get topic content for ${cursoId}/${unitId}/${topicId}:`, err);
    return null;
  }
}

export default async function CourseTopicPage({ params }: PageProps) {
  const { curso, unidad, tema } = await params;

  // Fetch metadata and content using unified content loader (local or remote)
  const courseMeta = await getCourseMeta(curso);
  const unitMeta = await getUnitMeta(curso, unidad);
  const topicContent = await getTopicContent(curso, unidad, tema);

  if (!courseMeta || !unitMeta || !topicContent) {
    notFound();
  }

  // Find current topic details
  const topicDetails = unitMeta.topics.find((t: any) => t.id === tema) || {
    title: 'Tema de Estudio',
  };

  return (
    <MDXContextProvider
      courseId={curso}
      unitId={unidad}
      topicId={tema}
      content={topicContent}
    >
      <ReadingLayoutClient
        course={courseMeta}
        currentUnitId={unidad}
        currentTopicId={tema}
        currentTopicTitle={topicDetails.title}
        rawContent={topicContent}
        resources={topicDetails.resources}
      >
        <MDXWrapper source={topicContent} />
      </ReadingLayoutClient>
    </MDXContextProvider>
  );
}
