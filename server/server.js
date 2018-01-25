/*
启动服务器的主模块
 */
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const router = require('./appRouter')
const app = express()

const ChatModel = require('./models').getModel('chat')
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', function(socket) {
  console.log('soketio connected')
  // 绑定sendMsg监听, 接收客户端发送的消息
  socket.on('sendMsg', function(data) {
    console.log('sendmsg', data)

    const {from, to, msg} = data
    const chat_id = [from, to].sort().join('_')
    ChatModel.create({chat_id, from, to, content: msg}, function(err, doc) {
      if(!err) {
        console.log('recvMsg', doc._doc)
        // 向客户端发送接收并保存了消息的消息
        io.emit('recvMsg', Object.assign({},doc._doc))
      }
    })
  })
})

app.use(cookieParser()) // 解析cookie数据
app.use(bodyParser.json()) // 解析请求体
app.use(bodyParser.urlencoded({ extended: false })) // 解析请求体
app.use('/user', router)

/*
app.listen(8889, () => {
  console.log('start server at port 8889')
})*/
server.listen(8889, function(){
  console.log('app listening at port 8889')
})
