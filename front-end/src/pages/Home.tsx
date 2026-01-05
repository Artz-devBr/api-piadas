import { useEffect, useState } from 'react';
import { RefreshCw, Send } from 'lucide-react';
import api from '../services/api';
import type { Piada } from '../types';
import { Link } from 'react-router-dom';

export function Home() {
  const [piada, setPiada] = useState<Piada | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para o formulário de envio
  const [novaPergunta, setNovaPergunta] = useState('');
  const [novaResposta, setNovaResposta] = useState('');
  const [novoAutor, setNovoAutor] = useState('');

  async function buscarPiada() {
    setLoading(true);
    try {
      const response = await api.get<Piada>('/piadas');
      setPiada(response.data);
    } catch (error) {
      setPiada(null);
    } finally {
      setLoading(false);
    }
  }

  async function enviarPiada(e: React.FormEvent) {
    e.preventDefault();
    if (!novaPergunta || !novaResposta) return;
    try {
      await api.post('/piadas', { pergunta: novaPergunta, resposta: novaResposta, autor: novoAutor });
      alert('Piada enviada para moderação!');
      setNovaPergunta('');
      setNovaResposta('');
      setNovoAutor('');
    } catch (err) {
      alert('Erro ao enviar.');
    }
  }

  useEffect(() => { buscarPiada(); }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center">
      <nav className="w-full max-w-2xl flex justify-between mb-8">
        <h1 className="text-2xl font-bold text-yellow-500">API - Piadas</h1>
        <Link to="/login" className="text-sm underline hover:text-yellow-500">Área Admin</Link>
      </nav>

      {/* Card da Piada */}
      <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 mb-8">
        {piada ? (
          <div className="space-y-4 text-center">
            <h2 className="text-xl text-slate-300">{piada.pergunta}</h2>
            <p className="text-3xl font-bold text-white animate-pulse">{piada.resposta}</p>
            {piada.autor && <p className="text-sm text-slate-500 mt-4">Por: {piada.autor}</p>}
          </div>
        ) : (
          <p className="text-center text-slate-500">Nenhuma piada disponível no momento.</p>
        )}
        <button onClick={buscarPiada} disabled={loading} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg font-bold flex items-center justify-center gap-2">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          Próxima Piada
        </button>
      </div>

      {/* Formulário de Envio */}
      <form onSubmit={enviarPiada} className="w-full max-w-2xl bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4">Envie sua piada:</h3>
        <input
          placeholder="Seu nome (opcional)"
          className="w-full mb-3 p-3 rounded bg-slate-900 border border-slate-600"
          value={novoAutor} onChange={e => setNovoAutor(e.target.value)}
        />
        <input
          placeholder="Pergunta"
          className="w-full mb-3 p-3 rounded bg-slate-900 border border-slate-600"
          value={novaPergunta} onChange={e => setNovaPergunta(e.target.value)}
        />
        <input
          placeholder="Resposta"
          className="w-full mb-3 p-3 rounded bg-slate-900 border border-slate-600"
          value={novaResposta} onChange={e => setNovaResposta(e.target.value)}
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold flex items-center gap-2">
          <Send size={18} /> Enviar
        </button>
      </form>
    </div>
  );
}
