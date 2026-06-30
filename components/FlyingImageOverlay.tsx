'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';

const RISE_MS = 280;
const FALL_MS = 650;
const HOLD_MS = 1000; // pause at peak before falling so the user can actually see the image

type Phase = 'idle' | 'start' | 'rise' | 'fall';

const getCartIconCenter = (): { x: number; y: number } | null => {
  const cartBtn = document.querySelector('[data-cart-icon]') as HTMLElement | null;
  if (!cartBtn) return null;
  const r = cartBtn.getBoundingClientRect();
  // Skip if the element isn't actually laid out yet (e.g. display:none, 0x0)
  if (r.width === 0 && r.height === 0) return null;
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export const FlyingImageOverlay = () => {
  const { flyingImage, clearFlyingImage } = useCart();
  const [phase, setPhase] = useState<Phase>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Fixed anchor point — the box never moves via left/top, only via `transform`,
  // which sidesteps layout-timing issues entirely.
  const originRef = useRef({ x: 0, y: 0, size: 0 });
  // Offsets (relative to origin) for each phase, computed fresh every run.
  const riseOffsetRef = useRef({ dx: 0, dy: 0 });
  const fallOffsetRef = useRef({ dx: 0, dy: 0 });

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (!flyingImage) {
      setPhase('idle');
      clearTimers();
      return clearTimers;
    }

    const { rect } = flyingImage;
    const size = Math.min(rect.width, rect.height, 170);
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const rawX = rect.left + rect.width / 2 - size / 2;
    const rawY = rect.top + rect.height / 2 - size / 2;
    const originX = Math.min(Math.max(rawX, margin), vw - size - margin);
    const originY = Math.min(Math.max(rawY, margin), vh - size - margin);

    originRef.current = { x: originX, y: originY, size };

    // Rise to a clear, comfortable spot — roughly upper-middle of the screen —
    // instead of barely lifting off where it started (which read as "stuck at the top").
    const riseTargetY = Math.min(originY, vh * 0.42 - size / 2);
    riseOffsetRef.current = { dx: 0, dy: riseTargetY - originY };

    // Fall straight to the cart icon. Re-measure right now (not at some earlier
    // mount time) so layout shifts/scrolling since the click can't throw it off.
    const cartCenter = getCartIconCenter();
    const fallTargetX = cartCenter ? cartCenter.x - size / 2 : vw - size - margin;
    const fallTargetY = cartCenter ? cartCenter.y - size / 2 : vh - size - margin;
    fallOffsetRef.current = { dx: fallTargetX - originX, dy: fallTargetY - originY };

    clearTimers();

    // Mount at the start position first (no transform), then on the next two
    // animation frames switch to 'rise' — the double-rAF guarantees the browser
    // has painted the start state before the transition is asked to animate,
    // which is what was silently failing before.
    setPhase('start');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('rise'));
    });

    timers.current.push(setTimeout(() => setPhase('fall'), RISE_MS + HOLD_MS));
    timers.current.push(
      setTimeout(() => clearFlyingImage(), RISE_MS + HOLD_MS + FALL_MS)
    );

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyingImage]);

  if (!flyingImage || phase === 'idle') return null;

  const { src } = flyingImage;
  const { x: originX, y: originY, size } = originRef.current;

  let dx = 0;
  let dy = 0;
  let scale = 1;
  let opacity = 1;
  let transition = 'none';

  if (phase === 'rise') {
    dx = riseOffsetRef.current.dx;
    dy = riseOffsetRef.current.dy;
    scale = 1.08;
    opacity = 1;
    transition = `transform ${RISE_MS}ms cubic-bezier(0.22,1,0.36,1), opacity ${RISE_MS}ms ease`;
  } else if (phase === 'fall') {
    dx = fallOffsetRef.current.dx;
    dy = fallOffsetRef.current.dy;
    scale = 0.2;
    opacity = 0;
    transition = `transform ${FALL_MS}ms cubic-bezier(0.4,0,0.2,1), opacity ${FALL_MS - 150}ms ease ${150}ms`;
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div
        style={{
          position: 'absolute',
          left: originX,
          top: originY,
          width: size,
          height: size,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity,
          transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
          transition,
          willChange: 'transform, opacity',
        }}
      />
      {phase === 'fall' && (
        <div
          style={{
            position: 'absolute',
            left: originX + dx + size / 2,
            top: originY + dy + size / 2,
            width: 40,
            height: 40,
            marginLeft: -20,
            marginTop: -20,
            borderRadius: '50%',
            border: '2px solid #7c3aed',
            opacity: 0,
            animation: `cartPulse ${FALL_MS}ms ease-out ${FALL_MS - 200}ms forwards`,
          }}
        />
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
