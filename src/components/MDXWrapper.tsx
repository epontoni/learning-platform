import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { QuizMultipleChoice } from '@/components/QuizMultipleChoice';
import { SemanticEval } from '@/components/SemanticEval';
import { GeoGebra } from '@/components/GeoGebra';

interface MDXWrapperProps {
  source: string;
}

const components = {
  QuizMultipleChoice,
  SemanticEval,
  GeoGebra,
  h1: (props: any) => (
    <h1
      className="text-3xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight mt-8 mb-4 border-b border-slate-200 dark:border-slate-800/80 pb-2"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-8 mb-3"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight mt-6 mb-2"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      className="list-disc pl-6 mb-4 space-y-1.5 text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal pl-6 mb-4 space-y-1.5 text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),
  li: (props: any) => <li className="text-base" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4 bg-slate-50 dark:bg-slate-900/30 py-2 pr-2 rounded-r-md"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-sm text-primary-600 dark:text-primary-400"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto my-4 font-mono text-sm border border-slate-900"
      {...props}
    />
  ),
  hr: (props: any) => (
    <hr className="border-slate-200 dark:border-slate-800 my-8" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-left border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border-b border-slate-200 dark:border-slate-800 p-3 font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900/50"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="border-b border-slate-100 dark:border-slate-900 p-3 text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),
};

export async function MDXWrapper({ source }: MDXWrapperProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        }}
        components={components}
      />
    </div>
  );
}
