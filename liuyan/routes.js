var express = require('express')
var User = require('./DBmodule/user')//mongoDB数据库表结构
//密码加密 cnpm i blueimp-md5 -S
var md5 = require('blueimp-md5')

var router = express.Router();

//首页
router.get('/',function(req,res){
    // console.log(req.session.user.username)
    User.find(function(err,data){
        //失败
        if(err){
            return res.status(500).send('404')
        }
        //成功
        res.render('index.html',{
            users : data,
            user:req.session.user
        })
    })
    // res.render('index.html',{
    //     user:req.session.user
    // })
})
//渲染用户设置页面
router.get('/user',function(req,res){
    res.render('user.html')
})
//渲染登录页面
router.get('/login',function(req,res){
    res.render('login.html')
})
//处理登录操作
router.post('/login',function(req,res){
    //获取表单数据
    // console.log(req.body);
    //查询用户，密码是否正确
    //请求响应
    User.findOne({
        username:req.body.username,
        password:md5(md5(req.body.password))
    },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        //在数据库没有查询到了
        if(!user){
            return res.status(200).json({
                err_code:1,
                message:'用户名或密码错误，如果没有用户名请注册'
            })
        }
        //如果用户存在 存值
        req.session.user = user
        res.status(200).json({
            err_code:0,
            message:'登录成功'
        })
    })
})
//渲染注册页面
router.get('/res',function(req,res){
    res.render('res.html')
})
//处理注册操作
router.post('/res',function(req,res){
    //1获取表单提交的数据
    // console.log(req.body)
    //2操作数据库添加
    //3发送响应
    //查询一个，判断是否存在
    User.findOne({
        //数据库用户名或者邮箱等于输入的
        $or:[
            {
                username:req.body.username
            },
            {
                email:req.body.email
            }
        ]
    },function(err,data){
        if(err){//服务端失败
            return  res.status(500).json({
                err_code:500,//500表示失败 ，服务端失败
                message:'服务端错误'
            })
        }
        if(data){//查询成功
            return res.status(200).json({
                err_code:1,//1表示用户名或邮箱已存在，业务错误
                message:'用户名或密码已存在'
            })                       
        }
        //不存在
        //密码加密md5
        req.body.password = md5( md5(req.body.password) )
        //添加
        new User(req.body).save(function(err,user){
            //服务端失败
            if(err){
                return res.status(500).json({
                    err_code:500,//500表示失败，服务端失败
                    message:'服务端错误'
                })
            }
            //注册成功  使用session记录用户登录状态
            req.session.user = user
            //express提供了一个响应方法：json
            //json方法接收对象作为参数，他会自动把对象转为字符串发送给浏览器
            res.status(200).json({
                err_code:0, //0表示添加成功
                message:'okk'
            }) 
        })      
        
    })

})
//async 异步  await 
//async 表示这是一个async函数，await只能用在这个函数里面
// router.post('/res',async function(req,res){
//     try {
//         if(await User.findOne(
//             {username:req.body.username}
//         )){
//             return res.status(200).json({
//                 err_code:1,
//                 message:'用户名已存在'
//             })
//         }
//         if(await User.findOne(
//             {email:req.body.email}
//         )){
//             return res.status(200).json({
//                 err_code:2,
//                 message:'邮箱已存在'
//             })
//         }
//         //密码加密md5
//         req.body.password = md5(md5(req.body.password))

//         //创建用户
//         await new User(req.body).save()

//         res.status(200).json({
//             err_code:0,
//             message:'注册成功'
//         })
//     } catch (error) {
//         res.status(500).json({
//             err_code:500,
//             message:error.message
//         })
//     }
// })

//处理退出操作
router.get('/loginout',function(req,res){
    //清除登录状态
    req.session.user = null
    //重定向到登录页面
    res.redirect('/login')
})

//保存提交数据
router.post('/usershe',function(req,res){
    console.log(req.body)
    new User(req.body).save(function(err,){
        //服务端失败
        if(err){
            return res.status(500).json({
                err_code:500,//500表示失败，服务端失败
                message:'服务端错误'
            })
        }
        //express提供了一个响应方法：json
        //json方法接收对象作为参数，他会自动把对象转为字符串发送给浏览器
        res.status(200).json({
            err_code:0, //0表示添加成功
            message:'okk'
        }) 
    })    
})

module.exports = router