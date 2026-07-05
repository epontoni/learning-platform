'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[75vh] px-6 text-center relative overflow-hidden py-12">
      {/* Background Math Grid Decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern-404" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern-404)" />
        </svg>
      </div>

      {/* Floating Unicode Math Symbols with custom animations */}
      <div className="absolute top-1/4 left-1/4 animate-bounce text-4xl font-extrabold text-[var(--accent)]/10 dark:text-[var(--accent)]/20 select-none pointer-events-none" style={{ animationDuration: '6s' }}>
        ∅
      </div>
      <div className="absolute top-1/3 right-1/4 animate-bounce text-5xl font-extrabold text-[var(--accent)]/15 dark:text-[var(--accent)]/20 select-none pointer-events-none" style={{ animationDuration: '8s', animationDelay: '1s' }}>
        ∞
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-bounce text-4xl font-extrabold text-[var(--accent)]/10 dark:text-[var(--accent)]/15 select-none pointer-events-none" style={{ animationDuration: '7s', animationDelay: '0.5s' }}>
        ∫
      </div>
      <div className="absolute bottom-1/3 right-1/3 animate-bounce text-5xl font-extrabold text-[var(--accent)]/15 dark:text-[var(--accent)]/25 select-none pointer-events-none" style={{ animationDuration: '9s', animationDelay: '1.5s' }}>
        ∑
      </div>
      <div className="absolute top-1/2 left-10 animate-bounce text-3xl font-extrabold text-[var(--accent)]/5 dark:text-[var(--accent)]/15 select-none pointer-events-none" style={{ animationDuration: '5s', animationDelay: '2s' }}>
        π
      </div>
      <div className="absolute top-2/3 right-12 animate-bounce text-3xl font-extrabold text-[var(--accent)]/8 dark:text-[var(--accent)]/15 select-none pointer-events-none" style={{ animationDuration: '7.5s', animationDelay: '0.8s' }}>
        Δ
      </div>

      <div className="max-w-md w-full bg-[var(--bg-secondary)]/50 border border-[var(--glass-border)] rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-xl relative z-10 flex flex-col items-center">
        {/* Animated SVG Coordinate / Vector Illustration */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          {/* Pulsing background rings */}
          <div className="absolute inset-0 rounded-full bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-4 rounded-full bg-[var(--accent)]/5 dark:bg-[var(--accent)]/10 animate-pulse" />
          
          <svg className="w-28 h-28 text-[var(--accent)] relative z-10 drop-shadow-md animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="opacity-60" />
            <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="80" cy="20" r="5" fill="var(--bg-primary)" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
          </svg>
          <div className="absolute font-mono text-3xl font-extrabold text-[var(--accent)] drop-shadow-sm select-none">
            404
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Coordenada Inexistente
        </h1>
        
        <p className="text-sm text-[var(--text-secondary)] mt-3 mb-8 leading-relaxed">
          La solución a esta coordenada no pertenece al dominio de la plataforma. El recurso solicitado se encuentra fuera de los axiomas definidos.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center space-x-2 px-5 py-3 border border-[var(--glass-border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver atrás</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 px-5 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[var(--accent)]/10 active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Ir al inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
