/*
用户列表的UI组件
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Card, WingBlank} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

const Header = Card.Header
const Body = Card.Body

class UserList extends React.Component {

  static propTypes = {
    userList: PropTypes.array.isRequired
  }

  handleClick = user => {
    console.log('click', user)
    this.props.history.push(`/chat/${user._id}`, {name: user.name})
  }

  render() {
    return (
      <div>
        <WingBlank size="lg">
          {this.props.userList.map(v => (
            v.avatar ? (
              <Card key={v._id} onClick={() => this.handleClick(v)}>
                <Header
                  title={v.name}
                  thumb={require(`../../assets/imgs/${v.avatar}.png`)}
                  extra={<span>{v.title}</span>}
                />
                <Body>
                {v.type === 'boss' ? (<div>公司: {v.company}</div>) : null}
                <div>描述: {v.desc}</div>
                {v.type === 'boss' ? (<div>薪资: {v.money}</div>) : null}
                </Body>
              </Card> ) : null
          ))}
        </WingBlank>
      </div>
    )
  }
}

export default withRouter(UserList)