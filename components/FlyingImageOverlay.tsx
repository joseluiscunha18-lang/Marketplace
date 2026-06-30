'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';

const RISE_MS = 220;
const FALL_MS = 550;
const HOLD_MS = 120; // brief pause at peak before falling

export const FlyingImageOverlay = () => {
  const { flyingImage, clearFlyingImage } = useCart();
  const [phase, setPhase] = useState<'idle' | 'rise' | 'fall'>('idle');
  const [cartIconPos, setCartIconPos] = useState<{ x: number; y: number } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (flyingImage) {
      // Find cart icon position in bottom nav
      const cartBtn = document.querySelector('[data-cart-icon]') as HTMLElement | null;
      if (cartBtn) {
        const r = cartBtn.getBoundingClientRect();
        setCartIconPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }

      clearTimers();
      setPhase('rise');

      // Kick off "fall" after rise + a brief hold at the peak
      timers.current.push(
        setTimeout(() => setPhase('fall'), RISE_MS + HOLD_MS)
      );
      // Only now, once the fall transition has actually finished, hand
      // control back to CartContext to unmount/clear the flying image.
      timers.current.push(
        setTimeout(() => clearFlyingImage(), RISE_MS + HOLD_MS + FALL_MS)
      );
    } else {
      setPhase('idle');
      clearTimers();
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyingImage]);

  if (!flyingImage || phase === 'idle') return null;

  const { rect, src } = flyingImage;
  const size = Math.min(rect.width, rect.height, 110);
  const margin = 12;

  // Raw position derived from the source element's on-screen rect.
  const rawX = rect.left + rect.width / 2 - size / 2;
  const rawY = rect.top + rect.height / 2 - size / 2;

  // Clamp into the visible viewport so the thumbnail is always visible,
  // even if the source element is scrolled off-screen when "Add to cart"
  // is pressed (e.g. user already scrolled down to the button).
  const clampedStartX = Math.min(
    Math.max(rawX, margin),
    (typeof window !== 'undefined' ? window.innerWidth : rawX) - size - margin
  );
  const clampedStartY = Math.min(
    Math.max(rawY, margin),
    (typeof window !== 'undefined' ? window.innerHeight : rawY) - size - margin
  );

  const targetX = cartIconPos ? cartIconPos.x - size / 2 : clampedStartX;
  const targetY = cartIconPos
    ? cartIconPos.y - size / 2
    : (typeof window !== 'undefined' ? window.innerHeight : 0) - 60;

  const isFalling = phase === 'fall';

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
          left: isFalling ? targetX : clampedStartX,
          top: isFalling ? targetY : clampedStartY - 30,
          opacity: isFalling ? 0 : 1,
          transform: isFalling ? 'scale(0.25)' : 'scale(1.06)',
          transition: isFalling
            ? `left ${FALL_MS}ms cubic-bezier(0.4,0,0.2,1), top ${FALL_MS}ms cubic-bezier(0.55,0,0.85,0.35), opacity ${FALL_MS - 150}ms ease ${150}ms, transform ${FALL_MS}ms cubic-bezier(0.4,0,0.2,1)`
            : `left ${RISE_MS}ms cubic-bezier(0.22,1,0.36,1), top ${RISE_MS}ms cubic-bezier(0.22,1,0.36,1), transform ${RISE_MS}ms ease, opacity ${RISE_MS}ms ease`,
        }}
      />
    </div>
  );
};
