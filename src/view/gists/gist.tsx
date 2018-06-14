import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Spin, Tooltip, Icon, message } from 'antd'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import ReactClipboard from '@axetroy/react-clipboard'
import Download from '@axetroy/react-download'
import { prettyBytes } from 'src/common/util'
import DocumentTitle from 'src/components/document-title'
import Comments from 'src/components/comments'
import { models } from 'src/store'

interface IGistProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

function values(obj: any) {
  let result: any[] = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]])
    }
  }
  return result
}

class Gist extends Component<IGistProps, any> {
  onSuccess = () => {
    message.success('Copy Success!')
  }
  onError = () => {
    message.error('Copy Fail!')
  }

  render() {
    const gist = (this.props.gist as any) || {}
    return (
      <DocumentTitle title={`${gist.description} | Gist`}>
        <Spin spinning={!Object.keys(gist).length}>
          <div className="toolbar-container">
            <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>
              {gist.description}
              <Tooltip placement="topLeft" title="编辑此页">
                <a
                  href={`https://gist.github.com/${gist.owner ? gist.owner.login : ''}/${gist.id}/edit`}
                  target="_blank"
                >
                  <Icon type="edit" />
                </a>
              </Tooltip>
            </h2>
            {(values(gist.files) || []).map(file => {
              return (
                <div key={file.filename} style={{ border: '0.1rem solid #ececec', margin: '2rem 0' }}>
                  <h3 style={{ backgroundColor: '#eaeaea', padding: '0.5rem' }}>
                    <span>
                      <Icon type="file" />
                      {file.filename}
                    </span>
                    <span
                      style={{
                        margin: '0 0.5rem'
                      }}
                    >
                      <Download file={file.filename} content={file.content} style={{ display: 'inline' }}>
                        <a href="javascript:">
                          <Icon type="download" />
                          {prettyBytes(file.size || 0)}
                        </a>
                      </Download>
                    </span>
                    <span>
                      <ReactClipboard
                        style={{ cursor: 'pointer' }}
                        value={file.content}
                        onSuccess={this.onSuccess}
                        onError={this.onError}
                      >
                        <Icon type="copy" />Copy
                      </ReactClipboard>
                    </span>
                  </h3>
                  <div
                    className="markdown-body"
                    style={{
                      fontSize: '1.6rem'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: file.html
                    }}
                  />
                </div>
              )
            })}

            <hr className="hr" />
            <Comments type="gist" comments={this.props.comments} id={this.props.match.params.id} />
          </div>
        </Spin>
      </DocumentTitle>
    )
  }
  componentWillMount() {
    this.props.getGist(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProp: IGistProps) {
    const { id } = nextProp.match.params
    if (id && id !== this.props.match.params.id) {
      this.props.getGist(id)
    }
  }
}

const mapState = (state: RematchRootState<models>) => ({
  gist: state.gist.gist,
  comments: state.gist.comments
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getGist: (params: any) => dispatch.gist.getGist(params)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Gist))
