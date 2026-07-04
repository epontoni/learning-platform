'use client';

import * as React from 'react';

export function MathCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const origin = { x: 0, y: 0 };
    let t = 0;
    const gridSpacing = 60;
    const mouse = { x: 0, y: 0, rawX: 0, rawY: 0, active: false };
    let animationFrameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width * dpr;
      height = canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Position origin in middle-right of canvas for best aesthetics
      origin.x = rect.width * 0.65;
      origin.y = rect.height * 0.5;
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking on the parent element
    const container = canvas.parentElement;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.rawX = e.clientX - rect.left;
      mouse.rawY = e.clientY - rect.top;
      
      // Convert to relative coordinates where center is origin
      mouse.x = mouse.rawX - origin.x;
      mouse.y = origin.y - mouse.rawY; // invert y for standard cartesian coordinate
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Function to get active colors dynamically from CSS variables
    let accentColor = '#5b4bff';
    let gridColor = 'rgba(0, 0, 0, 0.05)';
    let textColor = 'rgba(0, 0, 0, 0.4)';
    let circleColor = 'rgba(0, 0, 0, 0.02)';

    const updateColors = () => {
      if (typeof window !== 'undefined') {
        const style = getComputedStyle(document.body);
        const accentVal = style.getPropertyValue('--accent').trim();
        if (accentVal) accentColor = accentVal;

        const isDark = document.documentElement.classList.contains('dark');
        gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.05)';
        textColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.35)';
        circleColor = isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.02)';
      }
    };

    updateColors();

    // Listen for theme mutations
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Draw loop
    const draw = () => {
      t += 0.015;
      const dpr = window.devicePixelRatio || 1;
      const rectWidth = canvas.width / dpr;
      const rectHeight = canvas.height / dpr;

      ctx.clearRect(0, 0, rectWidth, rectHeight);

      // 1. Draw Grid Lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // Vertical lines
      const startX = origin.x % gridSpacing;
      for (let x = startX; x < rectWidth; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rectHeight);
        ctx.stroke();
      }

      // Horizontal lines
      const startY = origin.y % gridSpacing;
      for (let y = startY; y < rectHeight; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rectWidth, y);
        ctx.stroke();
      }

      // 2. Draw Cartesian Axes
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 1.25;

      // X Axis
      ctx.beginPath();
      ctx.moveTo(0, origin.y);
      ctx.lineTo(rectWidth, origin.y);
      ctx.stroke();

      // Y Axis
      ctx.beginPath();
      ctx.moveTo(origin.x, 0);
      ctx.lineTo(origin.x, rectHeight);
      ctx.stroke();

      // Axes labels
      ctx.fillStyle = textColor;
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Numbers on X Axis
      for (let x = startX; x < rectWidth; x += gridSpacing * 2) {
        const val = Math.round((x - origin.x) / gridSpacing);
        if (val !== 0) {
          ctx.fillText(val.toString(), x, origin.y + 4);
        }
      }

      // Numbers on Y Axis
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let y = startY; y < rectHeight; y += gridSpacing * 2) {
        const val = Math.round((origin.y - y) / gridSpacing);
        if (val !== 0) {
          ctx.fillText(val.toString(), origin.x - 6, y);
        }
      }

      // Origin zero label
      ctx.fillText('0', origin.x - 6, origin.y + 8);

      // 3. Draw Trigonometric Circle (radius = 3 units)
      const circleRadius = gridSpacing * 3;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, circleRadius, 0, Math.PI * 2);
      ctx.fillStyle = circleColor;
      ctx.fill();
      ctx.strokeStyle = document.documentElement.classList.contains('dark')
        ? 'rgba(255,255,255,0.06)'
        : 'rgba(0,0,0,0.08)';
      ctx.stroke();

      // 4. Draw Animated Wave: y = A * sin(B * x - t) * envelope
      ctx.beginPath();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.25;
      
      const wavePoints = [];
      for (let px = -origin.x; px < rectWidth - origin.x; px += 2) {
        const envelope = Math.exp(-Math.pow(px / (rectWidth * 0.45), 2));
        const py = 110 * Math.sin(px / 65 - t) * envelope;
        wavePoints.push({ x: px + origin.x, y: origin.y - py });
      }

      if (wavePoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo(wavePoints[0].x, wavePoints[0].y);
        for (let i = 1; i < wavePoints.length; i++) {
          ctx.lineTo(wavePoints[i].x, wavePoints[i].y);
        }
        ctx.stroke();
      }

      // 5. Draw Tracking Point
      let pxPos = 0;
      let pyPos = 0;

      if (mouse.active) {
        pxPos = mouse.rawX;
        pyPos = mouse.rawY;
      } else {
        // Lissajous curve animation when idle
        const lx = 2.4 * Math.cos(t * 0.4) * gridSpacing;
        const ly = 1.6 * Math.sin(t * 0.9) * gridSpacing;
        pxPos = origin.x + lx;
        pyPos = origin.y - ly;
      }

      // Vector line from origin to point
      ctx.beginPath();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(pxPos, pyPos);
      ctx.stroke();
      ctx.setLineDash([]); // reset line dash

      // Projection lines to X and Y axes
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 4]);

      // X projection
      ctx.beginPath();
      ctx.moveTo(pxPos, pyPos);
      ctx.lineTo(pxPos, origin.y);
      ctx.stroke();

      // Y projection
      ctx.beginPath();
      ctx.moveTo(pxPos, pyPos);
      ctx.lineTo(origin.x, pyPos);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw vector point dot
      ctx.beginPath();
      ctx.arc(pxPos, pyPos, 5, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
      ctx.strokeStyle = textColor;
      ctx.stroke();

      // Write Coordinate details P(x, y)
      const mathX = ((pxPos - origin.x) / gridSpacing).toFixed(2);
      const mathY = ((origin.y - pyPos) / gridSpacing).toFixed(2);

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = pxPos > origin.x ? 'left' : 'right';
      ctx.textBaseline = pyPos > origin.y ? 'top' : 'bottom';

      const offset = 8;
      const labelX = pxPos + (pxPos > origin.x ? offset : -offset);
      const labelY = pyPos + (pyPos > origin.y ? offset : -offset);
      ctx.fillText(`P(${mathX}, ${mathY})`, labelX, labelY);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="mathCanvas"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
