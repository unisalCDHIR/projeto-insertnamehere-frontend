import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import signup from './signup/signup'
import signin from './signin/signin'

export default () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/singin" component={signin} />
                <Route exact path="/singup" component={signup} />
            </Switch>
        </HashRouter>
    )
}


