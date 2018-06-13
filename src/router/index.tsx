import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from 'src/components/layout'
import DynamicLoad from 'src/components/get-component'
import Home from '../view/home'

const RouterConfig = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/posts" exact component={DynamicLoad(() => import('../view/posts'))} />
          <Route path="/posts/:id" component={DynamicLoad(() => import('../view/posts/post'))} />
          <Route path="/repos" component={DynamicLoad(() => import('../view/repos'))} />} />
          <Route path="/todos" component={DynamicLoad(() => import('../view/todos'))} />} />
          <Route path="/gists" component={DynamicLoad(() => import('../view/gists'))} />} />
          <Route path="/cases" component={DynamicLoad(() => import('../view/cases'))} />} />
          {/* <Route path="/post/:number" render={() => <DynamicLoad promise={import('./pages/post')} />} />
          <Route path="/repo/:repo" render={() => <DynamicLoad promise={import('./pages/repo')} />} />
          <Route path="/todo/:number" render={() => <DynamicLoad promise={import('./pages/todo')} />} />
          <Route path="/gist/:id" render={() => <DynamicLoad promise={import('./pages/gist')} />} />
          <Route path="/search" render={() => <DynamicLoad promise={import('./pages/search')} />} /> */}
        </Switch>
      </Layout>
    </Router>
  )
}

export default RouterConfig
