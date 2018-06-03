import React, { Component } from 'react'
import DocumentTitle from 'src/components/document-title'
import Logo from 'src/components/home-logo'

class Home extends Component {
  state = {
    source: {},
    visible: false
  }
  render() {
    return (
      <DocumentTitle title="Home">
        <Logo />
      </DocumentTitle>
    )
  }
}

export default Home
