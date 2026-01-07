import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../types'; // Importe o tipo que definimos

// Criamos o contexto vazio
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializa o estado verificando DIRETAMENTE no localStorage
  // Isso evita que ele comece como 'false' e redirecione antes de checar
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se tiver token, false se não
  });

  function login(token: string) {
    localStorage.setItem('token', token); // Guarda no bolso
    setIsAuthenticated(true); // Avisa o app que logou
  }

  function logout() {
    localStorage.removeItem('token'); // Tira do bolso
    setIsAuthenticated(false); // Avisa o app que deslogou
  }

  return (
    // Disponibiliza essas funções para todos os filhos
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Um atalho (Hook) para usar o contexto mais fácil
export const useAuth = () => useContext(AuthContext);
