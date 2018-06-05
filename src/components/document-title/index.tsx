// 切换路由重设title 

import React from 'react'
import info from 'src/config/intro'

interface IProps {
  title: string
}

export default class DocumentTitle extends React.Component<IProps, {}> {
  setTitle() {
    if (this.props.title) {
      document.title = `${this.props.title} | ${info.title}`
    } else {
      document.title = info.title
    }
  }
  componentDidMount() {
    this.setTitle()
  }
  render() {
    return this.props.children
  }
}
