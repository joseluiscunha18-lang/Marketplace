'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';

const RISE_MS = 280;
const HOLD_MS = 1000; // pause at peak before falling so the user can actually see the image
const APPROACH_MS = 500; // travel from the peak down to a thumbnail spot near the cart
const NEAR_HOLD_MS = 220; // brief pause as a thumbnail right next to the cart icon
const ENTER_MS = 260; // final shrink into the cart icon

type Phase = 'idle' | 'start' | 'rise' | 'approach' | 'enter';

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
  const approachOffsetRef = useRef({ dx: 0, dy: 0, size: 0 });
  const enterOffsetRef = useRef({ dx: 0, dy: 0 });

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
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Always start from the center of the screen, at a reasonable fixed
    // size — regardless of where the "add to cart" button sits on the page
    // (top, middle, or bottom). This avoids ever pinning the clone to an
    // edge when the button/image isn't where we'd expect.
    const originX = vw / 2 - size / 2;
    const originY = vh / 2 - size / 2;

    originRef.current = { x: originX, y: originY, size };

    // No extra rise needed — it already starts centered — just a brief
    // pop/settle so it reads as "appearing" before it travels to the cart.
    riseOffsetRef.current = { dx: 0, dy: 0 };

    // Re-measure the cart icon right now (not at some earlier mount time) so
    // layout shifts/scrolling since the click can't throw the landing off.
    const cartCenter = getCartIconCenter();
    const cartX = cartCenter ? cartCenter.x : vw - 32;
    const cartY = cartCenter ? cartCenter.y : vh - 32;

    // Step 1: approach — travel down next to the cart and shrink to a small
    // thumbnail (not yet on top of the icon), so it visibly "arrives" there.
    const approachSize = Math.max(size * 0.32, 36);
    const approachTargetX = cartX - approachSize / 2;
    const approachTargetY = cartY - approachSize / 2 - 26;
    approachOffsetRef.current = {
      dx: approachTargetX - originX,
      dy: approachTargetY - originY,
      size: approachSize,
    };

    // Step 2: enter — from that thumbnail spot, shrink the rest of the way
    // into the cart icon itself and fade out.
    const enterTargetX = cartX - size / 2;
    const enterTargetY = cartY - size / 2;
    enterOffsetRef.current = { dx: enterTargetX - originX, dy: enterTargetY - originY };

    clearTimers();

    // Mount at the start position first (no transform), then on the next two
    // animation frames switch to 'rise' — the double-rAF guarantees the browser
    // has painted the start state before the transition is asked to animate,
    // which is what was silently failing before.
    setPhase('start');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('rise'));
    });

    timers.current.push(setTimeout(() => setPhase('approach'), RISE_MS + HOLD_MS));
    timers.current.push(
      setTimeout(() => setPhase('enter'), RISE_MS + HOLD_MS + APPROACH_MS + NEAR_HOLD_MS)
    );
    timers.current.push(
      setTimeout(
        () => clearFlyingImage(),
        RISE_MS + HOLD_MS + APPROACH_MS + NEAR_HOLD_MS + ENTER_MS
      )
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
  } else if (phase === 'approach') {
    dx = approachOffsetRef.current.dx;
    dy = approachOffsetRef.current.dy;
    scale = approachOffsetRef.current.size / size;
    opacity = 1;
    transition = `transform ${APPROACH_MS}ms cubic-bezier(0.4,0,0.2,1), opacity ${APPROACH_MS}ms ease`;
  } else if (phase === 'enter') {
    dx = enterOffsetRef.current.dx;
    dy = enterOffsetRef.current.dy;
    scale = 0.15;
    opacity = 0;
    transition = `transform ${ENTER_MS}ms cubic-bezier(0.4,0,0.2,1), opacity ${ENTER_MS}ms ease ${ENTER_MS * 0.4}ms`;
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
          transformOrigin: 'center',
          transition,
          willChange: 'transform, opacity',
        }}
      />
      {phase === 'enter' && (
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
            animation: `cartPulse ${ENTER_MS}ms ease-out forwards`,
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
