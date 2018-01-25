/*
应用路由模块
 */
const express = require('express')
const md5 = require('blueimp-md5')
const router = express.Router()

const models = require('./models')
const UserModel = models.getModel('user')
const ChatModel = models.getModel('chat')

const _filter = {'pwd': 0, '__v': 0} // 查询时过滤掉

/*
注册
 */
router.post('/register', function (req, res) {
  // 1. 获取请求参数
  const {name, pwd, type} = req.body
  const {userid} = req.cookies
  console.log('/register', name, pwd, type, userid)
  // 2. 处理
  UserModel.findOne({name}, function (err, doc) {
    if (doc) {
      // 3. 返回响应数据
      return res.json({code: 1, msg: '用户名重复'})
    }

    const userModel = new UserModel({name, type, pwd: md5(pwd)})
    userModel.save(function (err, user) {
      if (err) {
        // 3. 返回响应数据
        return res.json({code: 1, msg: '后端出错了'})
      }

      const {_id, name, type} = user
      // 向浏览器端传递cookie
      res.cookie('userid', _id)
      // 3. 返回响应数据
      return res.json({code: 0, data: {_id, name, type}})
    })
  })
})

/*
登陆
 */
router.post('/login', function (req, res) {
  // 1. 获取请求参数
  const {name, pwd} = req.body
  console.log('/login', name, pwd)
  // 2. 处理
  UserModel.findOne({name, pwd: md5(pwd)}, function (err, user) {
    if (!user) {
      // 3. 返回响应数据
      return res.json({code: 1, msg: '用户名或者密码错误'})
    }

    // 将userid保存到cookie给浏览器
    res.cookie('userid', user._id)
    const {_id, type, avatar, desc, title, company, money} = user
    // 3. 返回响应数据
    return res.json({code: 0, data: {name, _id, type, avatar, desc, title, company, money}})
  })
})

/*
更新用户
 */
router.post('/update', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, msg: '用户未登陆或注册'})
  }

  UserModel.findByIdAndUpdate(userid, req.body, function (err, user) {
    console.log('update()', user)
    const {name, type} = user
    user = Object.assign({}, req.body, {name, type})
    return res.json({code: 0, data: user})
  })
})

/*
根据cookie查询用户
 */
router.get('/info', function (req, res) {
  const {userid} = req.cookies
  if (!userid) {
    return res.json({code: 1})
  }
  console.log('/info', userid)
  UserModel.findOne({_id: userid}, _filter, function (err, user) {
    console.log('/info', user)
    if (user) {
      return res.json({code: 0, data: user})
    } else {
      return res.json({code: 1})
    }
  })
})

/*
查看用户列表
 */
router.get('/list',function(req, res){
  const { type } = req.query
  UserModel.find({type},function(err,users){
    return res.json({code:0, data: users})
  })
})

/*
获取所有交流信息列表
 */
router.get('/getmsgs', function(req, res) {
  const userid = req.cookies.userid

  UserModel.find({}, function (err, userdocs) {
    const users = {}
    userdocs.forEach(user => {
      users[user._id] = {name: user.name, avatar: user.avatar}
    })
    ChatModel.find(
      {'$or':[{from:userid}, {to: userid}]},
      function(err, msgDocs) {
        return res.json({code: 0, msgs: msgDocs, users})
      }
    )
  })
})

/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
  const to = req.cookies.userid
  const from = req.body.from
  ChatModel.update({from, to}, {read: true}, {multi: true}, function (err, doc) {
    console.log(doc)
    console.log('/readmsg', to, from, doc.nModified)
    if(!err) {
      return res.send({code: 0, data: doc.nModified})
    } else {
      return res.send({code: 0, msg: '修改已读状态失败'})
    }
  })
})

module.exports = router