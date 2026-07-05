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
 * Synthesizes a rich trumpet-like timbre for a single note.
 */
function playTrumpetNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume = 0.35
) {
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // ADSR envelope — sharp attack, slight decay, sustained, fast release
  masterGain.gain.setValueAtTime(0, startTime);
  masterGain.gain.linearRampToValueAtTime(volume, startTime + 0.025);      // attack
  masterGain.gain.linearRampToValueAtTime(volume * 0.85, startTime + 0.08); // decay
  masterGain.gain.setValueAtTime(volume * 0.85, startTime + duration - 0.06);
  masterGain.gain.linearRampToValueAtTime(0, startTime + duration);         // release

  // Harmonics present in a real brass instrument (sawtooth approximation)
  const harmonics: [number, number][] = [
    [1, 1.0],
    [2, 0.65],
    [3, 0.50],
    [4, 0.38],
    [5, 0.28],
    [6, 0.18],
    [7, 0.12],
    [8, 0.07],
  ];

  harmonics.forEach(([harmonic, gain]) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * harmonic, startTime);
    // Add a tiny vibrato on sustained notes
    if (duration > 0.3) {
      osc.frequency.linearRampToValueAtTime(freq * harmonic * 1.004, startTime + duration * 0.5);
      osc.frequency.linearRampToValueAtTime(freq * harmonic, startTime + duration);
    }
    oscGain.gain.setValueAtTime(gain * 0.12, startTime);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  });

  // Resonant band-pass filter centered around trumpet's formant (~1100 Hz)
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1100, startTime);
  filter.Q.setValueAtTime(1.8, startTime);
  masterGain.connect(filter);
  filter.connect(ctx.destination);
}

/**
 * Plays a majestic 7-note ascending trumpet fanfare using the Web Audio API.
 * No external audio files needed.
 */
export function playVictorySound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();

    // Classic military fanfare motif: C4, G4, C5, E5, G5, E5, C6
    const fanfare: [number, number, number][] = [
      // [freq_hz, start_offset_s, duration_s]
      [261.63, 0.00, 0.18],  // C4
      [392.00, 0.16, 0.18],  // G4
      [523.25, 0.32, 0.18],  // C5
      [659.25, 0.48, 0.22],  // E5
      [783.99, 0.68, 0.28],  // G5
      [659.25, 0.94, 0.18],  // E5
      [1046.5, 1.10, 0.65],  // C6 — long held note
    ];

    const base = ctx.currentTime + 0.05;
    fanfare.forEach(([freq, offset, dur]) => {
      playTrumpetNote(ctx, freq, base + offset, dur);
    });
  } catch (err) {
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
