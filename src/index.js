import React from 'react';
import ReactDOM from 'react-dom';
import Signin from './signin/signin'
import Signup from './signup/signup'
import Notfound from './notfound/notfound'
import Newpwd from './forgot/newpwd'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/register" exact={true} component={Signup} />
      <Route path="/login" exact={true} component={Signin} />
      <Route path="/" exact={true} component={Signin} />
      <Route path="/teste" exact={true} component={Newpwd} />
      <Route path='*' component={Notfound} />
    </Switch>
  </ BrowserRouter>,
  document.getElementById('root'));