import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import { models } from 'src/store'
import { Spin, Steps, Icon, Tooltip, Tag } from 'antd'
import moment from 'moment'
import DocumentTitle from 'src/components/document-title'
import CONFIG from 'src/config/config'
import { diffTime } from 'src/common/util'

interface ITodoProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

class Todo extends Component<ITodoProps, any> {
  componentWillMount() {
    const { id } = this.props.match.params
    if (id) {
      this.props.getTodo(id)
    }
  }

  async componentWillReceiveProps(nextProps: ITodoProps) {
    const { id } = nextProps.match.params
    if (id && id !== this.props.match.params.id) {
      this.props.getTodo(id)
    }
  }

  render() {
    const todo = (this.props.todo as any) || {}
    return (
      <DocumentTitle title={`${todo.title} | TODO`}>
        <Spin spinning={!Object.keys(todo).length}>
          <div className="toolbar-container">
            {todo.title && (
              <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>
                {todo.title}
                <Tooltip placement="topLeft" title="编辑此页">
                  <a href={`https://github.com/${CONFIG.owner}/${CONFIG.todo_repo}/issues/${todo.id}`} target="_blank">
                    <Icon type="edit" />
                  </a>
                </Tooltip>
              </h2>
            )}
            <Steps
              style={{
                margin: '2rem 0'
              }}
            >
              <Steps.Step
                status="finish"
                title="创建计划"
                description={`${moment(new Date(todo.created_at)).format('YYYY-MM-DD HH:mm:ss')}`}
                icon={<Icon type="book" />}
              />
              <Steps.Step
                status={todo.closed_at ? 'finish' : 'wait'}
                title="进行中"
                description={
                  todo.closed_at
                    ? (() => {
                        const diff = diffTime(+new Date(todo.created_at))(+new Date(todo.closed_at))
                        return `耗时${diff.days ? diff.days + '天' : ''} ${
                          diff.hours || diff.days ? diff.hours + '时' : ''
                        }${diff.minutes || diff.hours ? diff.minutes + '分' : ''}${diff.seconds}秒`
                      })()
                    : '进行中...'
                }
                icon={<Icon type="clock-circle-o" />}
              />
              <Steps.Step
                status={todo.closed_at ? 'finish' : 'wait'}
                title="关闭计划"
                description={todo.closed_at ? `${moment(new Date(todo.closed_at)).format('YYYY-MM-DD HH:mm:ss')}` : ''}
                icon={<Icon type="check" />}
              />
            </Steps>
            <div style={{ margin: '2rem 0' }}>
              {(todo.labels || []).map((label: any) => (
                <Tag key={label.id} color={'#' + label.color}>
                  {label.name}
                </Tag>
              ))}
            </div>
            <div
              className="markdown-body"
              style={{
                fontSize: '1.6rem',
                minHeight: '20rem'
              }}
              dangerouslySetInnerHTML={{
                __html: todo.body_html
              }}
            />
          </div>
        </Spin>
      </DocumentTitle>
    )
  }
}
const mapState = (state: RematchRootState<models>) => ({
  todo: state.todo.todo
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getTodo: (params: string) => dispatch.todo.getTodo(params)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Todo))
