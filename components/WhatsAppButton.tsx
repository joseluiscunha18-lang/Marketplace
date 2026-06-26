'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export const WhatsAppFloating = ({
  phone = '258840000000',
  message = 'Olá! Vim do Shopyump e gostaria de tirar uma dúvida.',
  label = 'Ajuda no WhatsApp',
}: {
  phone?: string;
  message?: string;
  label?: string;
}) => {
  const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2.5 active:scale-95 transition-all duration-300"
    >
      <MessageSquare className="w-4 h-4 fill-white text-[#25D366]" />
      <span>{label}</span>
    </a>
  );
};
