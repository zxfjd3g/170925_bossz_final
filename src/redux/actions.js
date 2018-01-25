/*
包含所有action creator函数的模块
 */

import io from 'socket.io-client'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  LOGOUT,
  USER_LIST,
  MSG_LIST,
  MSG_RECV,
  MSG_READ
} from './action-types'
import {
  reqRegist,
  reqLogin,
  reqUpdateUser,
  reqUserInfo,
  reqUserList,
  reqMsgs,
  reqReadMsg
} from '../api'

const socket = io('ws://localhost:8889')

// 认证成功
const authSuccess = user => ({type: AUTH_SUCCESS, user})
// 错误消息
const errorMsg = msg => ({type: ERROR_MSG, msg})

// 异步注册
export const regisger = ({name, pwd, repeatpwd, type}) => {
  if (!name || !pwd || !type) {
    return errorMsg('用户名密码必须输入')
  }
  if (pwd !== repeatpwd) {
    return errorMsg('密码和确认密码不同')
  }
  return async dispatch => {
    const result = await reqRegist({name, pwd, type})
    if (result.code === 0) {
      dispatch(authSuccess({name, pwd, type}))
    } else {
      dispatch(errorMsg(result.msg))
    }
  }
}

// 异步登陆
export const login = ({name, pwd}) => {
  if (!name || !pwd) {
    return errorMsg('用户密码必须输入')
  }
  return async dispatch => {
    const result = await reqLogin({name, pwd})
    if (result.code === 0) {
      dispatch(authSuccess(result.data))
    } else {
      dispatch(errorMsg(result.msg))
    }
  }
}

// 异步更新用户
export const updateUser = user => {
  return async dispatch => {
    const result = await reqUpdateUser(user)
    if (result.code === 0) {
      dispatch(authSuccess(result.data))
    } else {
      dispatch(errorMsg(result.msg))
    }
  }
}

// 接收用户
const receiveUser = user => ({type: RECEIVE_USER, user})
// 异步获取用户信息
export const getUserInfo = () => {
  return async dispatch => {
    const result = await reqUserInfo()
    if (result.code === 0) {
      dispatch(receiveUser(result.data))
    }
  }
}

// 登出
export const logout = () => ({type: LOGOUT})

// 用户列表
const userList = (users) => ({type: USER_LIST, data: users})
// 异步获取用户列表
export const getUserList = (type) => {
  return async dispatch => {
    const result = await reqUserList(type)
    if (result.code === 0) {
      dispatch(userList(result.data))
    }
  }
}

// 消息列表
const msgList = (msgs, users, userId) => ({type: MSG_LIST, data: {msgs, users, userId}})
// 接收消息
const msgRecv = (msg, userId) => ({type: MSG_RECV, data: {msg, userId}})
// 标识查看了消息
const msgRead = (from, to, num) => ({type: MSG_READ, data: {from, to, num}})

// 异步获取消息列表
export const getMsgList = () => {
  return async (dispatch, getState) => {
    const result = await reqMsgs()
    if(result.code===0) {
      const userId = getState().user._id
      dispatch(msgList(result.msgs, result.users, userId))
    }
  }
}
// 异步发送消息
export function sendMsg({from, to, msg}) {
  return dispatch => {
    socket.emit('sendMsg', {from, to, msg})
  }
}
// 异步接收消息
export function recvMsg() {
  console.log('recvMsg()')
  return (dispatch, getState) => {
    if(!socket.recvMsg) {
      socket.on('recvMsg', function (msg) {
        const userId = getState().user._id
        dispatch(msgRecv(msg, userId))
      })
      socket.recvMsg = true
    }
  }
}
// 异步查看了与特定用户的消息
export const readMsg = (from) => {
  return async (dispatch, getState) => {
    const result = await reqReadMsg(from)
    if(result.code===0) {
      const to = getState().user._id
      if(result.data>0) {
        dispatch(msgRead(from, to, result.data))
      }
    }
  }
}