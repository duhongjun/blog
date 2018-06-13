import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import { Spin, Tag, Icon, Popover } from 'antd'
import moment from 'moment'
import DocumentTitle from 'src/components/document-title'
import { models } from 'src/store'
import Comments from 'src/components/comments'
import './index.less'

interface IPostProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

interface IPostState {
  banner: any
  QRCode: any
}

class Post extends Component<IPostProps, IPostState> {
  state: IPostState = {
    banner:
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528891196674&di=4b00095213b21eafda61bf0da54d1658&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20170609%2F9d0d402285484a2cb210ec3e310f87d6_th.jpg',
    QRCode: null
  }

  render() {
    const { QRCode } = this.state
    const post = (this.props.post as any) || {}
    return (
      <DocumentTitle title={post.title}>
        <Spin spinning={!Object.keys(post).length}>
          <div
            className="post-header"
            style={{
              backgroundImage: `url(${this.state.banner})`
            }}
          >
            <h2>
              {post.title}{' '}
              <span style={{ verticalAlign: 'top' }}>
                {(post.labels || []).map((label: any) => (
                  <Tag key={label.id} color={'#' + label.color}>
                    {label.name}
                  </Tag>
                ))}
              </span>
            </h2>
            <div className="post-header-info">
              {post.user && post.user.avatar_url ? <img src={post.user.avatar_url} alt="" /> : ''}
              <div className="post-header-userinfo">
                <strong>
                  <Icon type="user" />
                  {post && post.user ? post.user.login : ''}
                </strong>
                <br />
                <span>
                  <Icon type="calendar" />
                  {moment(new Date(post.created_at)).fromNow()}
                </span>
                <br />
                <span>
                  <Icon type="message" />
                  {post.comments}
                </span>
              </div>
              <div className="post-header-qrcode">
                <span>
                  <Popover
                    placement="topLeft"
                    title={'在其他设备中扫描二维码'}
                    trigger="click"
                    content={
                      <div className="text-center">
                        {QRCode ? <QRCode value={window.location.href} /> : 'Loading...'}
                      </div>
                    }
                  >
                    <Icon type="qrcode" />
                  </Popover>
                </span>
              </div>
            </div>
          </div>

          <div
            className="markdown-body post-content"
            dangerouslySetInnerHTML={{
              __html: post.filter_html
            }}
          />

          <blockquote>
            <p>注意：</p>
            <p>1. 若非声明文章为转载, 则为原创文章.</p>
            <p>2. 欢迎转载, 但需要注明出处.</p>
            <p>3. 如果本文对您造成侵权，请在文章评论中声明.</p>
          </blockquote>

          <div className="post-comment">
            <Comments type="issues" comments={this.props.comments} id={post.number} />
          </div>
        </Spin>
      </DocumentTitle>
    )
  }
  componentWillMount() {
    const { id } = this.props.match.params

    import('qrcode.react').then(module => {
      this.setState({ QRCode: module })
    })
    if (id) {
      this.props.getPost(id)
      this.props.getIssuesComments(id)
    }
  }

  componentWillReceiveProps(nextProp: IPostProps) {
    const { id } = nextProp.match.params
    if (id && id !== this.props.match.params.id) {
      this.props.getPost(id)
      this.props.getIssuesComments(id)
    }
  }
}

const mapState = (state: RematchRootState<models>) => ({
  post: state.post.post,
  comments: state.post.comments
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getPost: (index: number) => dispatch.post.getPost(index),
  getIssuesComments: (index: number) => dispatch.post.getIssuesComments(index)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Post))
