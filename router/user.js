// 处理/user开头的请求
const router = require('express').Router();
const db = require('../model');
const { encrypt } = require("../model/myMd5.js");
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
        password:encrypt(password)
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

// post 方式的/user/regist,注册请求
router.post('/regist',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    // ==用户名重复的验证==
    var data = {
        username:username,
        password:encrypt(password),
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


// get 方式的/user/logout,退出登录
router.get('/logout',function(req,res){
    // 退出登录实际上就是删除保存的登录信息
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.render('error',{errMsg:"退出失败"});
            return ;
        }
        res.redirect('/');
    });
});

// get 方式的/user/center,跳转到个人中心页面
router.get('/center',function(req,res){
    // 登录的用户名
    var username = req.session.username;
    // 根据用户名获取用户登录的信息
    var filter = {username:username};
    var fields = "username nickname avatar";
    User.find(filter,fields,function(err,user){
        if(err){
            console.log(err);
            res.render("error",{errMsg:"获取数据错误"});
            return ;
        }
        if(user.length==0){
            res.render("error",{errMsg:"获取数据错误"});
            return ;
        }
        res.render("center",{user:user[0]})
    });
});

// get 方式的/user/changePwd,跳转到修改密码的页面
router.get('/changePwd',function(req,res){
    res.render("changePwd");
});

// get 方式的/user/checkPwd,验证原密码是否正确
router.get('/checkPwd',function(req,res){
    // 获取输入的密码
    var password = req.query.password;
    // 查询的条件:当前登录用户,加密后的密码
    var filter = {
        username:username,
        password:encrypt(password)
    };
    // 查询密码是否存在
    db.find(User,filter,function(err,users){
        if(err){
            console.log(err);
            res.send({status:1,msg:"验证失败"});
            return ;
        }
        if(users.length==0){
            // 没有查到数据,密码是错误的
            res.send({status:1,msg:"原密码错误"});
            return ;
        }
        res.send({status:0,msg:"原密码正确"});
    });
});

// post 方式的/user/changePwd,修改数据库中的密码
router.post('/changePwd',function(req,res){
    // 获取当前登录用户的信息
    var username = req.session.username;
    // 获取修改的新密码
    var password = req.body.password;
    // 修改的条件
    var filter = {username:username};
    // 修改的数据
    var data = {
        password:encrypt(password)
    }
    // 修改密码
    db.modify(User,filter,data,function(err,result){
        if(err){
            console.log(err);
            res.render("error",{errMsg:"修改失败"});
        }
        if(result.nModified==0){
            // 修改的为0条
            res.render("error",{errMsg:"新密码与旧密码相同"});
            return ;
        }
        // 修改成功后,重新登录
        req.session.destroy(function(err){
            if(err){
                console.log(err);
                res.send("error",{errMsg:"请退出重新登录"});
                return ;
            }
            res.redirect("/");
        });
        // 修改成功,回到用户中心
        // res.redirect("/user/center");
    });
});

// get 方式的/user/changeNick,修改昵称
router.get('/changeNick',function(req,res){
    // 获取登录的用户名
    var username = req.session.username;
    // 获取新昵称
    var nickname = req.query.nickname;
    var filter = {
        username:username
    };
    var data = {
        nickname:nickname
    };
    db.modify(User,filter,data,function(err,result){
        if(err){
            console.log(err);
            res.send({status:1,msg:"修改失败"});
            return ;
        }
        res.send({status:0,msg:"修改成功"});
    });
});

module.exports = router;