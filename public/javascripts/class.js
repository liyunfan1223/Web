var websocket = new WebSocket("ws://"+window.location.hostname+":3010");
var app=angular.module('class',[]);
app.controller('classController',function($scope,$http){
    {
        var correct_data = new Array();
        var tot,cnt_cor;

        function getCookie(cookieName) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for(var i = 0; i < arrCookie.length; i++){
                var arr = arrCookie[i].split("=");
                if(cookieName == arr[0]){
                    return arr[1];
                }
            }
            return "";
        }
        
        
        websocket.onopen = function() {
            let param={
                text:getCookie('username'),
                logintype:getCookie('loginType'),
                type:'connect'
            }
            websocket.send(JSON.stringify(param));
            // document.getElementById("send").onclick = function() {
            //     var txt = document.getElementById("sendTxt").value;
            //     if (txt) {
            //         let param={
            //             text:txt,
            //             type:'message'
            //         };
            //         websocket.send(JSON.stringify(param));
            //     }
            //     document.getElementById("sendTxt").value='';
            // }
        }
        websocket.onclose = function() {
        }
        // 只接收字符串参数，所以在服务端相传对象过来可以用JSON先转换成字符串，然后在这边转成对象
        websocket.onmessage = function(e) {
            console.log('onmessage'+e.data);
            var mes = JSON.parse(e.data);
            showMessage(mes.data, mes.type,mes.logintype);
        }
        
        function showMessage(data,type,logintype) {
            if (type == "connect") {
                var div=document.createElement('div');
                div.setAttribute('class','message_row');
                var img=document.createElement('img');
                img.setAttribute('class','message_icon')
                if (logintype=='0')
                    img.setAttribute('src','/images/student.png')
                else img.setAttribute('src','/images/teacher.png')
                div.appendChild(img);
                var text=document.createElement('div');
                text.setAttribute('class','message_text');
                text.innerHTML = data;
                div.appendChild(text);
                var chat=document.getElementById("chat_info");
                chat.appendChild(div);
            }
            if (type == "message") {
                var div=document.createElement('div');
                div.setAttribute('class','message_row');
                var img=document.createElement('img');
                img.setAttribute('class','message_icon')
                // console.log(logintype);
                if (logintype=='0')
                    img.setAttribute('src','/images/student.png')
                else img.setAttribute('src','/images/teacher.png')
                div.appendChild(img);
                var text=document.createElement('div');
                text.setAttribute('class','message_text');
                text.innerHTML = data;
                div.appendChild(text);
                var chat=document.getElementById("chat_info");
                chat.appendChild(div);
            }
            if (type == 'upload') {
                var div=document.createElement('div');
                div.setAttribute('class','download_row');
                var img=document.createElement('img');
                img.setAttribute('class','download_icon')
                // console.log(logintype);
                img.setAttribute('src','/images/file.png')
                div.appendChild(img);
                var text=document.createElement('a');
                text.setAttribute('href','/class/download?filename='+data)
                text.setAttribute('class','download_text');
                text.innerHTML = data;
                div.appendChild(text);
                var chat=document.getElementById("download");
                chat.appendChild(div);
            }
            if (type == 'problem_assign'){
                $scope.showTest = true;
                console.log(data);
                console.log(data.des);
                // $scope.try=data.des;
                $scope.test_des=data.des;
                $scope.test_opA=data.opA;
                $scope.test_opB=data.opB;
                $scope.test_opC=data.opC;
                $scope.test_opD=data.opD;
                $scope.test_cor=data.cor;
                $scope.testSubmit_disabled=false;
                $scope.test_msg='';
                $scope.$apply();
            }
            if (type == 'problem_submit') {
                if (data.choice=='0') $scope.amount_opA++;
                if (data.choice=='1') $scope.amount_opB++;
                if (data.choice=='2') $scope.amount_opC++;
                if (data.choice=='3') $scope.amount_opD++;
                var text='';
                // if ($scope.test_cor=='0') text='A';
                // if ($scope.test_cor=='1') text='B';
                // if ($scope.test_cor=='2') text='C';
                // if ($scope.test_cor=='3') text='D';
                if (data.choice==$scope.test_cor) {
                    // $scope.test_msg='回答正确！';
                    cnt_cor++;
                }
                // else $scope.test_msg='回答错误~正确答案为 : '+ text;
                // $scope.testSubmit_disabled=true;
                tot++;
                $scope.$apply();
                correct_data.push((cnt_cor/tot*100).toFixed(2));
                $scope.showEcharts();
            }
            if (type == 'blackboard') {
                var show=document.getElementById('showBoard');
                show.innerHTML="<img src='"+data.str+"'>";
            }
            if (type == 'barrage') {
                var barrage={
                    text:data.str,
                    speed:Math.ceil(Math.random()*5)+2,
                    x:1100,
                    y:Math.ceil(Math.random()*900)+100
                }
                barrageList.push(barrage);
            }
        }
    }
    // Initialize
    {
        // $scope.showTest=false;
        $scope.amount_opA=0;
        $scope.amount_opB=0;
        $scope.amount_opC=0;
        $scope.amount_opD=0;
        $scope.chatMessage='';
        $scope.username=getCookie('username');
        var loginType=getCookie('loginType')
        if (loginType=='0') {
            $scope.loginType='学生';
            $scope.isTeacher = false;
        }
        else {
            $scope.loginType='教师';
            $scope.isTeacher = true;
        }
        $scope.chatIsShow = true;
        $scope.fileIsShow = false;
        $scope.problemIsShow = false;
        $scope.blackboardIsShow = false;
        $scope.barrageIsShow = true;
    }
    //angular functions
    $scope.chat = function() {
        $scope.chatIsShow=true;
        $scope.fileIsShow=false;
        $scope.problemIsShow = false;
        $scope.blackboardIsShow = false;
    }
    $scope.file = function() {
        $scope.chatIsShow=false;
        $scope.fileIsShow=true;
        $scope.problemIsShow = false;
        $scope.blackboardIsShow = false;
    }
    $scope.problem = function() {
        $scope.chatIsShow=false;
        $scope.fileIsShow=false;
        $scope.problemIsShow = true;
        $scope.blackboardIsShow = false;
    }
    $scope.blackboard = function() {
        $scope.chatIsShow=false;
        $scope.fileIsShow=false;
        $scope.problemIsShow = false;
        $scope.blackboardIsShow = true;
    }
    $scope.upload=function(){
        var form = new FormData(document.getElementById('fileform'))
        var file = $('#file').get(0).files[0];
        console.log(form);
        console.log(file);
        console.log(file.name);
        var data = {
            type : 'upload',
            text : file.name
        }
        websocket.send(JSON.stringify(data));
        var params={
            method:'post',
            url:'class/upload',
            data:form,
            headers:{
                'Content-Type':undefined,
            }
        };
        $http(params,
            function(res){

            },function(err){
                
            });
    }
    $scope.return=function(){
        websocket.close();
        window.location.href='/';
    }
    $scope.chatClear = function() {
        var div = document.getElementById('chat_info');
        div.innerHTML='';
    }
    $scope.chatSend= function() {
        var data={
            text:$scope.chatMessage,
            type:'message'
        }
        websocket.send(JSON.stringify(data));
        $scope.chatMessage='';
    }
    $scope.problemSubmit = function() {
        var data={
            type:'problem_upload',
            des:$scope.problem_des,
            opA:$scope.problem_opA,
            opB:$scope.problem_opB,
            opC:$scope.problem_opC,
            opD:$scope.problem_opD,
            cor:$scope.correct_option
        };
        //统计数据清零
        $scope.amount_opA=0;
        $scope.amount_opB=0;
        $scope.amount_opC=0;
        $scope.amount_opD=0;
        $scope.showResult=true;
        

        correct_data=[];
        tot=cnt_cor=0;
        //更新echarts图表
        $scope.showEcharts();
        console.log($scope.problem_des);
        console.log($scope.correct_option);
        websocket.send(JSON.stringify(data));
    }
    $scope.testSubmit = function() {
        var data = {
            type:'text_upload',
            op:$scope.test_option
        }
        console.log(data);
        websocket.send(JSON.stringify(data));

        if ($scope.test_cor=='0') text='A';
        if ($scope.test_cor=='1') text='B';
        if ($scope.test_cor=='2') text='C';
        if ($scope.test_cor=='3') text='D';
        if ($scope.test_option==$scope.test_cor) {
            $scope.test_msg='回答正确！';
            // cnt_cor++;
        }
        else $scope.test_msg='回答错误~正确答案为 : '+ text;
        $scope.testSubmit_disabled=true;
    }

    $scope.showEcharts= function() {
        var myChart = echarts.init(document.getElementById('echarts_pie'));
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '测验情况'
            },
            tooltip: {},
            legend: {
                orient:'horizontal',
                x:'right',
                y:'top',
                itemWidth:24,
                itemHeight:18,
                textStyle:{
                    color:'#666'
                },
                itemGap:10,
                data:['选项A','选项B','选项C','选项D']
            },
            // xAxis: {
            //     data: ["A","B","C","D"]
            // },
            // yAxis: {},
            series: [{
                name: '测验情况',
                type: 'pie',
                radius:'70%',
                data: [
                    {value:$scope.amount_opA, name:'选项A'},
                    {value:$scope.amount_opB, name:'选项B'},
                    {value:$scope.amount_opC, name:'选项C'},
                    {value:$scope.amount_opD, name:'选项D'}
                ],
            }]
        };
            
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        
        var myChart = echarts.init(document.getElementById('echarts_line'));
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '正确率'
            },
            tooltip: {},
            legend: {
                data:['正确率']
            },
            xAxis: {
                data: []
            },
            yAxis: {
                min:0,
                max:100
            },            
            series: [{
                name: '正确率',
                type: 'line',
                data: correct_data
            }]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    $scope.switchBarrage=function(){
        $scope.barrageIsShow = !$scope.barrageIsShow;
    }
})
// blackboard
{
    var color='black';
    var width=5;
    var x1,y1,x2,y2;
    var isMouseDown=false;
    var canvas;
    var context;
    var container;
    var isEraser=false;
    var barrage_ctx;
    var cnt=0;
    window.onload=function(){
        canvas=document.getElementById('canvas');
        context=canvas.getContext("2d");
        context.fillStyle='WHITE';
        context.fillRect(0,0,1000,1000);
        container=document.getElementById('container');
        container.onmousedown=mouseDownAction;
        document.onmouseup=mouseUpAction;
        canvas.onmousemove=mouseMoveAction;
        barrage_ctx=document.getElementById('barrage').getContext('2d');
        barrage_ctx.font="30px 黑体";
        draw();
    }

    function mouseDownAction(e){
        isMouseDown=true;
        // console.log(e);
        x1=e.offsetX;
        y1=e.offsetY;
        console.log(x1,y1);
    }
    function mouseUpAction(){
        isMouseDown=false;
    }
    function mouseMoveAction(e){
        if (isMouseDown){
            x2=e.offsetX;
            y2=e.offsetY;
            drawLine(x1,y1,x2,y2);
            x1=x2;
            y1=y2;
            if (cnt%10 == 0)
                broadcast();
            cnt++;
            console.log(cnt);
        }
    }
    function drawLine(x1,y1,x2,y2){
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineWidth=width;
        context.strokeStyle=color;
        if (isEraser) context.strokeStyle='white';
        context.lineTo(x2,y2);
        context.stroke();
    }
    function showRange(){
        console.log(document.getElementById('width').value);
        width=document.getElementById('width').value/10;
    }
    function showColor(){
        console.log(document.getElementById('color').value);
        color=document.getElementById('color').value;
    }
    function broadcast(){
        console.log(canvas.toDataURL("image/png",0.92));
        var data={
            type:"blackboard",
            text:canvas.toDataURL("image/png",0.92)
        }
        websocket.send(JSON.stringify(data));

    }
    function clearCanvas(){
        context.fillStyle='WHITE';
        context.fillRect(0,0,1000,1000);
        broadcast();
        // context.clear();
    }
    function switchEraser(){
        isEraser=!isEraser;
    }
    function barrageSubmit(){
        var data={
            type:'barrage',
            text:document.getElementById('barrageText').value
        }
        websocket.send(JSON.stringify(data));
    }
    var barrageList=[];
    
    function draw(){
        console.log('!!!');
        barrage_ctx.clearRect(0,0,1000,1000);
        for (var i=0;i<barrageList.length;i++){
            barrage_ctx.fillText(barrageList[i].text,barrageList[i].x,barrageList[i].y);
            barrageList[i].x-=barrageList[i].speed;
            if (barrageList[i].x<-300) {
                barrageList.splice(i,1);
                i--;
            }
        }
        // setTimeout(function(){
        //     draw()
        // },10);
        requestAnimationFrame(draw);
    }

}