import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin, Tag, Row, Col, Pagination } from 'antd'
import queryString from 'query-string'
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment'
import DocumentTitle from 'src/components/document-title'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import { models } from 'src/store'
import './index.less'

interface ITodosProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

class TodoList extends Component<ITodosProps, any> {
  // 切页
  changePage = (page: number) => {
    const oldQuery = queryString.parse(this.props.location.search)
    this.props.history.push({
      ...this.props.location,
      search: queryString.stringify(Object.assign(oldQuery, { page }))
    })
    this.props.getAllTodos({ meta: { ...this.props.meta, page } })
  }

  render() {
    const { todos, meta } = this.props

    return (
      <DocumentTitle title="TODO List">
        <Spin spinning={!todos || !todos.length}>
          <div className="toolbar-container">
            <div className="todos-label">
              <h2>待办事项</h2>
            </div>
            <ul className="todos-container">
              {todos.map((todo: any, i: number) => (
                <li className="todos-list" key={todo.number + '/' + i}>
                  <NavLink exact={true} to={`/todo/${todo.number}`}>
                    <Tag color={todo.state === 'open' ? 'blue' : 'grey'} className="hidden-xs">
                      {todo.state === 'open' ? <span>&nbsp;Open&nbsp;</span> : <span>Closed</span>}
                    </Tag>
                    <span className="hidden-xs todos-moment">{moment(todo.created_at).format('YY/MM/DD')}</span>
                    <span style={{ color: todo.state !== 'open' ? '#9E9E9E' : 'inherit' }}>{todo.title}</span>
                    <span className="hidden-xs todos-tag">
                      {todo.labels.map((label: any) => (
                        <Tag key={label.id} color={'#' + label.color}>
                          {label.name}
                        </Tag>
                      ))}
                    </span>
                  </NavLink>
                </li>
              ))}
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

  componentDidMount() {
    const query = queryString.parse(this.props.location.search)
    const { page, per_page } = query
    const meta = {
      ...this.props.meta,
      page: +page || this.props.meta.page,
      perPage: +per_page || this.props.meta.perPage
    }
    this.props.getAllTodos({ meta })
  }
}

const mapState = (state: RematchRootState<models>) => ({
  todos: state.todos.todos,
  meta: state.todos.meta
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getAllTodos: (params: any) => dispatch.todos.getAllTodos(params)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(TodoList))
