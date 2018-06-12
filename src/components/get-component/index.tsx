import React, { Component, ComponentClass } from 'react'
interface IAsyncState {
  component: ComponentClass | null
}
export default function asyncComponent(importComponent: () => Promise<{ default: ComponentClass }>) {
  class AsyncComponent extends Component<any, any> {
    state: IAsyncState = {
      component: null
    }
    async componentDidMount() {
      const { default: component } = await importComponent()
      this.setState({
        component
      })
    }
    render() {
      const C = this.state.component
      return C ? <C {...this.props} /> : null
    }
  }
  return AsyncComponent
}
