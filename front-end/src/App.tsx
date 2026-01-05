import React from 'react'; // Adicione esta importação no topo
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

import Snowfall from 'react-snowfall';

import { AuthProvider, useAuth } from './context/AuthContext'; // <--- Importe o Provider
import { ThemeProvider } from './context/ThemeContext';
import { Admin } from './pages/Admin';

// --- O COMPONENTE PORTEIRO ATUALIZADO ---
// Usamos React.ReactNode que é o padrão atual
function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Como children pode ser ReactNode, precisamos garantir o retorno como JSX
  return <>{children}</>;
}

function App() {
  return (
    // 1. BrowserRouter: O "Pai" que monitora a URL do navegador
    <BrowserRouter>
      <Snowfall color="white" />
      <ThemeProvider>
        <AuthProvider>
          {/* 2. Routes: Uma lista de regras. Ele escolhe APENAS UMA por vez. */}
          <Routes>

            {/* 3. Route: A regra individual */}
            {/* "path" é o endereço, "element" é o que aparece na tela */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* 3. A rota Admin agora fica DENTRO do Porteiro */}
            <Route
              path="/admin"
              element={
                <RotaProtegida>
                  <Admin />
                </RotaProtegida>
              }
            />

            {/* Dica: Podemos criar uma rota para página não encontrada (404) depois */}
            <Route path="*" element={
              <h1 className="text-white">404 Página não encontrada</h1>
            } />

          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter >
  );
}

export default App;
