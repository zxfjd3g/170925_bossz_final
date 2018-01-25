/*
使用axios封装的ajax请求方法
 */
import axios from 'axios'
import {Toast} from 'antd-mobile'

export default function ajax(url = '', data = {}, type = 'GET') {
  return new Promise(function (resolve, reject) {

    let promise

    if (type === 'GET') {
      // 准备url query参数数据
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送get请求
      promise = axios.get(url)
    } else {
      // 发送post请求
      promise = axios.post(url, data)
    }

    promise.then(response => {
      resolve(response.data)
    })
      .catch(error => {
        reject(error)
      })
  })
}
let toastShowing = false
// 拦截请求
axios.interceptors.request.use(function (config) {
  console.log('拦截请求')
  if (toastShowing) {
    return config
  }
  Toast.loading('加载中', 0)
  toastShowing = true

  return config
})

// 拦截响应
axios.interceptors.response.use(function (config) {
  console.log('拦截响应')
  if (toastShowing) {
    Toast.hide()
    toastShowing = false
  }
  return config
})
