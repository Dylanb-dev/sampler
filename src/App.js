import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import asyncComponent from './AsyncComponent'

const AsyncStart = asyncComponent(() => import('./containers/start'))
const AsyncSearch = asyncComponent(() => import('./containers/search'))
const AsyncPlayer = asyncComponent(() => import('./containers/player'))
const AsyncSave = asyncComponent(() => import('./containers/save'))

const App = ({ childProps }) => (
  <Router>
    <Switch>
      <Route path="/" exact component={AsyncStart} props={childProps} />
      <Route
        path="/callback"
        exact
        component={AsyncSearch}
        props={childProps}
      />
      <Route path="/player" exact component={AsyncPlayer} props={childProps} />
      <Route path="/save" exact component={AsyncSave} props={childProps} />
    </Switch>
  </Router>
)

// eslint-disable-next-line
App.propTypes = {
  // eslint-disable-next-line
  childProps: PropTypes.object.isRequired
}

export default App
