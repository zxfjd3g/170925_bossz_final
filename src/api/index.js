/*
应用中所有ajax请求与后台交互的方法
 */
import ajax from './ajax'

// 请求登陆
export const reqRegist = (user) => ajax('/user/register', user, 'POST')
// 请求注册
export const reqLogin = (user) => ajax('/user/login', user, 'POST')
// 更新用户信息
export const reqUpdateUser = (user) => ajax('/user/update', user, 'POST')
// 查看用户信息(根据cookie)
export const reqUserInfo = () => ajax('/user/info')
// 请求获取用户列表
export const reqUserList = (type) => ajax('/user/list', {type})
// 获取所有消息的列表
export const reqMsgs = () => ajax('/user/getmsgs')
// 发送读取了特定消息的请求
export const reqReadMsg = (from) => ajax('/user/readmsg', {from}, 'POST')