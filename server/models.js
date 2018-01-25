/*
操作数据库的模型模块
 */

// 1. 引入mongoose
const mongoose = require('mongoose')

// 2. 连接数据库
const DB_URL = 'mongodb://localhost:27017/bossz_final'
mongoose.connect(DB_URL)
const db = mongoose.connection
db.on('connected',function(err){
  if(err){
    console.log('连接数据库失败：'+err)
  }else{
    console.log('连接数据库成功！')
  }
})

// 3. 创建集合模型
const models = {
  user:{
    // 用户名
    'name':{type:String, 'require':true},
    // 密码
    'pwd':{type:String, 'require':true},
    // 类型
    'type':{'type':String, 'require':true},
    // 头像
    'avatar':{'type':String},
    // 个人简介或者职位简介
    'desc':{'type':String},
    // 职位名
    'title':{'type':String},
    // 如果你是boss 还有两个字段
    // 公司名称
    'company':{'type':String},
    // 工资
    'money':{'type':String}
  },
  chat: {
    'chat_id': {'type': String, 'require': true},
    'from': {'type': String, 'require': true},
    'to': {'type': String, 'require': true},
    'read': {'type':Boolean, 'require': false},
    'content': {'type': String, 'require': true, 'default': ''},
    'create_time': {'type': Number, 'default': new Date().getTime()}
  }
}
for(let m in models){
  db.model(m, new mongoose.Schema(models[m]))
}

// 4. 向外暴露获取模型的函数
exports.getModel = function(name){
  return db.model(name)
}