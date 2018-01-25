/*
用户个人中心路由组件
 */
import React from 'react'
import {connect} from 'react-redux'
import {Result, List, WhiteSpace, Modal} from 'antd-mobile'
import browserCookies from 'browser-cookies'

import {logout} from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class User extends React.Component {

  logout = () => {
    Modal.alert('注销', '确认退出登录吗?', [
      {
        text: '取消',
        onPress: () => console.log('cancel')},
      {
        text: '确认',
        onPress: () => {
          browserCookies.erase('userid')
          this.props.logout()
        }
      }
    ])
  }

  render() {
    const {name, avatar, type, title, desc, money, company} = this.props

    return (
      <div>
        <Result
          img={<img src={require(`../../assets/imgs/${avatar}.png`)} style={{width: 50}} alt="avatar"/>}
          title={name}
          message={type === 'boss' ? company : null}
        />

        <List renderHeader={() => '简介'}>
          <Item multipleLine>
            {title}
            {desc.split('\n').map(v => <Brief key={v}>{v}</Brief>)}
            {money ? <Brief>薪资:{money}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace></WhiteSpace>
        <List>
          <Item onClick={this.logout}>退出登录</Item>
        </List>
      </div>
    )

  }
}

export default connect(
  state => state.user,
  {logout}
)(User)