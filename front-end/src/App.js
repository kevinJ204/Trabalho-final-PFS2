import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GerenciarCandidatos from './componentes/GerenciarCandidatos.jsx'
import GerenciarVagas from './componentes/GerenciarVagas.jsx';
import GerenciarInscricoes from './componentes/GerenciarInscricoes.jsx';


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<GerenciarCandidatos />} />
          <Route path="/GerenciarInscricoes" element={<GerenciarInscricoes />} />
          <Route path="/GerenciarVagas" element={<GerenciarVagas />} />
          <Route path="/GerenciarCandidatos" element={<GerenciarCandidatos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
