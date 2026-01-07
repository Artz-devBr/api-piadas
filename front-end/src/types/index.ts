export interface Piada {
  id: number;
  pergunta: string;
  resposta: string;
  aprovada: boolean;
  autor?: string;
  justificativa_ia?: string;
}

export interface User {
  id: number;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
