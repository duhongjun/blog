/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import Now from '@axetroy/react-now'
import { lazyload } from 'react-lazyload'
import moment from 'moment'

@lazyload({
  height: 200,
  offset: 100,
  once: true
})
class Footer extends Component {
  render() {
    const LAST_UPDATE_TIME = new Date(+process.env.REACT_APP_PUBLISH_DATE)
    return (
      <Row
        className="text-center"
        style={{
          marginTop: '2rem',
          padding: '2rem 0',
          backgroundColor: '#fff'
        }}
      >
        <Col span={24}>
          <p>Copyright © 2018</p>
          <Now>
            {now => {
              return (
                <div>
                  <p>
                    最近更新&nbsp;
                    {moment(LAST_UPDATE_TIME).fromNow()}
                  </p>
                </div>
              )
            }}
          </Now>
          <p>
            Created by{' '}
            <a target="_blank" href="https://github.com/duhongjun">
              duhongjun
            </a>
          </p>
        </Col>
      </Row>
    )
  }
}
export default Footer
