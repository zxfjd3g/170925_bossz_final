/*
对话聊天的路由组件
 */
import React from 'react'
import {connect} from 'react-redux'
import {List, InputItem, NavBar, Icon, Grid} from 'antd-mobile'

import {sendMsg, readMsg} from '../../redux/actions'

const Item = List.Item

class Chat extends React.Component {

  state = {
    text: '',
    isShow: false
  }

  componentWillMount() {
    this.emojis = ['😀', '😂', '😆', '😊', '😍', '🤷', '❤', '😂', '😍', '🔥', '🤔', '😊', '🙄', '😘',
      '😀', '😂', '😆', '😊', '😍', '🤷', '❤', '😂', '😍', '🔥', '🤔', '😊', '🙄', '😘',
      '😀', '😂', '😆', '😊', '😍', '🤷', '❤', '😂', '😍', '🔥', '🤔', '😊', '🙄', '😘']
    this.emojis = this.emojis.map(value => ({text: value}))
    console.log(this.emojis)
  }

  componentDidMount() {
    const from = this.props.match.params.id
    const unread = this.props.location.state
    if (unread) {
      this.props.readMsg(from)
    }
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentWillReceiveProps() {
    console.log('componentWillReceiveProps()')
    this.propsUpdate = true
  }

  componentDidUpdate() {
    if (this.propsUpdate) {
      console.log('ChatList scrollTo')
      window.scrollTo(0, document.body.scrollHeight);
      this.propsUpdate = false
    }
  }

  handleSubmit = () => {
    const from = this.props.user._id
    const to = this.props.match.params.id
    const msg = this.state.text
    this.props.sendMsg({from, to, msg})
    this.setState({text: ''})
  }

  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    if (isShow) {
      // 异步手动派发resize事件
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  render() {
    const userid = this.props.match.params.id
    const users = this.props.chat.users
    if (!users[userid]) {
      return null
    }
    const chatId = [this.props.user._id, userid].sort().join('_')
    const chatMsgs = this.props.chat.chatMsgs.filter(v => {
      return v.chat_id === chatId
    })
    return (
      <div id='chat-page'>
        <div className='stick-top'>
          <NavBar
            mode='dark'
            icon={<Icon type='left'/>}
            onLeftClick={() => {
              this.props.history.goBack()
            }}
          >
            {users[userid].name}
          </NavBar>
        </div>
        <List style={{marginTop: 50, marginBottom: 50}}>
          {chatMsgs.map(msg => {
            const avatar = require(`../../assets/imgs/${users[msg.from].avatar}.png`)
            if (msg.from === userid) {
              return (
                <Item
                  key={msg._id}
                  thumb={avatar}
                >{msg.content}</Item>
              )
            } else {
              return (
                <Item
                  key={msg._id}
                  extra={<img src={avatar}/>}
                  className='chat-me'
                >{msg.content}</Item>
              )
            }
          })}
        </List>

        <div className="am-tab-bar">
          <InputItem
            placeholder="请输入"
            value={this.state.text}
            onChange={v => {
              this.setState({text: v})
            }}
            onFocus={() => {
              this.setState({isShow: false})
            }}
            extra={
              <div>
                <span
                  onClick={this.toggleShow}
                  style={{marginRight: 10}}>😊</span>
                <span onClick={this.handleSubmit}>发送</span>
              </div>
            }
          ></InputItem>

          {
            this.state.isShow ? (
              <Grid
                data={this.emojis}
                columnNum={8}
                carouselMaxRow={4}
                isCarousel={true}
                onClick={(item) => {
                  this.setState({text: this.state.text + item.text})
                }}
              />
            ) : null
          }
        </div>
      </div>
    )
  }
}

export default connect(
  state => state,
  {sendMsg, readMsg}
)(Chat)