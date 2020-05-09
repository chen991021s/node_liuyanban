var mongoose = require('mongoose')
var Schema = mongoose.Schema

//连接数据库
mongoose.connect('mongodb://localhost/user')

var userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cratedate:{//当前时间
        type:Date,
        //这里不要直接写Date.now(),因为会即可调用
        //这里Date.now ，当你去new module时，没有写时间就会调用Date.new方法,使用返回值作为默认值
        default:Date.now
    },
    lastdate:{ //修改评论的时间
        type:Date,
        default:Date.now
    },
    pictrue:{//头像
        type:String,
        default:'/public/img/头像.png'
    },
    jie:{//介绍
        type:String,
        default:''
    },
    sex:{
        type:Number,
        emit:[0,1],
        default:0
    },
    bithday:{//生日
        type:Date
    },
    status:{//状态
        type:Number,
        //0 没有权限
        //1 不可以评论
        //2 不可以登录
        emit:[0,1,2],
        default:0
    }

})

var usermdule = mongoose.model('user',userSchema);

//导出 
module.exports =usermdule
