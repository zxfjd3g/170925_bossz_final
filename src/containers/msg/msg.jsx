/*
对话消息列表组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

class Msg extends Component {

  render() {
    const userId = this.props.user._id
    const chatUsers = this.props.chat.users

    const msgGroup = {}
    this.props.chat.chatMsgs.forEach(msg => {
      msgGroup[msg.chat_id] = msgGroup[msg.chat_id] || []
      msgGroup[msg.chat_id].push(msg)
    })
    const chatList = Object.values(msgGroup).sort((a, b) => {
      const aLast = a[a.length - 1].create_time
      const bLast = b[b.length - 1].create_time
      return bLast - aLast
    })
    console.log(chatList)
    return (
      <div>
        <List>
          {
            chatList.map(chatItem => {
              const lastMsg = chatItem[chatItem.length - 1]
              const targetId = lastMsg.from === userId ? lastMsg.to : lastMsg.from
              const targetUer = chatUsers[targetId]
              const unread = chatItem.reduce(
                (total, msg) => total + (!msg.read && msg.to === userId ? 1 : 0), 0)

              return (
                <Item
                  key={lastMsg._id}
                  extra={<Badge text={unread}/>}
                  thumb={require(`../../assets/imgs/${targetUer.avatar}.png`)}
                  arrow='horizontal'
                  onClick={() => {
                    this.props.history.push(`/chat/${targetId}`, unread)
                  }}
                >
                  {lastMsg.content}
                  <Brief>{targetUer.name}</Brief>
                </Item>
              )
            })
          }
        </List>
      </div>
    )
  }
}

export default connect(
  state => state
)(Msg)