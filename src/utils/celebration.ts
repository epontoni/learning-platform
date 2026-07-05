'use client';

import confetti from 'canvas-confetti';

/**
 * Fires a full-screen multi-burst confetti celebration.
 */
export function fireConfetti() {
  const duration = 5000;
  const end = Date.now() + duration;

  const colors = ['#6C63FF', '#009EE3', '#a855f7', '#22d3ee', '#f472b6', '#facc15', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 58,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 58,
      origin: { x: 1, y: 0.65 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/**
 * Plays a real trumpet fanfare using soundfont-player samples.
 * Samples are loaded dynamically from a public CDN (no bundled audio files needed).
 */
export async function playVictorySound() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Dynamically import soundfont-player (client-only)
    const Soundfont = (await import('soundfont-player')).default;

    // Load the real trumpet instrument samples (from MusyngKite soundfont)
    const trumpet = await Soundfont.instrument(ctx, 'trumpet', {
      soundfont: 'MusyngKite',
      gain: 4,
    });

    // ─── Heavenly Fanfare Sequence ───────────────────────────────────────────
    // A dramatic ascending fanfare inspired by classical brass anthems.
    // Timing: [note, startOffset_seconds, durationHint_seconds]
    // Notes use standard MIDI notation (C4 = middle C).
    const fanfare: [string, number, number][] = [
      // Opening flourish — three short ascending calls
      ['G3', 0.00, 0.22],
      ['C4', 0.22, 0.22],
      ['E4', 0.44, 0.22],
      // First phrase — ascending arpeggio
      ['G4', 0.70, 0.25],
      ['C5', 0.95, 0.25],
      ['E5', 1.20, 0.30],
      ['G5', 1.50, 0.38],
      // Celestial climax — the top sustained notes
      ['E5', 1.92, 0.22],
      ['G5', 2.14, 0.22],
      ['C6', 2.38, 1.80],   // Final triumphant held note
    ];

    // Add a subtle cathedral reverb via a delay network
    const reverbDelay1 = ctx.createDelay(0.08);
    const reverbDelay2 = ctx.createDelay(0.16);
    const reverbGain1 = ctx.createGain();
    const reverbGain2 = ctx.createGain();
    reverbGain1.gain.setValueAtTime(0.25, ctx.currentTime);
    reverbGain2.gain.setValueAtTime(0.12, ctx.currentTime);
    reverbDelay1.connect(reverbGain1);
    reverbGain1.connect(ctx.destination);
    reverbDelay2.connect(reverbGain2);
    reverbGain2.connect(ctx.destination);

    // Schedule each note
    const base = ctx.currentTime + 0.1;
    fanfare.forEach(([note, offset, duration]) => {
      trumpet.play(note, base + offset, {
        duration,
        gain: 4,
      });
    });

  } catch (err) {
    console.warn('Victory sound failed to play:', err);

    // Graceful degradation: simple tone if soundfont fails
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      let t = ctx.currentTime + 0.05;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
        gain.gain.linearRampToValueAtTime(0, t + (i === 3 ? 0.6 : 0.15));
        osc.start(t); osc.stop(t + 0.7);
        t += i === 3 ? 0 : 0.15;
      });
    } catch { /* silent */ }
  }
}

/**
 * Triggers both confetti and the heavenly trumpet fanfare simultaneously.
 */
export function celebrateCourseCompletion() {
  fireConfetti();
  // playVictorySound is async (loads samples); fire and forget
  void playVictorySound();
}
