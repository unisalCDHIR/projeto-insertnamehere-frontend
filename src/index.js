import React from 'react';
import ReactDOM from 'react-dom';
import Signin from './signin/signin'
import Signup from './signup/signup'
import Notfound from './notfound/notfound'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/register" exact={true} component={Signup} />
      <Route path="/login" exact={true} component={Signin} />
      <Route path="/forgot" exact={true} component={null} />
      <Route path='*' component={Notfound} />
    </Switch>
  </ BrowserRouter>,
  document.getElementById('root'));