import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Spin, Col, Row, Card, Tag, Pagination } from 'antd'
import queryString from 'query-string'
import Lightbox from 'react-image-lightbox'
import LazyLoad from 'react-lazyload'
import DocumentTitle from 'src/components/document-title'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import { models } from 'src/store'
import { noScreenshotImg } from 'src/common/constant'
import 'react-image-lightbox/style.css'
import './index.less'

interface ICaseProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

interface ICaseState {
  lightboxImages: any[]
  photoIndex: number
  isOpen: boolean
}

class Case extends Component<ICaseProps, ICaseState> {
  state: ICaseState = {
    lightboxImages: [],
    photoIndex: 0,
    isOpen: false
  }

  // 切页
  changePage = (page: number) => {
    const oldQuery = queryString.parse(this.props.location.search)
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(Object.assign(oldQuery, { page }))
    })
    this.props.getCases({ meta: { ...this.props.meta, page } })
  }

  handleCaseClick = (c: any) => {
    this.setState({
      isOpen: true,
      photoIndex: 0,
      lightboxImages: c.screenshot && c.screenshot.length ? c.screenshot : [noScreenshotImg]
    })
  }

  onCloseRequest = () => {
    this.setState({ isOpen: false, photoIndex: 0 })
  }

  onMovePrevRequest = () => {
    const { photoIndex, lightboxImages } = this.state
    this.setState({
      photoIndex: (photoIndex + lightboxImages.length - 1) % lightboxImages.length
    })
  }

  onMoveNextRequest = () => {
    const { photoIndex, lightboxImages } = this.state
    this.setState({
      photoIndex: (photoIndex + 1) % lightboxImages.length
    })
  }

  render() {
    const { photoIndex, isOpen, lightboxImages } = this.state
    const { meta, cases } = this.props
    return (
      <DocumentTitle title="案例展示">
        <Spin spinning={!cases || !cases.length}>
          <div className="toolbar-container cases-container">
            <LazyLoad height={300} offset={100}>
              <div>
                <h2>案例展示</h2>
                <Row gutter={16}>
                  {cases.map(c => (
                    <Col className="cases-item" md={8} xs={24} key={c.title}>
                      <Card>
                        <div>
                          <div
                            className="cases-item-image"
                            style={{
                              backgroundImage: `url(${
                                c.screenshot && c.screenshot.length ? c.screenshot[0] : noScreenshotImg
                              })`
                            }}
                            onClick={this.handleCaseClick.bind(this, c)}
                          />
                          <div className="cases-item-desc">
                            <h3>
                              {c.homepage ? (
                                <a href={c.homepage} target="_blank">
                                  {c.title}
                                </a>
                              ) : (
                                c.title
                              )}
                            </h3>
                            <div>{c.description.split('\n').map((line: any) => <p key={line}>{line}</p>)}</div>
                            <div>
                              {(c.labels || []).map((label: any) => (
                                <Tag key={label.id} color={'#' + label.color}>
                                  {label.name}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </LazyLoad>
            {isOpen && (
              <Lightbox
                mainSrc={lightboxImages[photoIndex]}
                nextSrc={lightboxImages[(photoIndex + 1) % lightboxImages.length]}
                prevSrc={lightboxImages[(photoIndex + lightboxImages.length - 1) % lightboxImages.length]}
                onCloseRequest={this.onCloseRequest}
                onMovePrevRequest={this.onMovePrevRequest}
                onMoveNextRequest={this.onMoveNextRequest}
              />
            )}
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
  async componentWillMount() {
    const query = queryString.parse(this.props.location.search)
    const { page, per_page } = query
    const meta = {
      ...this.props.meta,
      page: +page || this.props.meta.page,
      perPage: +per_page || this.props.meta.perPage
    }
    this.props.getCases({ meta })
  }
}

const mapState = (state: RematchRootState<models>) => ({
  cases: state.cases.cases,
  meta: state.cases.meta
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getCases: (params: any) => dispatch.cases.getCases(params)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Case))
