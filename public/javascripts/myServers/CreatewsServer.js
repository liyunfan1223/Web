//引入nodejs-websocket
var ws=require('nodejs-websocket');
//设置端口
const PORT=3010;
console.log("websocket服务器端口: " + PORT);
var clientCount = 0;
var wsserver = ws.createServer(function(conn) {
    //客户端首次连接服务器
    console.log("连接已建立~")
    // clientCount++;
    //接收到了客户端发送的数据
    conn.on("text", function(str) {
        console.log(str);
        //将str对象化
        str=JSON.parse(str);
        //根据请求类型，分类处理
        if (str.type=='connect') {
            conn.nickname=str.text;
            conn.logintype=str.logintype;
            let mes={};
            mes.type="connect";
            mes.data=conn.nickname+" 已加入课堂。";
            mes.logintype= conn.logintype ;
            broadcast(JSON.stringify(mes));
        }
        if (str.type=='message') {
            let text=str.text;
            let username=conn.nickname;
            console.log("收到消息： " + text);
            let mes = {};
            mes.type = "message";
            mes.data = username + ' : ' + text;
            mes.logintype = conn.logintype;
            broadcast(JSON.stringify(mes));
        }
        if (str.type=='upload') {
            let mes={};
            mes.type="message";
            mes.data="文件已上传："+str.text;
            broadcast(JSON.stringify(mes));
            mes={};
            mes.type='upload';
            mes.data=str.text;
            broadcast(JSON.stringify(mes));
        }
        if (str.type=='problem_upload') {
            let mes={};
            mes.type="problem_assign";
            mes.data={
                des:str.des,
                opA:str.opA,
                opB:str.opB,
                opC:str.opC,
                opD:str.opD,
                cor:str.cor
            };
            broadcast(JSON.stringify(mes));
        }
        if (str.type == 'text_upload') {
            let mes={};
            mes.type='problem_submit';
            mes.data={
                username:conn.nickname,
                choice:str.op
            };
            broadcast(JSON.stringify(mes));
        }
        if (str.type == 'blackboard') {
            let mes={};
            mes.type='blackboard';
            mes.data={
                str:str.text
            };
            broadcast(JSON.stringify(mes));
        }
        if (str.type == 'barrage') {
            let mes={};
            mes.type='barrage';
            mes.data={
                str:str.text
            };
            broadcast(JSON.stringify(mes));
        }
    })
    //客户端连接中止
    conn.on("close", function(code, reason) {
        console.log("连接关闭~");
        let mes = {};
        mes.type = "connect";
        mes.data = conn.nickname + ' 已离开课堂。'
        mes.logintype = conn.logintype;
        broadcast(JSON.stringify(mes));
    })
    conn.on("error", function(err) {
        // console.log("handle err");
        // console.log(err);
    })
});
//对每个连接的客户端发送请求，即广播
function broadcast(str) {
    wsserver.connections.forEach(function(connection) {
        connection.sendText(str);
    })
}

module.exports=wsserver;