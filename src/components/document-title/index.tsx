// 切换路由重设title

import React from 'react'
import info from 'src/config/intro'

interface IProps {
  title: string
}

export default class DocumentTitle extends React.Component<IProps, {}> {
  setTitle(title: string) {
    if (title) {
      document.title = `${title} | ${info.title}`
    } else {
      document.title = info.title
    }
  }
  componentDidMount() {
    this.setTitle(this.props.title)
  }
  render() {
    return this.props.children
  }
  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.title !== this.props.title) {
      this.setTitle(nextProps.title)
    }
  }
}
