import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from 'src/components/layout'

import Home from '../view/home'
import Posts from '../view/posts'

const RouterConfig = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/posts" exact component={Posts} />
          {/* <Route exact path="/" render={() => <DynamicLoad promise={import('./pages/home')} />} /> */}
          {/* <Route path="/posts" render={() => <DynamicLoad promise={import('./pages/posts')} />} /> */}
          {/* <Route path="/github" render={() => <DynamicLoad promise={import('./pages/github')} />} />
              <Route path="/about" render={() => <DynamicLoad promise={import('./pages/about')} />} />
              <Route path="/post/:number" render={() => <DynamicLoad promise={import('./pages/post')} />} />
              <Route path="/repo/:repo" render={() => <DynamicLoad promise={import('./pages/repo')} />} />
              <Route path="/repo" render={() => <DynamicLoad promise={import('./pages/repos')} />} />
              <Route path="/todo/:number" render={() => <DynamicLoad promise={import('./pages/todo')} />} />
              <Route path="/todo" render={() => <DynamicLoad promise={import('./pages/todos')} />} />
              <Route path="/gist/:id" render={() => <DynamicLoad promise={import('./pages/gist')} />} />
              <Route path="/gist" render={() => <DynamicLoad promise={import('./pages/gists')} />} />
              <Route path="/search" render={() => <DynamicLoad promise={import('./pages/search')} />} />
              <Route path="/case" render={() => <DynamicLoad promise={import('./pages/case')} />} /> */}
        </Switch>
      </Layout>
    </Router>
  )
}

export default RouterConfig
