// 处理/user开头的请求
const router = require('express').Router();
const db = require('../model');
const User = db.User;

// /user请求,跳转到登录页面
router.get('/',function(req,res){
    res.redirect('/user/login');
});

// get 方式的/uesr/login,显示登录页面
router.get('/login',function(req,res){
    res.render('login');
});

// post 方式的/user/login,处理登录请求
router.post('/login',function(req,res){
    var body = req.body;
    var username = body.username;
    var password = body.password;
    var remember = body.remember;
    var filter = {
        username:username,
        password:password
    };
    // 到数据库中查询
    db.find(User,filter,function(err,result){
        if(err){
            console.log(err);
            res.render('error',{errMsg:"网络波动,稍后再试"});
            return ;
        }
        if(result.length==0){//没有结果
            res.send("<h1>用户名或密码错误,点击<a href='/user/login'>返回</a></h1>");
            return ;
        }
        // 用户名密码正文,登录成功
        req.session.username = username;
        if(remember){
            req.session.cookie.maxAge = 1000*60*60*24*30;    
        }
        // 登录成功,跳转到留言板页
        res.redirect('/');
    });
});

// get 方式的/user/regist,跳转注册页面
router.get('/regist',function(req,res){
    res.render('regist');
});

// post 方式的/user/check,检查用户是否存在
router.post('/check',function(req,res){
    var username = req.body.username;
    // 检查
    db.find(User,{username:username},function(err,result){
        if(err){
            console.log(err);
            res.send({status:1,msg:"网络错误"});
            return ;
        }
        if(result.length>0){
            res.send({status:1,msg:"用户名已存在"});
        }else{
            res.send({status:0,msg:"用户名可用"});
        }
    });
});

// post 方式的/user/regist,注册请求
router.post('/regist',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    // ==用户名重复的验证==
    var data = {
        username:username,
        password:password,
        nickname:username
    }
    db.add(User,data,function(err){
        if(err){
            console.log(err);
            res.render('error',{errMsg:"网络错误,注册失败"});
            return ;
        }
        // 注册成功,设置登录状态
        req.session.username = username;
        // 跳转到首页
        res.redirect('/');
    });
});



module.exports = router;