'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderNav() {
  const pathname = usePathname();

  // Check if a path is active
  const isMisCursosActive = pathname === '/mis-cursos' || pathname.startsWith('/cursos/');
  const isExplorarActive = pathname === '/explorar';
  const isComunidadActive = pathname === '/comunidad';

  const baseClass = "pb-5 pt-5 transition-colors font-semibold text-sm";
  const activeClass = "text-[var(--accent)] border-b-2 border-[var(--accent)]";
  const inactiveClass = "text-[var(--text-secondary)] hover:text-[var(--text-primary)]";

  return (
    <nav className="hidden md:flex items-center space-x-8">
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
  );
}
