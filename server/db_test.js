/*
数据库操作的测试模块
 */

// 引入mongoose
const mongoose = require('mongoose')
// 数据库URL
const DB_URL = 'mongodb://localhost:27017/bossz_final'
// 连接数据库
mongoose.connect(DB_URL);
// 得到数据库连接对象
var db = mongoose.connection;
// 绑定连接完成的监听, 输出提示
db.on('connected', function (callback) {
  console.log('-----')
});
// 定义集合的schema(结构)
const userSchema = mongoose.Schema({
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
})
// 创建集合的model(模型)构造函数
const UserModel = mongoose.model('user', userSchema)

// console.log(mongoose.model('user')===UserModel)

// 测试保存
function testSave() {
  const userModel = new UserModel({
    name: '李四',
    pwd: '123',
    type: 'genius'
  })
  userModel.save(function (err, user) {
    console.log('save()', err, user)
  })
}
// testSave()

// 测试查询
function testFind() {
  UserModel.find(function (err, users) {
    console.log('find()', err, users)
  })

  UserModel.findOne({_id: '5a672b5658783729e0d68cf0'}, function (err, user) {
    console.log('findOne()', err, user)
  })
}
// testFind()

// 测试更新
function testUpdate() {
  UserModel.findByIdAndUpdate(
    {_id:'5a672b5658783729e0d68cf0'},
    {name:'李四', pwd: '4567', type: 'genius'},
    function (err, doc) {
      console.log('udpate', err, doc)
    }
  )
}
// testUpdate()

// 测试删除
function testDelete() {
  UserModel.remove({_id: '5a672b5658783729e0d68cf0'}, function (err, doc) {
    console.log('delete()', err, doc)
  })
}
// testDelete()