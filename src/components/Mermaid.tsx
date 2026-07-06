'use client';

import React, { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

// Inicializamos Mermaid globalmente fuera del ciclo de vida de React
mermaid.initialize({
  startOnLoad: false,
  theme: 'default', // Cambia a 'dark' si tu web utiliza tema oscuro
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const id = useId(); // ID estable garantizado

  useEffect(() => {
    // Si el string llega vacío, detenemos la ejecución
    if (!chart) return;

    const renderChart = async () => {
      try {
        // Limpiamos el ID para que sea válido en el DOM
        const cleanId = `mermaid-${id.replace(/:/g, '')}`;

        // Renderizamos
        const { svg } = await mermaid.render(cleanId, chart.trim());
        setSvgContent(svg);
      } catch (error) {
        console.error('Error al compilar el gráfico:', error);
        setSvgContent(
          `<div class="text-red-600 bg-red-50 p-4 rounded border border-red-200 text-sm font-mono">
            Error de sintaxis en el diagrama Mermaid. Verifica la consola.
          </div>`
        );
      }
    };

    renderChart();
  }, [chart, id]);

  if (!svgContent) {
    return (
      <div className="flex justify-center my-6 text-slate-500 min-h-[100px] items-center">
        Cargando gráfico...
      </div>
    );
  }

  return (
    <div
      className="flex justify-center my-6 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default Mermaid;