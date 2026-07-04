'use client';

import * as React from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
}

export function MathRenderer({ text }: MathRendererProps) {
  if (!text) return null;

  // Split the text by block math blocks $$...$$
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <span className="whitespace-pre-line leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="block my-3 overflow-x-auto max-w-full math-display-inner"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            console.error('KaTeX block error:', e);
            return <code key={index} className="block my-2 text-rose-500 font-mono text-xs">{part}</code>;
          }
        }

        // Split the remaining plain text by inline math blocks $...$
        const inlineParts = part.split(/(\$.*?\$)/g);
        return (
          <span key={index}>
            {inlineParts.map((subPart, subIndex) => {
              if (subPart.startsWith('$') && subPart.endsWith('$')) {
                const math = subPart.slice(1, -1).trim();
                try {
                  const html = katex.renderToString(math, {
                    displayMode: false,
                    throwOnError: false,
                  });
                  return (
                    <span
                      key={subIndex}
                      className="mx-0.5 inline-block align-middle"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                } catch (e) {
                  console.error('KaTeX inline error:', e);
                  return <code key={subIndex} className="text-rose-500 font-mono text-xs">{subPart}</code>;
                }
              }
              return subPart;
            })}
          </span>
        );
      })}
    </span>
  );
}
