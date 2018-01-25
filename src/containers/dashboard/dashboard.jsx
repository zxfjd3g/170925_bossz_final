/*
应用面版路由组件
 */

import React from 'react'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'
import {Switch, Route} from 'react-router-dom'
import cookies from 'browser-cookies'

import NavFooter from '../../components/nav-footer/nav-footer'
import Boss from '../boss/boss'
import Genius from '../genius/genius'
import User from '../user/user'
import Msg from '../msg/msg'
import GeniusInfo from '../genius-info/genius-info'
import BossInfo from '../boss-info/boss-info'
import NotFound from '../../components/not-found/not-found'
import Chat from '../chat/chat'
import {getUserInfo, getMsgList, recvMsg} from '../../redux/actions'

class Dashboard extends React.Component {

  navList = [
    {
      path: '/boss',
      text: '牛人',
      icon: 'boss',
      title: '牛人列表',
      component: Boss,
      hide: false
    },
    {
      path: '/genius',
      text: 'boss',
      icon: 'job',
      title: 'BOSS列表',
      component: Genius,
      hide: false
    },
    {
      path: '/msg',
      text: '消息',
      icon: 'msg',
      title: '消息列表',
      component: Msg
    },
    {
      path: '/me',
      text: '我',
      icon: 'user',
      title: '个人中心',
      component: User
    }
  ]

  componentDidMount() {
    const {history, user, getUserInfo} = this.props
    // 判断是否登陆过
    if (cookies.get('userid')) {
      // 判断是否已经拉取用户信息
      if (!user.name) {
        getUserInfo()
      }
    } else {
      history.replace("/login");
    }

    // 获取消息列表
    this.props.getMsgList()
    // 绑定接收消息的监听
    this.props.recvMsg()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.name) {
      this.props.history.replace('/login')
    }
  }

  render() {
    const {location, user, history, chat} = this.props;
    if (!user.type) {
      return null
    } else {
      if (location.pathname === '/') {
        if (user.type === 'boss') {
          history.replace('/boss')
        } else {
          history.replace('/genius')
        }

        return null
      }
    }
    if (user.type === 'genius') {
      this.navList[0].hide = true
    } else if (user.type === 'boss') {
      this.navList[1].hide = true
    }

    const currentNav = this.navList.find(nav => nav.path === location.pathname)
    return (
      <div>
        {currentNav ? <NavBar mode='dard'>{currentNav.title}</NavBar> : null}
        <div>
          <Switch>
            {this.navList.map(v => (
              <Route key={v.path} path={v.path} component={v.component}></Route>
            ))}
            <Route path='/bossinfo' component={BossInfo}></Route>
            <Route path='/geniusinfo' component={GeniusInfo}></Route>
            <Route path='/chat/:id' component={Chat}></Route>
            <Route component={NotFound}/>
          </Switch>
        </div>
        {currentNav ? <NavFooter navList={this.navList} unread={chat.unread}/> : null}
      </div>
    )
  }
}

export default connect(
  state => state,
  {getUserInfo, getMsgList, recvMsg}
)(Dashboard)