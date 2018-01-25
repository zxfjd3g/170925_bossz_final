/*
用户注册的路由组件
 */
import React, {Component} from 'react'
import {List, WingBlank, InputItem, Radio, WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {regisger} from '../../redux/actions'

const RadioItem = Radio.RadioItem

class Register extends Component {

  state = {
    name: '',
    pwd: '',
    repeatpwd: '',
    type: 'genius'
  }

  toLogin = () => this.props.history.replace('/login')

  handleChange = (key, val) => this.setState({[key]: val})

  handleRegister = () => this.props.regisger(this.state)

  render() {

    const {redirectTo, msg} = this.props
    if (redirectTo) {
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <Logo></Logo>
        <WingBlank>
          {msg ? <p className='error-msg'>{msg}</p> : null}
          <List>
            <InputItem
              onChange={val => this.handleChange('name', val)}
            >用户名</InputItem>
            <WhiteSpace/>
            <InputItem
              type='password'
              onChange={val => this.handleChange('pwd', val)}
            >密码</InputItem>
            <WhiteSpace/>
            <InputItem
              type='password'
              onChange={val => this.handleChange('repeatpwd', val)}
            >确认密码</InputItem>
            <WhiteSpace/>
            <RadioItem
              checked={this.state.type == 'genius'}
              onChange={() => this.handleChange('type', 'genius')}
            >
              牛人
            </RadioItem>
            <RadioItem
              checked={this.state.type == 'boss'}
              onChange={() => this.handleChange('type', 'boss')}
            >
              BOSS
            </RadioItem>
            <WhiteSpace/>
            <Button type='primary' onClick={this.handleRegister}>注册 </Button>
            <Button onClick={this.toLogin}>已经有账号</Button>
          </List>
        </WingBlank>

      </div>
    )
  }
}

export default connect(
  state => state.user,
  {regisger}
)(Register)