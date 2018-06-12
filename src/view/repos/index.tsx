import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Pagination, Spin, Card, Tag } from 'antd'
import queryString from 'query-string'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import Octicon from 'react-octicon'
import DocumentTitle from 'src/components/document-title'
import GithubColors from 'src/config/github-colors'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import { models } from 'src/store'
import './index.less'

interface IReposProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

class Repos extends Component<IReposProps, any> {
  // 切页
  changePage = (page: number) => {
    const oldQuery = queryString.parse(this.props.location.search)
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(Object.assign(oldQuery, { page }))
    })
    this.props.getRepos({ meta: { ...this.props.meta, page } })
  }

  render() {
    const { repos, meta } = this.props
    return (
      <DocumentTitle title="开源项目">
        <Spin spinning={!repos || !repos.length}>
          <div className="toolbar-container">
            <Row gutter={8}>
              {repos.map((repo: any, i: number) => {
                return (
                  <Col key={`${repo.owner.login}/${repo.name}/${i}`} lg={8} md={8} sm={12} xs={24}>
                    <Card className="repos-list">
                      <Link to={`/repo/${repo.name}`}>
                        <Octicon name={repo.fork ? 'repo-forked' : 'repo'} mega />
                        {repo.name}
                      </Link>
                      <p className="repos-desc">{repo.description}</p>
                      <div>{(repo.topics || []).map((topic: any) => <Tag key={topic}>{topic}</Tag>)}</div>
                      <div className="repos-info">
                        <span>
                          <span
                            className="repos-language-color"
                            style={{
                              backgroundColor: (GithubColors[repo.language] || {}).color
                            }}
                          />{' '}
                          {repo.language || 'Unknown'}
                        </span>&nbsp;&nbsp;
                        <span>
                          <Octicon name="star" mega /> {repo.watchers_count}
                        </span>&nbsp;&nbsp;
                        <span>
                          <Octicon name="repo-forked" mega /> {repo.forks_count}
                        </span>&nbsp;&nbsp;
                      </div>
                    </Card>
                  </Col>
                )
              })}
            </Row>
            <Row className="repos-pagination">
              <Col span={24}>
                <Pagination
                  hideOnSinglePage
                  current={meta.page}
                  defaultPageSize={meta.perPage}
                  total={meta.total}
                  onChange={this.changePage}
                />
              </Col>
            </Row>
          </div>
        </Spin>
      </DocumentTitle>
    )
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search)
    const { page, per_page } = query
    const meta = {
      ...this.props.meta,
      page: +page || this.props.meta.page,
      perPage: +per_page || this.props.meta.perPage
    }
    this.props.getRepos({ meta })
  }
}

const mapState = (state: RematchRootState<models>) => ({
  repos: state.repos.repos,
  meta: state.repos.meta
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getRepos: (params: any) => dispatch.repos.getRepos(params)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Repos))
