import { useEffect, useState } from 'react';
import { Check, LogOut, UserPlus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Piada } from '../types'; // Importando como Type para evitar erro
import { ThemeToggle } from '../components/ThemeToggle';

export function Admin() {
  // Estado para armazenar a lista de piadas pendentes
  const [pendentes, setPendentes] = useState<Piada[]>([]);

  // Estados para o formulário de cadastro de novo admin
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  const { logout } = useAuth(); // Função do nosso Contexto
  const navigate = useNavigate();

  // --- FUNÇÃO 1: Buscar Piadas Pendentes ---
  async function carregarPendentes() {
    try {
      // O token vai automaticamente pelo interceptor do Axios
      const response = await api.get<Piada[]>('/piadas/pendentes');
      setPendentes(response.data);
    } catch (error) {
      console.error('Erro ao carregar piadas', error);
      // Opcional: Se der erro (ex: token expirado), chuta pro login
      // logout();
      // navigate('/login');
    }
  }

  // --- FUNÇÃO 2: Aprovar Piada ---
  async function aprovar(id: number) {
    try {
      await api.put(`/piadas/${id}/aprovar`);

      // Atualiza a lista visualmente (remove a piada que acabou de ser aprovada)
      setPendentes(listaAtual => listaAtual.filter(piada => piada.id !== id));

      alert('Piada aprovada com sucesso! Agora ela aparece na Home.');
    } catch (error) {
      alert('Erro ao aprovar. Verifique se você é admin.');
    }
  }

  // --- FUNÇÃO DELETAR: Deletar Piada ---
  async function deletar(id: number) {
    if (!confirm('Tem certeza que deseja deletar esta piada?')) return;
    try {
      await api.delete(`/piadas/${id}`);
      setPendentes(listaAtual => listaAtual.filter(piada => piada.id !== id));
      alert('Piada deletada com sucesso!');
    } catch (error) {
      alert('Erro ao deletar piada.');
    }
  }

  // --- FUNÇÃO 3: Cadastrar Novo Admin ---
  async function cadastrarUsuario() {
    if (!novoEmail || !novaSenha) return alert("Preencha email e senha");

    try {
      await api.post('/usuarios', { email: novoEmail, senha: novaSenha });
      alert("Novo administrador cadastrado com sucesso!");
      setNovoEmail('');
      setNovaSenha('');
    } catch (error) {
      alert("Erro ao cadastrar. Talvez o email já exista.");
    }
  }

  // --- FUNÇÃO 4: Sair ---
  function handleLogout() {
    logout();
    navigate('/');
  }

  // Carrega as piadas assim que a tela abre
  useEffect(() => {
    carregarPendentes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">

        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">Painel Administrativo</h1>
            <p className="text-slate-400 text-sm mt-1">Gerencie o conteúdo da plataforma</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>

        {/* SEÇÃO 1: Moderação de Piadas */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="bg-yellow-500 w-2 h-6 rounded-full block"></span>
            Piadas Pendentes ({pendentes.length})
          </h2>

          <div className="grid gap-4">
            {pendentes.length === 0 && (
              <div className="bg-slate-800/50 p-8 rounded-xl text-center border border-dashed border-slate-700">
                <p className="text-slate-500 text-lg">Nenhuma piada na fila. Tudo limpo! 🎉</p>
              </div>
            )}

            {pendentes.map(piada => (
              <div key={piada.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:border-slate-500 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-lg text-white mb-1">{piada.pergunta}</p>
                  <p className="text-slate-400 italic">"{piada.resposta}"</p>
                  <p className="text-xs text-slate-500 mt-2">Enviado por: <span className="text-slate-400">{piada.autor || 'Anônimo'}</span></p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => deletar(piada.id)}
                    className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-red-900/50 transition-all transform active:scale-95"
                    title="Deletar Piada"
                  >
                    <Trash size={24} />
                  </button>
                  <button
                    onClick={() => aprovar(piada.id)}
                    className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-green-900/50 transition-all transform active:scale-95"
                    title="Aprovar e Publicar"
                  >
                    <Check size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEÇÃO 2: Cadastro de Usuários */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-400">
            <UserPlus size={24} />
            Cadastrar Novo Administrador
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider">Email</label>
              <input
                type="email"
                placeholder="colega@admin.com"
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                value={novoEmail}
                onChange={e => setNovoEmail(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider">Senha</label>
              <input
                type="password"
                placeholder="Senha segura"
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={cadastrarUsuario}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-indigo-900/50 transition-all active:scale-95 h-[50px]"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
