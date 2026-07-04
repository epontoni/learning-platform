'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

interface GeoGebraProps {
  materialId: string;
  title?: string;
  height?: number | string;
}

export function GeoGebra({ materialId, title = 'GeoGebra Applet', height = 450 }: GeoGebraProps) {
  const [loading, setLoading] = React.useState(true);

  // Build optimal GeoGebra iframe URL for inline embeds
  const embedUrl = `https://www.geogebra.org/material/iframe/id/${materialId}/width/800/height/${height}/szb/true/sdz/true/sri/true/smb/false/stb/false`;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-sm my-6">
      {loading && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 z-10 space-y-2"
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Cargando gráfico interactivo de GeoGebra...
          </span>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        width="100%"
        height={height}
        onLoad={() => setLoading(false)}
        className="w-full border-0 block"
        allowFullScreen
      />
    </div>
  );
}
