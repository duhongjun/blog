import React, { Component } from 'react'

import DocumentTitle from '../../component/document-title'
import Logo from '../../component/logo'

class Home extends Component {
  state = {
    source: {},
    visible: false
  }
  render() {
    return (
      <DocumentTitle title={['Home']}>
        <div className="toolbar-container">
          <Logo />
        </div>
      </DocumentTitle>
    )
  }
}

export default Home
