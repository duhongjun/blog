import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from '@axetroy/react-document-title'
import info from 'src/info'

export default class extends Component {
  static propTypes = {
    title: PropTypes.array,
    revert: PropTypes.bool
  }
  render() {
    let title = (this.props.title || []).concat([info.title])
    const props = {
      ...this.props,
      title
    }
    return <DocumentTitle {...props} />
  }
}
