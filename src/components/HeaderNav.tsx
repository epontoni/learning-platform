'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, BookOpen, Compass, Users } from 'lucide-react';

export function HeaderNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check if a path is active
  const isMisCursosActive = pathname === '/mis-cursos' || pathname.startsWith('/cursos/');
  const isExplorarActive = pathname === '/explorar';
  const isComunidadActive = pathname === '/comunidad';
  const isInicioActive = pathname === '/';

  const baseClass = "pb-5 pt-5 transition-colors font-semibold text-sm";
  const activeClass = "text-[var(--accent)] border-b-2 border-[var(--accent)]";
  const inactiveClass = "text-[var(--text-secondary)] hover:text-[var(--text-primary)]";

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className={`${baseClass} ${isInicioActive ? activeClass : inactiveClass}`}
        >
          Inicio
        </Link>
        <Link
          href="/mis-cursos"
          className={`${baseClass} ${isMisCursosActive ? activeClass : inactiveClass}`}
        >
          Mis cursos
        </Link>
        <Link
          href="/explorar"
          className={`${baseClass} ${isExplorarActive ? activeClass : inactiveClass}`}
        >
          Explorar
        </Link>
        <Link
          href="/comunidad"
          className={`${baseClass} ${isComunidadActive ? activeClass : inactiveClass}`}
        >
          Comunidad
        </Link>
      </nav>

      {/* Mobile Navigation Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 transition-all duration-200 focus:outline-none"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 w-full bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--glass-border)] py-4 px-6 md:hidden flex flex-col space-y-2 shadow-2xl z-50 transition-all duration-300">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isInicioActive
                ? "bg-[var(--accent)]/10 text-[var(--accent)] border-l-4 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
            }`}
          >
            <Home className="h-5 w-5 mr-3 shrink-0" />
            Inicio
          </Link>
          <Link
            href="/mis-cursos"
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isMisCursosActive
                ? "bg-[var(--accent)]/10 text-[var(--accent)] border-l-4 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
            }`}
          >
            <BookOpen className="h-5 w-5 mr-3 shrink-0" />
            Mis cursos
          </Link>
          <Link
            href="/explorar"
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isExplorarActive
                ? "bg-[var(--accent)]/10 text-[var(--accent)] border-l-4 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
            }`}
          >
            <Compass className="h-5 w-5 mr-3 shrink-0" />
            Explorar
          </Link>
          <Link
            href="/comunidad"
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isComunidadActive
                ? "bg-[var(--accent)]/10 text-[var(--accent)] border-l-4 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
            }`}
          >
            <Users className="h-5 w-5 mr-3 shrink-0" />
            Comunidad
          </Link>
        </div>
      )}
    </>
  );
}
