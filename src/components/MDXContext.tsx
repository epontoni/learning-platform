'use client';

import * as React from 'react';

interface MDXContextType {
  courseId: string;
  unitId: string;
  topicId: string;
  content: string; // The raw MDX content of the topic
}

const MDXContext = React.createContext<MDXContextType | null>(null);

export function MDXContextProvider({
  children,
  courseId,
  unitId,
  topicId,
  content,
}: {
  children: React.ReactNode;
  courseId: string;
  unitId: string;
  topicId: string;
  content: string;
}) {
  return (
    <MDXContext.Provider value={{ courseId, unitId, topicId, content }}>
      {children}
    </MDXContext.Provider>
  );
}

export function useMDXContext() {
  const context = React.useContext(MDXContext);
  if (!context) {
    throw new Error('useMDXContext must be used within an MDXContextProvider');
  }
  return context;
}
