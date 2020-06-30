var express = require('express');
var router = express.Router();
var mysql = require('../public/javascripts/mysql');

router.get('/',function(req,res,next){
    res.sendfile('public/register.html');
});

router.post('/',function(req,res,next){
    var info=req.body;
    console.log(info);
    //正则表达式，检验字符串是否只由数字、字母和下划线组成
    var exp=/^\w+$/;
    var tip1='',tip2='',tip3='',tip4='',tip5='';
    //检验用户名合法性
    if (!info.username || !info.password || !info.passwordChecker) {
        res.json({error:1});
        return;
    }
    if (!exp.test(info.username) || info.username.length>15 || info.username.length<6) tip1="请输入正确的用户名~";
    //检验密码合法性
    if (!exp.test(info.password) || info.password.length>18 || info.password.length<6) tip2="请输入正确的密码~";
    //检验两次密码是否一致
    if (info.password!=info.passwordChecker) tip3="两次密码不一致~";
    //若身份为教师，验证码是否正确
    if (info.loginType=='1' && (!info.identify || info.identify!="lyflyf")) tip4="验证码有误~";
    //检验该用户名是否已被注册
    var fetchSql="SELECT id FROM login WHERE username='"+info.username+"';"
    mysql.query(fetchSql,function(err,results,fields){
        if (results.length!=0) tip5="该用户名已被注册~";
        //存在错误信息，返回注册页面并提示错误
        if (tip1) {
            res.json({error:1});
            return;
        }
        if (tip2) {
            res.json({error:2});
            return;
        }
        if (tip3) {
            res.json({error:3});
            return;
        }
        if (tip4) {
            res.json({error:4});
            return;
        }
        if (tip5) {
            res.json({error:5});
            return;
        }
        //没有错误
        {
            //将数据写入MySQL
            var insertSql="INSERT INTO login(username,passwords,loginType)"+
            "VALUES('"+info.username+"','"+info.password+"',"+info.loginType+");";
            mysql.query(insertSql,function(err,results,fields){
                if (err) {
                    console.log("插入失败~");
                    res.json({error:6})
                }
                else{
                //注册成功，返回信息，添加cookie
                    res.cookie('username',info.username);
                    res.cookie('loginType',info.loginType);
                    console.log('!222')
                    res.json({error:0})
                }
            })
        }
    })
})
module.exports = router;