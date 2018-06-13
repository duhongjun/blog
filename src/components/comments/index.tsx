import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'
import moment from 'moment'
import CONFIG from 'src/config/config'
import './index.less'

interface ICommentsProps {
  comments: any[]
  type: string
  id: number
}

class Comments extends Component<ICommentsProps, any> {
  render() {
    const { comments, type, id } = this.props
    return (
      <LazyLoad height={200} offset={100} once>
        <div>
          <h3>
            大牛们的评论:
            <a
              target="_blank"
              href={
                type === 'issues'
                  ? `https://github.com/${CONFIG.owner}/${CONFIG.repo}/issues/${id}`
                  : type === 'gist'
                    ? `https://gist.github.com/${id}`
                    : 'javascript:void 0'
              }
              style={{
                float: 'right'
              }}
            >
              朕有话说
            </a>
          </h3>

          {comments.length ? (
            comments.map((comment: any) => {
              return (
                <div className="comment-item" key={comment.id}>
                  <div className="comment-header">
                    <img src={comment.user.avatar_url} alt="" />
                    &nbsp;&nbsp;
                    <strong
                      style={{
                        color: '#586069'
                      }}
                    >
                      <a target="_blank" href={`https://github.com/${comment.user.login}`}>
                        {comment.user.login}
                      </a>
                    </strong>
                    &nbsp;&nbsp;
                    <span>
                      {' '}
                      {`commented at ${moment(comment.created_at).fromNow()}`}
                      &nbsp;&nbsp;
                      {`updated at ${moment(comment.updated_at).fromNow()}`}
                    </span>
                  </div>
                  <div className="comment-body">
                    <div
                      className="markdown-body"
                      dangerouslySetInnerHTML={{
                        __html: comment.body_html
                      }}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <div>
              <p>还没有人评论哦，赶紧抢沙发!</p>
            </div>
          )}
        </div>
      </LazyLoad>
    )
  }
}
export default Comments
