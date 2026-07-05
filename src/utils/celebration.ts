'use client';

import confetti from 'canvas-confetti';

/**
 * Fires a full-screen multi-burst confetti celebration.
 */
export function fireConfetti() {
  const duration = 3500;
  const end = Date.now() + duration;

  const colors = ['#6C63FF', '#009EE3', '#a855f7', '#22d3ee', '#f472b6', '#facc15'];

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/**
 * Plays a short 3-note victory fanfare using the Web Audio API.
 * No external audio file needed.
 */
export function playVictorySound() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const durations = [0.12, 0.12, 0.12, 0.45];

    let startTime = ctx.currentTime + 0.05;

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, startTime + durations[i]);

      oscillator.start(startTime);
      oscillator.stop(startTime + durations[i] + 0.05);

      startTime += durations[i] * 0.85;
    });
  } catch (err) {
    // Audio context may be unavailable in some environments, silently fail
    console.warn('Victory sound failed to play:', err);
  }
}

/**
 * Triggers both confetti and victory sound simultaneously.
 */
export function celebrateCourseCompletion() {
  fireConfetti();
  playVictorySound();
}
