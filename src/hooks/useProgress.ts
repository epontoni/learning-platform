'use client';

import { useState, useEffect } from 'react';

export interface TopicProgress {
  isCompleted: boolean;
  quizScore?: number;
  lastAccessed: string;
}

export interface UserProgress {
  [pathKey: string]: TopicProgress;
}

const STORAGE_KEY = 'sigmamath-user-progress';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProgress(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load user progress from localStorage:', err);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Helper to construct a unique key for the topic
  const makeKey = (courseId: string, unitId: string, topicId: string) => {
    return `${courseId}/${unitId}/${topicId}`;
  };

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      } catch (err) {
        console.error('Failed to save user progress to localStorage:', err);
      }
    }
  };

  const getTopicProgress = (courseId: string, unitId: string, topicId: string): TopicProgress | undefined => {
    return progress[makeKey(courseId, unitId, topicId)];
  };

  const markCompleted = (courseId: string, unitId: string, topicId: string, isCompleted: boolean) => {
    const key = makeKey(courseId, unitId, topicId);
    const existing = progress[key] || { isCompleted: false, lastAccessed: new Date().toISOString() };
    const updated: UserProgress = {
      ...progress,
      [key]: {
        ...existing,
        isCompleted,
        lastAccessed: new Date().toISOString(),
      },
    };
    saveProgress(updated);
  };

  const updateQuizScore = (courseId: string, unitId: string, topicId: string, quizScore: number) => {
    const key = makeKey(courseId, unitId, topicId);
    const existing = progress[key] || { isCompleted: false, lastAccessed: new Date().toISOString() };
    const updated: UserProgress = {
      ...progress,
      [key]: {
        ...existing,
        quizScore,
        lastAccessed: new Date().toISOString(),
      },
    };
    saveProgress(updated);
  };

  const touchTopic = (courseId: string, unitId: string, topicId: string) => {
    const key = makeKey(courseId, unitId, topicId);
    const existing = progress[key] || { isCompleted: false, lastAccessed: new Date().toISOString() };
    const updated: UserProgress = {
      ...progress,
      [key]: {
        ...existing,
        lastAccessed: new Date().toISOString(),
      },
    };
    saveProgress(updated);
  };

  // Helper to count progress of a specific course
  const getCourseProgressPercentage = (courseId: string, totalTopics: number): number => {
    if (totalTopics === 0) return 0;
    const completedCount = Object.keys(progress).filter(key => {
      return key.startsWith(`${courseId}/`) && progress[key].isCompleted;
    }).length;
    return Math.min(Math.round((completedCount / totalTopics) * 100), 100);
  };

  return {
    progress,
    isLoaded,
    getTopicProgress,
    markCompleted,
    updateQuizScore,
    touchTopic,
    getCourseProgressPercentage,
  };
}
