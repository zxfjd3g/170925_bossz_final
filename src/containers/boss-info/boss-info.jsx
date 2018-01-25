/*
完善boss信息的路由组件
 */
import React from 'react'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import AvatarSelector from '../../components/avatar-selector/avatar-selector'
import {updateUser} from '../../redux/actions'

class BossInfo extends React.Component {

  state = {
    title: '',
    desc: '',
    company: '',
    money: ''
  }

  onChange = (key, val) => {
    this.setState({[key]: val})
  }

  render() {

    const path = this.props.location.pathname
    const redirectTo = this.props.redirectTo

    if (redirectTo && redirectTo !== path) {
      return <Redirect to={redirectTo}></Redirect>
    } else {
      return (
        <div>
          <NavBar mode="dark">BOSS完善信息页</NavBar>
          <AvatarSelector
            selectAvatar={(imgName) => {
              this.setState({avatar: imgName})
            }}
          />
          <InputItem onChange={(v) => this.onChange('title', v)}>
            招聘职位
          </InputItem>
          <InputItem onChange={(v) => this.onChange('company', v)}>
            公司名称
          </InputItem>
          <InputItem onChange={(v) => this.onChange('money', v)}>
            职位薪资
          </InputItem>
          <TextareaItem
            onChange={(v) => this.onChange('desc', v)}
            rows={3}
            autoHeight
            title='职位要求'
          />
          <Button
            onClick={() => {
              this.props.updateUser(this.state)
            }}
            type='primary'>保存</Button>
        </div>
      )
    }
  }
}

export default connect(
  state => state.user,
  {updateUser}
)(BossInfo)