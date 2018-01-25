/*
包含多个用于生成新的state的reducer函数的模块
 */
import {combineReducers} from 'redux'
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
import {getRedirectPath} from '../utils'

const initUser = {
  name: '',
  type: '',
  msg: '',
  redirectTo: '',
}

function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {...state, msg: '', redirectTo: getRedirectPath(action.user), ...action.user}
    case ERROR_MSG:
      return {...state, isAuth: false, msg: action.msg}
    case RECEIVE_USER:
      return {...state, redirectTo: getRedirectPath(action.user), ...action.user}
    case LOGOUT:
      return {...initUser}
    default:
      return state
  }
}

const initChatUser = {
  userList: []
}

function chatUser(state = initChatUser, action) {
  switch (action.type) {
    case USER_LIST:
      return {...initChatUser, userList: action.data}
    default:
      return state
  }
}

const initChat = {
  chatMsgs: [],
  users: {},
  unread: 0
}

export function chat(state=initChat, action) {
  switch(action.type) {
    case MSG_LIST:
      return {...state,
        chatMsgs: action.data.msgs,
        users: action.data.users,
        unread: action.data.msgs.filter(v=>!v.read && v.to===action.data.userId).length}
    case MSG_RECV:
      const {msg, userId} = action.data
      const addCount = userId===msg.to ? 1 : 0
      return {...state, chatMsgs: [...state.chatMsgs, action.data.msg], unread: state.unread+addCount}
    case MSG_READ:
      return {...state, chatMsgs:state.chatMsgs.map(msg => ({...msg, read:true})), unread: state.unread-action.data.num}
    default:
      return state
  }
}

export default combineReducers({
  user,
  chatUser,
  chat
})