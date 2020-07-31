const express = require("express");
// 先安装 cnpm i -S express-session
const session = require("express-session");
const app = express();
const { message, checkIsLogin, user } = require('./router');
app.listen(4000);
// 设置试图模板引擎
app.set("view engine","ejs");

app.use(session({
    secret:"aaa",
    resave:false,
    saveUninitialized:true
}));

app.use(express.urlencoded({extended:true}));

app.use(express.static("./public"));

// 访问 / 请求
app.get('/',function(req,res){
    res.redirect('/message');
}); 

// 验证是否已经登录
app.use(checkIsLogin);

// 处理/message开头的请求地址
app.use("/message",message);

// 处理/user开头的请求地址
app.use("/user",user);

/*
不需要登录验证的请求
    登录请求,
    注册请求
*/