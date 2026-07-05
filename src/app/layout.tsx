import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Emanuel.P | Plataforma de Aprendizaje Matemático",
  description: "Aprende matemáticas con rigor lógico, explicaciones interactivas y un tutor IA socrático.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <Providers>
          <header className="sticky top-0 z-40 w-full bg-[var(--glass-bg)] border-b border-[var(--glass-border)] backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-10">
                <Link href="/" className="logo text-xl font-extrabold tracking-tight">
                  Emanuel<span className="text-[var(--accent)]">.P</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[var(--text-secondary)]">
                  <Link href="/" className="text-[var(--accent)] border-b-2 border-[var(--accent)] pb-5 pt-5 hover:text-[var(--accent-hover)] transition-colors">
                    Mis cursos
                  </Link>
                  <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">
                    Explorar
                  </Link>
                  <Link href="/comunidad" className="hover:text-[var(--text-primary)] transition-colors">
                    Comunidad
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <a
                  href="https://link.mercadopago.com.ar/emanuelpontoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[var(--accent)] to-[#009EE3] text-white text-xs font-extrabold rounded-xl border border-[var(--glass-border)] shadow-md hover:shadow-lg hover:shadow-[var(--accent)]/20 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow"
                >
                  <Heart className="h-4 w-4 fill-white text-white group-hover:animate-heartbeat shrink-0" />
                  <span className="hidden sm:inline">Apoyar Proyecto</span>
                  <span className="sm:hidden">Apoyar</span>
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col">
            {children}
          </main>

          <footer className="border-t border-[var(--glass-border)] bg-[var(--bg-secondary)]/50 py-8 text-center text-xs text-[var(--text-muted)]">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} Emanuel.P. Plataforma de Aprendizaje.</p>
              <div className="flex space-x-4">
                <a href="https://epontoni.github.io" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--accent)]">
                  Portafolio
                </a>
                <span>•</span>
                <span className="font-semibold text-[var(--text-secondary)]">Profesor de Matemática & Desarrollador Frontend</span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
