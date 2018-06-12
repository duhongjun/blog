import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Pagination, Row, Col, Card, Tag, Icon } from 'antd'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import moment from 'moment'
import DocumentTitle from 'src/components/document-title'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import { models } from 'src/store'
import './index.less'

interface IPostsProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

class Posts extends Component<IPostsProps, any> {
  // 切换页码
  changePage = (page: number) => {
    const oldQuery = queryString.parse(this.props.location.search)
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(Object.assign(oldQuery, { page }))
    })
    this.props.getPosts({ meta: { ...this.props.meta, page } })
  }

  render() {
    const { posts, meta } = this.props

    return (
      <DocumentTitle title="博客文章">
        <div className="toolbar-container">
          {posts.map((post: any, i: number) => (
            <Card className="posts-list" key={post.number + '/' + i}>
              <h3 className="posts-title">
                <Link to={`/post/${post.number}`}>{post.title}</Link>
              </h3>
              <div>
                {(post.labels || []).map((label: any) => (
                  <Tag key={label.id} color={'#' + label.color}>
                    {label.name}
                  </Tag>
                ))}
              </div>
              <div className="posts-abstract">{post.body.slice(0, 500)}...</div>
              <div className="posts-author">
                {post.user.avatar_url && (
                  <LazyLoad height={44}>
                    <img className="posts-author-avatar" src={post.user.avatar_url} alt="user-avatar" />
                  </LazyLoad>
                )}
                <div className="posts-author-info">
                  <strong>
                    <Icon type="user" />
                    {post.user.login}
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
              </div>
            </Card>
          ))}

          <Row className="posts-pagination">
            <Col span={24}>
              <Pagination
                hideOnSinglePage
                defaultCurrent={meta.page}
                defaultPageSize={meta.perPage}
                total={meta.total}
                onChange={this.changePage}
              />
            </Col>
          </Row>
        </div>
      </DocumentTitle>
    )
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search)
    const { page, perPage } = query
    const meta = {
      ...this.props.meta,
      page: +page || this.props.meta.page,
      perPage: +perPage || this.props.meta.perPage
    }
    this.props.getPosts({ meta })
  }
}

const mapState = (state: RematchRootState<models>) => ({
  posts: state.posts.posts,
  meta: state.posts.meta
  // loading: state.loading.effects.posts.getPosts
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getPosts: (params: any) => dispatch.posts.getPosts(params)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Posts))
