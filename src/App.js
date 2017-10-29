import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import asyncComponent from './AsyncComponent'

const AsyncSearch = asyncComponent(() => import('./containers/search'))
const AsyncPlayer = asyncComponent(() => import('./containers/player'))
const AsyncSave = asyncComponent(() => import('./containers/save'))

export default ({ childProps }) => (
  <Router>
    <Switch>
      <Route path="/" exact component={AsyncSearch} props={childProps} />
      <Route
        path="/callback"
        exact
        component={AsyncPlayer}
        props={childProps}
      />
      <Route path="/save" exact component={AsyncSave} props={childProps} />
    </Switch>
  </Router>
)
