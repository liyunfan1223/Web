var express = require('express');
var router = express.Router();
var mysql = require('../public/javascripts/mysql.js');

router.get('/',function(req,res,next){
    //加/表示从c盘开始 不加/从express4开始
    res.sendfile('public/login.html')
    // res.redirect('/login');
})

router.post('/',function(req,res,next){
    var info=req.body;
    console.log(info);
    //检查账号密码正确性
    var fetchSql="SELECT username,passwords,loginType from login where username='"+info.username
    +"' and passwords='"+info.passwords+"';";
    mysql.query(fetchSql,function(err,results,fields){
        //账号不存在，返回错误
        if (results.length==0){
            console.log('!111')
            res.json({error:1});
        }
        //账号存在
        else{
            //创建账号信息cookie
            let now=results[0];
            res.cookie('username',now.username);
            res.cookie('loginType',now.loginType);
            console.log('!222')
            res.json({error:0});
        }
    })
})

module.exports = router;
