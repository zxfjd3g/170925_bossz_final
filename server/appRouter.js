/*
定义后台处理请求的路由的模块
1. 引入express
2. 得到路由器
3. 注册n个路由
4. 向外暴露路由器
5. 通过 app使用上路由器
 */
// 引入express
const express = require('express')
const md5 = require('blueimp-md5') // 对密码进行md5加密的函数
// 得到路由器
const router = express.Router()
// 引入UserModel
const models = require('./models')
const UserModel = models.getModel('user')
const ChatModel = models.getModel('chat')
const _filter = {'pwd': 0, '__v': 0} // 查询时过滤掉

// 注册的路由
/*
路由回调函数3步
1. 获取请求参数
2. 处理数据(与数据库交互)
3. 返回响应
 */
/*
响应数据结构说明:
  {
    code: 0,
    data: xxx   // 客户端需要显示的数据
  }
  {
    code: 1,
    msg: '错误提示信息'
  }
 */
router.post('/register', function (req, res) {
  //1. 获取请求参数
  const {name, pwd, type} = req.body
  // 2.1. 根据name查询是否存在
  UserModel.findOne({name}, function (err, user) {
    // 3.1. 如果存在返回重名提示响应
    if (user) {
      return res.send({code: 1, msg: '用户名已存在'})
    }
    // 2.2. 保存数据
    const userModel = new UserModel({name, pwd: md5(pwd), type})
    userModel.save(function (err, user) {
      // 3.2. 保存完成后返回成功响应
      const {_id, name, type} = user
      res.cookie('userid', _id) // 向浏览器端传递cookie
      res.json({code: 0, data: {_id, name, type}})
    })
  })
})

// 登陆的路由
router.post('/login', function (req, res) {
  // 1. 获取请求参数
  const {name, pwd} = req.body
  // 2. 根据name/pwd查询得到user
  UserModel.findOne({name, pwd: md5(pwd)}, _filter, function (err, user) {
    // 3.1. 如果user不存在, 返回错误提示响应
    if (!user) {
      return res.json({code: 1, msg: '用户名或密码错误!'})
    }
    // 3.2. 如果user存在, 返回user响应
    res.cookie('userid', _id) // 向浏览器端传递cookie
    res.json({code: 0, data: user})
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

// 向外暴露路由器
module.exports = router