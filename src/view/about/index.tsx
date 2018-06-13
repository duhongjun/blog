import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import { Spin } from 'antd'
import DocumentTitle from 'src/components/document-title'
import { models } from 'src/store'

interface IAboutProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

class About extends Component<IAboutProps, any> {
  render() {
    return (
      <DocumentTitle title="关于我">
        <Spin spinning={!this.props.about}>
          <div className="toolbar-container">
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{
                __html: this.props.about
              }}
            />
          </div>
        </Spin>
      </DocumentTitle>
    )
  }
  componentDidMount() {
    this.props.getAboutMe()
  }
}

const mapState = (state: RematchRootState<models>) => ({
  about: state.about.about
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getAboutMe: () => dispatch.about.getAboutMe()
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(About))
