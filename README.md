clone之后的运行方法：
1.安装nodejs http://nodejs.cn/download/
2.输入node -v提示版本说明安装成功
图片: https://uploader.shimo.im/f/MU4xoW4CMfkwCUTP.png
安装完毕后，cd到根目录之后命令行输入
node app
此时如果有报错一般是有依赖项没有安装，根据错误提示用npm install xxxxx(具体的依赖项)来安装依赖项（或者在package-lock.json中查看所有依赖项），比如说
npm install cookie-parser
提示服务器端口说明网站运行成功，可以通过127.0.0.1:3000访问网站
图片: https://uploader.shimo.im/f/G9MCt8KirjftQFUj.png
但是登陆注册系统还需要用到mysql数据库
3.安装mysql https://dev.mysql.com/downloads/mysql/
4.mysql安装和设置参考下图（下图用的是免安装版，安装版应该会简单一点）
主要是要修改root用户的密码为'root'，并给root用户授权，已经安装好mysql的话也可以修改public/javascripts/mysql.js中用户名和密码
![](https://uploader.shimo.im/f/Xzxtaw0YrT0nEqBA.png)
![](https://uploader.shimo.im/f/p3KskgLwu1JbynqM.png)
![](https://uploader.shimo.im/f/jEVNXXPBLu2F2qD6.png)
![](https://uploader.shimo.im/f/9OQt8om157q9htm4.png)
![](https://uploader.shimo.im/f/pJixMqQso7UbWAIZ.png)
5.设置完毕后按照下面的指令创建数据库和表
 CREATE DATABASES myDB1;
 use myDB1;
 CREATE TABLE login(
id INT NOT NULL AUTO_INCREMENT,
username VARCHAR(200) NOT NULL,
passwords VARCHAR(200) NOT NULL,
loginType INT NOT NULL,
     PRIMARY KEY(id),
     UNIQUE KEY id_UNIQUE (id),
     UNIQUE KEY url_UNIQUE (username)
 )ENGINE=InnoDB DEFAULT CHARSET=utf8; 
6.创建完毕后再通过node app运行网站之后就可以正常使用了