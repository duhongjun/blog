/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { NavLink, matchPath, withRouter } from 'react-router-dom'
import Octicon from 'react-octicon'
import avatar from 'src/assets/images/ava.jpeg'
import info from 'src/info'
import './index.css'

class Header extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      nav: [
        { path: '/', name: 'home', title: 'Home', icon: <Icon type="home" /> },
        {
          path: '/posts',
          title: '博客文章',
          icon: <Octicon name="book" mega />
        },
        {
          path: '/repo',
          title: '开源项目',
          icon: <Octicon name="repo" mega />
        },
        {
          path: '/todo',
          title: 'TODO',
          icon: <Icon type="exception" />
        },
        // {
        //   path: '/gist',
        //   title: 'Gist',
        //   icon: <Octicon name="gist" mega />
        // },
        {
          path: '/github',
          title: 'Github',
          icon: <Octicon name="mark-github" mega />
        },
        // {
        //   path: '/case',
        //   title: '案例展示',
        //   icon: <Icon type="book" />
        // },
        {
          path: '/about',
          title: '关于我',
          icon: <Icon type="question-circle" />
        }
      ].filter(v => v)
    }
  }

  render() {
    const pathname = this.props.location.pathname
    const navClassName = 'ant-menu-item-selected'
    return (
      <div
        id="header"
        style={{
          position: 'relative'
        }}
      >
        <div
          className="blur"
          style={{
            width: '100%',
            height: '20rem',
            backgroundImage:
              'url(https://user-images.githubusercontent.com/9758711/35051962-65350bb6-fbe1-11e7-91e3-c79da2cb5e73.jpg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'inherit',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            textAlign: 'center',
            color: '#fff',
            width: '100%',
            height: '100%'
          }}
        >
          <div
            style={{
              marginTop: '3rem'
            }}
          >
            <img
              style={{
                width: '10rem',
                borderRadius: '50%'
              }}
              className="jumpClass"
              src={avatar}
              alt=""
            />
            <h2>
              <span style={{ color: '#fff' }}>{info.name}</span>
            </h2>
            <q>{info.motto}</q>
          </div>
          <div
            style={{
              float: 'right',
              marginRight: '2rem'
            }}
          >
            <Icon
              type="search"
              style={{
                fontSize: '3rem',
                color: '#fff',
                cursor: 'pointer',
                border: '1px solid #64ceaa',
                borderRadius: '50%',
                backgroundColor: '#64ceaa',
                padding: '0.5rem'
              }}
              onClick={() => {
                this.props.history.push({
                  ...this.props.location,
                  pathname: '/search'
                })
              }}
            />
          </div>
        </div>
        <Menu mode="horizontal">
          {this.state.nav.map(nav => {
            return (
              <Menu.Item
                key={nav.path}
                className={(() => {
                  const navPath = nav.path
                  const isMatchRoute = matchPath(pathname, {
                    path: navPath
                  })
                  if (pathname === '/') {
                    return pathname === navPath ? navClassName : ''
                  } else {
                    return isMatchRoute && navPath !== '/' ? navClassName : ''
                  }
                })()}
              >
                <NavLink
                  to={nav.path}
                  style={{
                    fontSize: '1.4rem'
                  }}
                >
                  {nav.icon ? nav.icon : ''}
                  {nav.title}
                </NavLink>
              </Menu.Item>
            )
          })}
        </Menu>
      </div>
    )
  }
}
export default withRouter(Header)
