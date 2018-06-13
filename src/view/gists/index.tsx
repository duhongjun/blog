import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin, Row, Col, Pagination } from 'antd'
import queryString from 'query-string'
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import Octicon from 'react-octicon'
import DocumentTitle from 'src/components/document-title'
import { models } from 'src/store'
import './index.less'
interface IGistsProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

class Gists extends Component<IGistsProps, any> {
  // 切页
  changePage = (page: number) => {
    const oldQuery = queryString.parse(this.props.location.search)
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(Object.assign(oldQuery, { page }))
    })
    this.props.getGists({ meta: { ...this.props.meta, page } })
  }

  render() {
    const { gists, meta } = this.props
    return (
      <DocumentTitle title="Gist List">
        <Spin spinning={!gists || !gists.length}>
          <div className="toolbar-container">
            <div style={{ padding: '0 2.4rem' }}>
              <h2 style={{ textAlign: 'center' }}>代码片段</h2>
            </div>
            <ul className="gists-container">
              {gists.map(gist => {
                return (
                  <li key={gist.id}>
                    <NavLink exact={true} to={`/gist/${gist.id}`}>
                      <Octicon name="gist" mega />
                      {gist.description}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
            <Row className="todos-pagination">
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
  async componentDidMount() {
    const query = queryString.parse(this.props.location.search)
    const { page, per_page } = query
    const meta = {
      ...this.props.meta,
      page: +page || this.props.meta.page,
      perPage: +per_page || this.props.meta.perPage
    }
    this.props.getGists({ meta })
  }
}

const mapState = (state: RematchRootState<models>) => ({
  gists: state.gists.gists,
  meta: state.gists.meta
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getGists: (params: any) => dispatch.gists.getGists(params)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Gists))
