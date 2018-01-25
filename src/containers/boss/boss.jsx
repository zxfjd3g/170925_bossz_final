/*
boss的主路由组件
 */
import React from 'react'
import {connect} from 'react-redux'

import {getUserList} from '../../redux/actions'
import UserList from '../../components/user-list/user-list'

/*
牛人列表路由组件
 */
class Boss extends React.Component {

  componentDidMount() {
    this.props.getUserList('genius')
  }

  render() {
    return <UserList userList={this.props.userList}></UserList>
  }

}

export default connect(
  state => state.chatUser,
  {getUserList}
)(Boss)