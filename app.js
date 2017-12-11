const express= require('express');
const  path = require('path');
const bodyParser=require('body-parser');
const mysql =require('mysql');
let app=express();

//配置中间件
app.use(bodyParser.urlencoded({
extend:true
}));

//创建数据库连接池
let pool=mysql.createPool({
    // connectionlimit:10;
    user:'root'
})
//主页
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/views/default.html'));
})
//登录
app.get('/sign-in',(req,res)=>{
    res.sendFile(path.join(__dirname+'/views/sign-in.html'))
});
//注册
app.get('/sign-up',(req,res)=>{
    res.sendFile(path.join(__dirname+'/views/sign-up.html'))
});
app.post('/signUp',(req,res)=>{
    let uname=req.body.uname;
    let upwd=req.body.upwd;
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        connection.query('INSERT INTO db_demo.user VALUES(NULL,?,?)',[uname,upwd],(err,result,fields)=>{
            if(err) throw err;
            if(result.affectedRows==1){
                res.sendFile(path.join(__dirname+'/views/sign-in.html'));
            }else{
                res.sendFile(path.join(__dirname+'/views/sign-up.html'));
            }
            connection.release();
        });
    });
});
app.post('/signIn',(req,res)=>{
    let uname=req.body.uname;
    let upwd=req.body.upwd;
    res.send(uname+"-"+upwd);
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        connection.query('SELECT * FROM db_demo.user WHERE uname=? and upwd=?',[uname,upwd],(err,result,fields)=>{
            if(err) throw err;
            console.log(result.affectedRows);
            if(result.length === 1){
                console.log("登录成功")
            }else{
                console.log("用户名或者密码错误");
            }
            connection.release();
        });
    });
});

app.listen(80);