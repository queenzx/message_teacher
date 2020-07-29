const db = require('./index.js');

const Message = db.Message;

// 删
db.del(Message,"5f21375b3d278119a4bebd76",function(err,res){
    console.log(err);
    console.log(res);
});

// 查
// 1) 两个参数
// db.find("model","function");
// 2) 三个参数
// 2-1)
// db.find("model",{name:"a"},"function");
// 2-2)
// db.find("model",{page:2},"function");
// 3) 四个参数
// db.find("model",{name:"a"},{size:6},"function");


// 改
/* var filter = {
    username:"张三"
};
var data = {
    message:"晚上去吃凉皮吗?"
};
db.modify(Message,filter,data,function(err,res){
    console.log(err);
    console.log(res);
}); */

// 增
/* var data = {
    username:"张三",
    message:"我叫张三",
    date:"2020-01-01 12:12:12"
};
db.add(Message,data,function(err){
    console.log(err);
}); */
