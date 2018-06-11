import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Pagination, Row, Col, Card, Tag, Icon } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import DocumentTitle from 'src/components/document-title'
import CONFIG from 'src/config/config'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import github from 'src/common/github'
import './index.less'

class Posts extends Component<any, any> {
  state = {
    meta: {
      page: 1,
      perPage: 10,
      total: 0
    }
  }

  async getPosts(page, perPage) {
    let posts = this.props.posts || []
    try {
      const res = await github.get(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues`, {
        params: { creator: CONFIG.owner, page, perPage, state: 'open' }
      })

      const link = res.headers.link

      /**
       * Pagination
       * # see detail https://developer.github.com/guides/traversing-with-pagination/
       */
      if (link) {
        const last = link.match(/<([^>]+)>(?=\;\s+rel="last")/)
        const lastPage = last ? last[1].match(/page=(\d+)/)[1] : page
        this.setState({
          meta: {
            ...this.state.meta,
            ...{ page, perPage, total: lastPage * perPage }
          }
        })
      }

      posts = res.data
    } catch (err) {
      console.error(err)
    }

    posts.forEach(post => {
      // 获取第一张图片作为缩略图
      const match = /!\[[^\]]+\]\(([^\)]+)\)/im.exec(post.body)
      if (match && match[1]) {
        post.thumbnails = match[1]
      }
    })

    this.props.setPosts(posts)

    return posts
  }

  changePage(perPage, page) {
    const oldQuery = queryString.parse(this.props.location.search)
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(Object.assign(oldQuery, { page, perPage }))
    })
    this.getPosts(page, perPage)
  }

  render() {
    console.info(this.props)
    return (
      <DocumentTitle title="博客文章">
        <div className={'toolbar-container'}>
          {this.props.posts.map((post, i) => {
            return (
              <Card style={{ margin: '2rem 0' }} className="post-list" key={post.number + '/' + i}>
                <div>
                  <h3 className="post-title">
                    <Link
                      to={`/post/${post.number}`}
                      style={{
                        wordBreak: 'break-word',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {post.title}
                    </Link>
                  </h3>
                </div>
                <div style={{ margin: '0.5rem 0' }}>
                  <span>
                    {(post.labels || []).map(label => {
                      return (
                        <Tag key={label.id} color={'#' + label.color}>
                          {label.name}
                        </Tag>
                      )
                    })}
                  </span>
                </div>
                <div style={{ color: '#9E9E9E', wordBreak: 'break-all' }}>{post.body.slice(0, 500)}...</div>
                <div
                  style={{
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid #e6e6e6'
                  }}
                >
                  {post.user.avatar_url && (
                    <LazyLoad height={44}>
                      <img
                        src={post.user.avatar_url}
                        alt=""
                        style={{
                          width: '4.4rem',
                          height: '4.4rem',
                          borderRadius: '50%',
                          marginRight: '0.5rem',
                          verticalAlign: 'middle'
                        }}
                      />
                    </LazyLoad>
                  )}
                  <div
                    style={{
                      display: 'inline-block',
                      verticalAlign: 'middle'
                    }}
                  >
                    <strong>
                      <Icon
                        type="user"
                        style={{
                          marginRight: '0.5rem'
                        }}
                      />
                      {post.user.login}
                    </strong>
                    <br />
                    <span>
                      <Icon type="calendar" style={{ marginRight: '0.5rem' }} />
                      {moment(new Date(post.created_at)).fromNow()}
                    </span>
                    <br />
                    <span>
                      <Icon type="message" style={{ marginRight: '0.5rem' }} />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}

          {Boolean(this.state.meta.total) && (
            <Row className="text-center">
              <Col span={24} style={{ transition: 'all 1s' }}>
                <Pagination
                  // onChange={page => this.changePage(page, this.state.meta.perPage)}
                  onChange={this.changePage.bind(this, this.state.meta.perPage)}
                  hideOnSinglePage
                  defaultCurrent={this.state.meta.page}
                  defaultPageSize={this.state.meta.perPage}
                  total={this.state.meta.total}
                />
              </Col>
            </Row>
          )}
        </div>
      </DocumentTitle>
    )
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search)
    let { page, perPage } = query
    page = +page || this.state.meta.page
    perPage = +perPage || this.state.meta.perPage
    this.setState({
      meta: {
        ...this.state.meta,
        page: +page,
        perPage: +perPage
      }
    })
    this.getPosts(page, perPage)
  }
}

const mapState = ({ posts }) => ({
  posts: posts.posts
})

const mapDispatch = dispatch => ({
  setPosts: list => dispatch.posts.setPosts(list)
})

// export default connect(
//   mapState,
//   mapDispatch
// )(withRouter(Posts))

export default withRouter(Posts)
