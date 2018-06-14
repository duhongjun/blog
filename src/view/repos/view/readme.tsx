import React from 'react'

interface IReadmeProps {
  readme: string
}

const RepoReadme = (props: IReadmeProps) => (
  <div className="markdown-body" dangerouslySetInnerHTML={{ __html: props.readme }} />
)

export default RepoReadme
