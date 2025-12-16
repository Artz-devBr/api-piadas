
import { useState } from 'react'; // Para guardar email e senha
import { useNavigate, Link } from 'react-router-dom'; // Para mudar de página

import api from '../services/api.ts'; // Nossa conexão com o Backend


export function Login() {

  async function handleLogin(evento: React.FormEvent) {
    evento.preventDefault(); // Evita que a página recarregue (padrão do HTML)

    try {
      // 1. Envia os dados para a rota '/login' do backend
      const response = await api.post('/login', {
        email: email,
        senha: senha
      });

      // 2. Se deu certo, o backend devolve o token (response.data.token)
      const token = response.data.token;
      
      // 3. Salvamos esse token no "Bolso" do navegador (LocalStorage)
      // Assim, se ele atualizar a página, continua logado.
      localStorage.setItem('token', token);

      // 4. Redireciona para a página de Admin
      navigate('/admin');

    } catch (erro) {
      alert('Erro no Login! Verifique email e senha.');
      console.error(erro);
    }
  }

   // Variáveis para guardar o texto dos inputs
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const navigate = useNavigate(); // Função para redirecionar o usuário

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      
      {/* Container do Formulário */}
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-700">
        
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Login Admin</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-sm">Email</label>
            <input 
              type="email" 
              placeholder="admin@email.com" 
              value={email} // O valor do input É a variável 'email'
              onChange={(e) => setEmail(e.target.value)} // Quando digitar, atualiza a variável
              className="w-full mt-1 p-3 rounded bg-slate-900 border border-slate-600 text-white focus:border-yellow-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm">Senha</label>
            <input 
              type="password" 
              placeholder="••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full mt-1 p-3 rounded bg-slate-900 border border-slate-600 text-white focus:border-yellow-500 outline-none transition-colors"
            />
          </div>

          <button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold p-3 rounded transition-colors mt-2">
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-slate-500 hover:text-white text-sm transition-colors">
            Voltar para Home
          </Link>
        </div>

      </div>
    </div>
  );
}
