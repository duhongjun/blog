import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import { NavLink, matchPath, withRouter } from 'react-router-dom'
import Octicon from 'react-octicon'
import avatar from 'src/assets/images/ava.jpeg'
import info from 'src/config/intro'

interface INavItem {
  path: string
  name?: string
  title: string
  icon: React.ReactElement<any>
}
interface IProps {
  location: any
  history: any
}
interface IState {
  nav: INavItem[]
}

class Header extends Component<IProps, IState> {
  constructor(props: any) {
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
          path: '/repos',
          title: '开源项目',
          icon: <Octicon name="repo" mega />
        },
        {
          path: '/todos',
          title: 'TODO',
          icon: <Icon type="exception" />
        },
        {
          path: '/gists',
          title: 'Gist',
          icon: <Octicon name="gist" mega />
        },
        {
          path: '/cases',
          title: '案例展示',
          icon: <Icon type="book" />
        },
        {
          path: '/about',
          title: '关于我',
          icon: <Icon type="question-circle" />
        }
      ]
    }
  }

  calcClassName = (nav: INavItem) => {
    const navPath = nav.path
    const pathname = this.props.location.pathname
    const isMatchRoute = matchPath(pathname, {
      path: navPath
    })

    if (pathname === '/') {
      return pathname === navPath ? 'ant-menu-item-selected' : ''
    } else {
      return isMatchRoute && navPath !== '/' ? 'ant-menu-item-selected' : ''
    }
  }

  render() {
    return (
      <div id="header">
        <div className="header__bg" />
        <div className="header__container">
          <div>
            <img className="header__avatar" src={avatar} alt="" />
            <h2>{info.name}</h2>
            <q>{info.motto}</q>
          </div>
        </div>
        <Menu mode="horizontal">
          {this.state.nav.map(nav => (
            <Menu.Item key={nav.path} className={this.calcClassName(nav)}>
              <NavLink to={nav.path}>
                {nav.icon}
                {nav.title}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    )
  }
}
export default withRouter(Header)
