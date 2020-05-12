import React from 'react';
import ReactDOM from 'react-dom';
import Signin from './signin/signin'
import Signup from './signup/signup'
import Notfound from './notfound/notfound'
import Newpwd from './forgot/newpwd'
import Home from './home/home'
import board from './board/board_v'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/register" exact={true} component={Signup} />
      <Route path="/login" exact={true} component={Signin} />
      <Route path='/home' component={Home}/>
      <Route path='/boards/:id' component={board} />
      <Route path="/" exact={true} component={Signin} />
      <Route path='*' component={Notfound} />
    </Switch>
  </ BrowserRouter>,
  document.getElementById('root'));