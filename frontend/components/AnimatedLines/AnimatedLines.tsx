'use client';

import { useEffect, useRef } from 'react';

interface AnimatedLinesProps {
  className?: string;
  opacity?: number;
  density?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseOpacity: number;
  phase: number;
  pulseSpeed: number;
  glowSize: number;
}

export function AnimatedLines({
  className = '',
  opacity = 1,
  density = 1,
}: AnimatedLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let startTime = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const initParticles = () => {
      const targetCount = Math.floor(
        ((width * height) / 12000) * density
      );
      const count = Math.max(30, Math.min(targetCount, 130));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        baseOpacity: Math.random() * 0.4 + 0.5,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        glowSize: Math.random() * 14 + 8,
      }));
    };

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, width, height);

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Gentle drift
        p.vx += (Math.random() - 0.5) * 0.003;
        p.vy += (Math.random() - 0.5) * 0.003;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.5) {
          p.vx = (p.vx / speed) * 0.5;
          p.vy = (p.vy / speed) * 0.5;
        }

        // Mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 150 * 150) {
          const dist = Math.sqrt(dist2) || 1;
          p.vx += (dx / dist) * 0.012;
          p.vy += (dy / dist) * 0.012;
          p.vx = Math.max(-0.8, Math.min(0.8, p.vx));
          p.vy = Math.max(-0.8, Math.min(0.8, p.vy));
        }
      }

      // Lines between nearby particles with glow
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.3;
            ctx.strokeStyle = `rgba(180, 200, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing particles
      for (const p of particles) {
        const twinkle =
          Math.sin(elapsed * p.pulseSpeed + p.phase) * 0.3 + 0.7;
        const currentOpacity = p.baseOpacity * twinkle;
        const currentR = p.r * (0.85 + twinkle * 0.3);

        // Outer halo
        const outerGrad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.glowSize * twinkle
        );
        outerGrad.addColorStop(0, `rgba(160, 190, 255, ${currentOpacity * 0.15})`);
        outerGrad.addColorStop(0.5, `rgba(120, 160, 255, ${currentOpacity * 0.06})`);
        outerGrad.addColorStop(1, 'rgba(80, 130, 255, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowSize * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = outerGrad;
        ctx.fill();

        // Mid glow
        const midGrad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.glowSize * 0.4 * twinkle
        );
        midGrad.addColorStop(0, `rgba(200, 220, 255, ${currentOpacity * 0.5})`);
        midGrad.addColorStop(1, 'rgba(150, 180, 255, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowSize * 0.4 * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = midGrad;
        ctx.fill();

        // Bright core
        const coreGrad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, currentR * 2
        );
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
        coreGrad.addColorStop(0.6, `rgba(200, 220, 255, ${currentOpacity * 0.3})`);
        coreGrad.addColorStop(1, 'rgba(150, 180, 255, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR * 2, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Bright center dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    if (prefersReducedMotion) {
      draw(0);
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}

export default AnimatedLines;
