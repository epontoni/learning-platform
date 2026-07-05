'use client';

import confetti from 'canvas-confetti';

/**
 * Plays a sound file from /public/resources/sounds/.
 * Fails silently if the file cannot be loaded or played.
 */
function playSound(filename: string, volume = 1.0) {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(`/resources/sounds/${filename}`);
    audio.volume = volume;
    audio.play().catch(() => {/* autoplay policy – silently ignore */});
  } catch {
    // silently ignore
  }
}

/** Plays the correct-answer sound. */
export function playCorrectSound() {
  playSound('correct-answer.mp3', 0.8);
}

/** Plays the wrong-answer sound. */
export function playWrongSound() {
  playSound('wrong-answer.mp3', 0.8);
}

/**
 * Fires a full-screen multi-burst confetti celebration.
 */
export function fireConfetti() {
  const duration = 5000;
  const end = Date.now() + duration;
  const colors = ['#6C63FF', '#009EE3', '#a855f7', '#22d3ee', '#f472b6', '#facc15', '#ffffff'];

  (function frame() {
    confetti({ particleCount: 7, angle: 60,  spread: 58, origin: { x: 0, y: 0.65 }, colors });
    confetti({ particleCount: 7, angle: 120, spread: 58, origin: { x: 1, y: 0.65 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/**
 * Triggers confetti + the real course-completed fanfare.
 */
export function celebrateCourseCompletion() {
  fireConfetti();
  playSound('course-completed.mp3', 1.0);
}
