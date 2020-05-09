var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')  //中间件
var session = require('express-session') //中间件
var router = require('./routes')

var app = express()

//开放静态资源
//path.join拼接路径
//__dirname目前文件的目录名
app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/views/',express.static(path.join(__dirname,'./views/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

//配置模板引擎 npm install express-art-template art-template -S
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/'))//默认就是views,如果想修改可以改

//配置post请求body-parser npm install body-parser -S
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//在express中默认不支持session和Cookie
//但是我们可以使用第三方中间件：express-session来解决
//配置express-session npm install express-session -S
//通过req.session 来访问和设置session成员
//添加session数据  req.session.foo = 'bar'
//访问session数据 req.session.foo
app.use(session({
    secret:'keyboard cat', //加密字符串，增加安全性，安全性高
    resave:false,
    saveUninitialized:true //无论你是否使用session我都默认分配一把钥匙
}))

//挂载路由
app.use(router);

app.listen(8000,function(){
    console.log('running....')
})