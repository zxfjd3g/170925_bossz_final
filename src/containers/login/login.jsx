/*
用户登陆的路由组件
 */
import React, {Component} from 'react'
import {List, InputItem, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'

class Login extends Component {

  state = {
    name: '',
    pwd: ''
  }

  toRegister = () => this.props.history.push('/register')

  handleChange = (key, val) => this.setState({[key]: val})

  handleLogin = () => this.props.login(this.state)

  render() {

    const {redirectTo, msg} = this.props
    if (redirectTo) {
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <Logo></Logo>
        <WingBlank>
          <List>
            {msg ? <p className='error-msg'>{msg}</p> : null}
            <InputItem
              onChange={v => this.handleChange('name', v)}
            >用户</InputItem>
            <WhiteSpace/>
            <InputItem
              onChange={v => this.handleChange('pwd', v)}
              type='password'
            >密码</InputItem>
          </List>
          <WhiteSpace/>
          <Button type='primary' onClick={this.handleLogin}>登录</Button>
          <WhiteSpace/>
          <Button onClick={this.toRegister}>还没有账号</Button>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => state.user,
  {login}
)(Login)
