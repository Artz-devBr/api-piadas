import { useEffect, useState } from 'react';
import { RefreshCw, Send } from 'lucide-react';
import api from '../services/api';
import type { Piada } from '../types';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export function Home() {
  const [piada, setPiada] = useState<Piada | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para o feedback da IA
  const [feedback, setFeedback] = useState<'hidden' | 'visible' | 'fading'>('hidden');

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
      // Inicia a animação de feedback
      setFeedback('visible');
      setTimeout(() => setFeedback('fading'), 3000); // Começa a sumir após 3s
      setTimeout(() => setFeedback('hidden'), 5000); // Some totalmente após 5s (3s + 2s de fade)

      await api.post('/piadas', { pergunta: novaPergunta, resposta: novaResposta, autor: novoAutor });

      setNovaPergunta('');
      setNovaResposta('');
      setNovoAutor('');
    } catch (err) {
      alert('Erro ao enviar.');
      setFeedback('hidden');
    }
  }

  useEffect(() => { buscarPiada(); }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center transition-colors duration-300">
      <nav className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-yellow-500">API - Piadas</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login" className="text-sm underline hover:text-yellow-500 text-slate-600 dark:text-slate-400">Área Admin</Link>
        </div>
      </nav>

      {/* Card da Piada */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 mb-8 transition-colors duration-300">
        {piada ? (
          <div className="space-y-4 text-center">
            <h2 className="text-xl text-gray-700 dark:text-slate-300 transition-colors">{piada.pergunta}</h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse transition-colors">{piada.resposta}</p>
            {piada.autor && <p className="text-sm text-gray-500 dark:text-slate-500 mt-4 transition-colors">Por: {piada.autor}</p>}
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
      <form onSubmit={enviarPiada} className="w-full max-w-2xl bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 relative">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white transition-colors">Envie sua piada:</h3>

        <input
          placeholder="Seu nome (opcional)"
          className="w-full mb-3 p-3 rounded bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          value={novoAutor} onChange={e => setNovoAutor(e.target.value)}
        />
        <input
          placeholder="Pergunta"
          className="w-full mb-3 p-3 rounded bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          value={novaPergunta} onChange={e => setNovaPergunta(e.target.value)}
        />
        <input
          placeholder="Resposta"
          className="w-full mb-3 p-3 rounded bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          value={novaResposta} onChange={e => setNovaResposta(e.target.value)}
        />

        {/* Feedback da IA */}
        {feedback !== 'hidden' && (
          <div className={`mb-2 text-center font-semibold text-indigo-500 dark:text-indigo-400 transition-opacity duration-[2000ms] ${feedback === 'fading' ? 'opacity-0' : 'opacity-100'}`}>
            Piada enviada para a IA analisar!
          </div>
        )}

        <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold flex items-center gap-2">
          <Send size={18} /> Enviar
        </button>
      </form>
    </div>
  );
}
