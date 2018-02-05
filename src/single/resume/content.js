import React, { Component } from 'react'
import { Row, Col } from 'antd'

class Content extends Component {
  render() {
    const layoutPorps = {
      md: { span: 12 },
      sm: { span: 24 },
      xs: { span: 24 }
    }

    return (
      <Row align="middle" className="content">
        <Col {...layoutPorps}>left</Col>
        <Col {...layoutPorps} className="head__info">
          right
        </Col>
      </Row>
    )
  }
}

export default Content
