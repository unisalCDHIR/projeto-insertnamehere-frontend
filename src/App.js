import React from 'react';
import api from './services/api'
import './App.css';

import logo from './assets/trello-logo-blue.svg';

function App() {
  return (
    <div className="container">
      <img src={logo} alt="CDHI"/>
      <div className="content">
        <p>
          Crie suas próprias organizações de <strong>metodologia SCRUM</strong>!
        </p>
        <form>
          <label htmlFor="email">EMAIL *</label>
          <input 
            id="email"
            type="email"
            placeholder="Seu melhor email"
            />
        </form>

        <form>
           <label htmlfor="senha">SENHA *</label>
           <input
             id="senha" 
             type="senha"
             placeholder="Sua senha"
           />
        </form>

        <button className="btn"type="submit">Login</button>
      </div>
    </div>
  );
}

export default App;
