import * as React from 'react';
import { Heart, Mail, BookOpen, Code, Users } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ComunidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl mb-2">
          <Users className="h-6 w-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent)] to-[#009EE3] bg-clip-text text-transparent">
          Comunidad del Proyecto
        </h1>
        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
          Esta plataforma fue creada con el propósito de ofrecer una experiencia rigurosa y estética en el aprendizaje de matemáticas universitarias. Al ser un proyecto de código abierto, tu colaboración es fundamental para expandir su alcance y mejorar su contenido.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Colaborar en Contenido */}
        <div className="group bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 hover:shadow-md hover:border-[var(--accent)]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Crear y Editar Contenido</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              ¿Quieres añadir un nuevo tema o corregir una fórmula en KaTeX? Todo nuestro contenido se gestiona en archivos MDX estructurados. Puedes proponer mejoras o crear nuevos cursos enviando un Pull Request.
            </p>
          </div>
          <a
            href="https://github.com/epontoni/learning-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-bold text-violet-600 dark:text-violet-400 mt-6 hover:underline"
          >
            <span>Ver repositorio en GitHub</span>
            <GithubIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Card 2: Aportar Código */}
        <div className="group bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 hover:shadow-md hover:border-[var(--accent)]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Code className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Colaborar en el Código</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              La plataforma está construida utilizando Next.js App Router, Tailwind CSS y la API de Gemini. Ayúdanos a solucionar issues abiertos, optimizar el tutor socrático o expandir las funcionalidades del compilador interactivo.
            </p>
          </div>
          <a
            href="https://github.com/epontoni/learning-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-6 hover:underline"
          >
            <span>Explorar el código fuente</span>
            <GithubIcon className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Card 3: Donar / Patrocinar */}
        <div className="group bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 hover:shadow-md hover:border-[var(--accent)]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Heart className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Donaciones y Patrocinio</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              El mantenimiento del servidor y el consumo de la API de Inteligencia Artificial tienen costos asociados. Si valoras el proyecto, tu contribución económica nos ayuda a mantenerlo gratuito y libre de anuncios.
            </p>
          </div>
          <a
            href="https://link.mercadopago.com.ar/emanuelpontoni"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-bold text-pink-600 dark:text-pink-400 mt-6 hover:underline"
          >
            <span>Donar mediante Mercado Pago</span>
            <Heart className="h-3.5 w-3.5 fill-current" />
          </a>
        </div>

        {/* Card 4: Contacto */}
        <div className="group bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 hover:shadow-md hover:border-[var(--accent)]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Feedback y Contacto Directo</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              ¿Tienes sugerencias, consultas teóricas o propuestas comerciales? Puedes comunicarte directamente conmigo. Todo feedback ayuda a moldear el futuro académico de la plataforma.
            </p>
          </div>
          <a
            href="mailto:emanuelpontoni@gmail.com"
            className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 mt-6 hover:underline"
          >
            <span>Enviar un correo electrónico</span>
            <Mail className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* GitHub Call to Action Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--glass-border)] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-left">
          <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)]">¿Listo para hacer tu primer aporte?</h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
            Toda contribución, por pequeña que sea (corrección ortográfica, simplificación de explicaciones, optimización de estilos), es bienvenida y recibirás el crédito correspondiente.
          </p>
        </div>
        <a
          href="https://github.com/epontoni/learning-platform"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent)] hover:text-white text-sm font-extrabold rounded-xl transition-all duration-300 shadow-md active:scale-95 shrink-0"
        >
          <GithubIcon className="h-4 w-4" />
          <span>Contribuir en GitHub</span>
        </a>
      </div>
    </div>
  );
}
