import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-32 px-4 text-center space-y-4">
      <h1 className="text-4xl font-black text-slate-900">404 — Página Não Encontrada</h1>
      <p className="text-slate-500">O endereço solicitado não foi encontrado no servidor Shopyump.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-full text-xs shadow-md inline-block"
      >
        Voltar à Homepage
      </Link>
    </div>
  );
}
