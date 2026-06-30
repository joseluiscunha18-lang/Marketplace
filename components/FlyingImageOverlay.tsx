'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';

const RISE_MS = 280;
const FALL_MS = 650;
const HOLD_MS = 1000; // pause at peak before falling so the user can actually see the image

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
      const findCartIcon = () => {
        const cartBtn = document.querySelector('[data-cart-icon]') as HTMLElement | null;
        if (cartBtn) {
          const r = cartBtn.getBoundingClientRect();
          setCartIconPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          return true;
        }
        return false;
      };

      if (!findCartIcon()) {
        // Element might not be mounted/measured yet on first paint — retry once.
        requestAnimationFrame(() => {
          findCartIcon();
        });
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
  const size = Math.min(rect.width, rect.height, 170);
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

  const fallbackX = (typeof window !== 'undefined' ? window.innerWidth : clampedStartX) - 40;
  const fallbackY = (typeof window !== 'undefined' ? window.innerHeight : 0) - 40;

  const targetX = cartIconPos ? cartIconPos.x - size / 2 : fallbackX - size / 2;
  const targetY = cartIconPos ? cartIconPos.y - size / 2 : fallbackY - size / 2;

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
      {isFalling && cartIconPos && (
        <div
          style={{
            position: 'absolute',
            left: cartIconPos.x,
            top: cartIconPos.y,
            width: 1,
            height: 1,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -20,
              top: -20,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '2px solid currentColor',
              color: '#7c3aed',
              opacity: 0,
              animation: `cartPulse ${FALL_MS}ms ease-out ${FALL_MS - 200}ms forwards`,
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes cartPulse {
          0% { transform: scale(0.4); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
