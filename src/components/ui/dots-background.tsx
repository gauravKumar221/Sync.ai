
'use client';
import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function DotsBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Dot {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      color: string;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.baseSize = 1;
        this.size = this.baseSize;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;
        
        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          this.size = this.baseSize + force * 2;
        } else {
          this.size = this.baseSize;
        }
        this.draw();
      }
    }

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    
    const color = `hsl(${primaryColor})`;
    
    const dots: Dot[] = [];
    const spacing = 40;
    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        dots.push(new Dot(x, y, color));
      }
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      dots.forEach(dot => dot.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("absolute inset-0 -z-10", className)} />;
}
