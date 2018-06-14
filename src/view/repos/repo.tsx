import React, { Component } from 'react'
import { Spin, Tabs, Tag } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Octicon from 'react-octicon'
import { RematchDispatch, RematchRootState } from '@rematch/core'
import moment from 'moment'
import { connect } from 'react-redux'
import DocumentTitle from 'src/components/document-title'
import { REPO_METAS } from 'src/common/constant'
import RepoReadme from './view/readme'
import RepoEvents from './view/events'
import { models } from 'src/store'
import './index.less'

interface IRepoProps
  extends RouteComponentProps<any>,
    Partial<ReturnType<typeof mapState>>,
    Partial<ReturnType<typeof mapDispatch>> {}

const TabPane = Tabs.TabPane

class Repo extends Component<IRepoProps, any> {
  render() {
    const repo = (this.props.repo as any) || {}
    const { readme, events } = this.props
    return (
      <DocumentTitle title={`${repo.name} | 开源项目`}>
        <div className="toolbar-container">
          <Spin spinning={!Object.keys(repo).length || !events.length} delay={0} tip="Loading...">
            <div>
              <h1>
                <a target="_blank" href={repo.html_url}>
                  {repo.name}
                </a>
                &nbsp;
                {REPO_METAS.map(meta => {
                  return (
                    <span
                      key={meta.field}
                      className="mr5"
                      style={{
                        fontSize: '1.4rem'
                      }}
                    >
                      <Octicon
                        className="mr5"
                        name={meta.icon}
                        mega
                        style={{
                          fontSize: '1.4rem'
                        }}
                      />
                      {meta.icon === 'home' ? (
                        <a href={repo.homepage} target="_blank">
                          {repo.homepage}
                        </a>
                      ) : (
                        repo[meta.field]
                      )}
                    </span>
                  )
                })}
              </h1>

              <div className="github-meta">
                <span>{repo.description}</span>
                &nbsp; &nbsp;
                {repo.homepage && (
                  <a href={repo.homepage} target="_blank">
                    {repo.homepage}
                  </a>
                )}
              </div>

              <div className="github-meta">
                <div>
                  {(repo.topics || []).map((topic: any) => {
                    return (
                      <Tag style={{ marginTop: '0.5rem' }} key={topic}>
                        {topic}
                      </Tag>
                    )
                  })}
                </div>
              </div>

              <div className="github-meta">Create at {repo.created_at && moment(repo.created_at).fromNow()}</div>
              <div className="github-meta">Update at {repo.updated_at && moment(repo.updated_at).fromNow()}</div>
            </div>
          </Spin>
          <div>
            <Tabs defaultActiveKey="readme">
              <TabPane tab="项目介绍" key="readme">
                <RepoReadme readme={readme} />
              </TabPane>
              <TabPane tab="最近活动" key="events">
                <RepoEvents events={events} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </DocumentTitle>
    )
  }
  componentWillMount() {
    const { repo } = this.props.match.params
    this.props.getRepo(repo)
  }

  componentWillReceiveProps(nextProp: IRepoProps) {
    const { repo } = nextProp.match.params
    if (repo && repo !== this.props.match.params.repo) {
      this.props.getRepo(repo)
    }
  }
}

const mapState = (state: RematchRootState<models>) => ({
  repo: state.repo.repo,
  readme: state.repo.readme,
  events: state.repo.events
})

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  getRepo: (index: string) => dispatch.repo.getRepo(index)
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Repo))
