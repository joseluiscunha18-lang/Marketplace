'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';

export const FlyingImageOverlay = () => {
  const { flyingImage } = useCart();
  const [phase, setPhase] = useState<'idle' | 'rise' | 'fall'>('idle');
  const [cartIconPos, setCartIconPos] = useState<{ x: number; y: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (flyingImage) {
      // Find visible cart icon position
      const cartBtns = document.querySelectorAll('[data-cart-icon]');
      let activeCartBtn = cartBtns[0] as HTMLElement | null;
      for (let i = 0; i < cartBtns.length; i++) {
        const btn = cartBtns[i] as HTMLElement;
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && window.getComputedStyle(btn).display !== 'none') {
           activeCartBtn = btn;
           break;
        }
      }
      
      if (activeCartBtn) {
        const r = activeCartBtn.getBoundingClientRect();
        setCartIconPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setPhase('rise');
      timerRef.current = setTimeout(() => setPhase('fall'), 900);
    } else {
      setPhase('idle');
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [flyingImage]);

  if (!flyingImage || phase === 'idle') return null;

  const { rect, src } = flyingImage;
  const size = Math.min(rect.width, rect.height, 120);
  const startX = rect.left + rect.width / 2 - size / 2;
  const startY = rect.top + rect.height / 2 - size / 2;

  const targetX = cartIconPos ? cartIconPos.x - size / 2 : startX;
  const targetY = cartIconPos ? cartIconPos.y - size / 2 : window.innerHeight - 60;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          left: phase === 'fall' ? targetX : startX,
          top: phase === 'fall' ? targetY : phase === 'rise' ? startY - 40 : startY,
          opacity: phase === 'fall' ? 0 : 1,
          transform: phase === 'fall' ? 'scale(0.3)' : phase === 'rise' ? 'scale(1.05)' : 'scale(1)',
          transition:
            phase === 'rise'
              ? 'top 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s ease, opacity 0.25s ease'
              : 'left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease 0.2s, transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
  );
};
