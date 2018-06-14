import React, { Component } from 'react'
import { Table } from 'antd'
import moment from 'moment'

interface IRepoEventsProps {
  events: any[]
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string) => (
      <a target="_blank" href={`https://github.com/${name}`}>
        {name}
      </a>
    )
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (date: string) => <span>{date && moment(date).fromNow()}</span>
  }
]

class RepoEvents extends Component<IRepoEventsProps, any> {
  render() {
    return (
      <Table
        pagination={false}
        columns={columns}
        dataSource={this.props.events.map((v: any, i: number) => ({
          key: i,
          date: v.created_at,
          name: v.actor.login,
          type: v.type
        }))}
      />
    )
  }
}

export default RepoEvents
