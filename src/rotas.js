import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Signup from './signup/signup'
import Signin from './signin/signin'

export default () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/singin" component={Signin} />
                <Route exact path="/singup" component={Signup} />
            </Switch>
        </HashRouter>
    )
}