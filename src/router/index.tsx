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
          <Route path="/repos" exact component={DynamicLoad(() => import('../view/repos'))} />} />
          <Route path="/repos/:repo" component={DynamicLoad(() => import('../view/repos/repo'))} />} />
          <Route path="/todos" exact component={DynamicLoad(() => import('../view/todos'))} />} />
          <Route path="/todos/:id" component={DynamicLoad(() => import('../view/todos/todo'))} />} />
          <Route path="/gists" exact component={DynamicLoad(() => import('../view/gists'))} />} />
          <Route path="/gists/:id" component={DynamicLoad(() => import('../view/gists/gist'))} />} />
          <Route path="/cases" component={DynamicLoad(() => import('../view/cases'))} />} />
          {/* <Route path="/search" render={() => <DynamicLoad promise={import('./pages/search')} />} /> */}
        </Switch>
      </Layout>
    </Router>
  )
}

export default RouterConfig
