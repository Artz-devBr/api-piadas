import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

function App() {
  return (
    // 1. BrowserRouter: O "Pai" que monitora a URL do navegador
    <BrowserRouter>
      
      {/* 2. Routes: Uma lista de regras. Ele escolhe APENAS UMA por vez. */}
      <Routes>
        
        {/* 3. Route: A regra individual */}
        {/* "path" é o endereço, "element" é o que aparece na tela */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Dica: Podemos criar uma rota para página não encontrada (404) depois */}
        <Route path="*" element={
          <h1 className="text-white">404 Página não encontrada</h1>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
