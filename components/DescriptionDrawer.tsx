'use client';

import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface DescriptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const DescriptionDrawer: React.FC<DescriptionDrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const thresholdRef = useRef(100); // pixels para considerar "swipe down"

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // Só permite deslizar para baixo
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);

    // Se deslizou mais de 100px para baixo, fecha
    if (translateY > thresholdRef.current) {
      onClose();
      setTranslateY(0);
    } else {
      // Volta à posição original com animação
      setTranslateY(0);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    onClose();
    setTranslateY(0);
  };

  // Impedir body scroll quando drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={handleBackdropClick}
    >
      {/* Backdrop com fade in/out */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          translateY > 0 ? 'opacity-10' : 'opacity-30'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleBackdropClick();
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]"
        style={{
          transform: `translateY(${Math.max(0, translateY)}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle Bar - indicador visual de deslize */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Header com título e botão fechar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-5 py-6 space-y-4"
        >
          {/* Descrição com melhor legibilidade */}
          <div className="space-y-4">
            <p className="text-[15px] leading-7 text-slate-700 font-medium whitespace-pre-wrap">
              {description}
            </p>

            {/* Divider */}
            <div className="h-px bg-slate-100 my-4" />

            {/* Dicas adicionais */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
              <h3 className="text-[13px] font-bold uppercase tracking-wide text-slate-700">
                💡 Dica útil
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Lê completamente a descrição do produto e confirma que atende às tuas necessidades antes de fazer o pedido.
              </p>
            </div>
          </div>
        </div>

        {/* Footer com instruções de deslize */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white rounded-t-3xl flex items-center justify-center gap-2">
          <ChevronDown className="w-4 h-4 text-slate-400 animate-bounce" />
          <span className="text-xs text-slate-500 font-medium">Desliza para fechar</span>
        </div>
      </div>
    </div>
  );
};
