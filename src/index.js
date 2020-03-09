/*
import React from 'react';
import ReactDOM from 'react-dom';
import Rotas from './rotas';
import { BrowserRouter } from 'react-router-dom'


ReactDOM.render(
  <BrowserRouter>
    <Rotas />
  </BrowserRouter>,
  document.getElementById('root')
);
*/

import React from 'react';
import ReactDOM from 'react-dom';
import Signin from './signin/signin'
import Signup from './signup/signup'

ReactDOM.render(<Signin/>, document.getElementById('root'));
