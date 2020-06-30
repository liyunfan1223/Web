var app=angular.module('index',[]);
app.controller('indexController',function($scope,$http,$timeout){
    $scope.isShow=false;
    $scope.login=function(){
        var data={
            username:$scope.username,
            passwords:$scope.passwords
        }
        console.log(data);
        $http.post('/login',data).then(
            function(res){
                console.log(res.data);
                if (res.data.error=='0') {   
                    $scope.signalSrc='correct';
                    $scope.msg='登陆成功，即将跳转至首页~';
                    $('.signal_text').css('color','green');
                    $scope.isShow=true;   
                    $timeout(function() {
                        window.location.href='/';
                    },1000)
                }
                else {
                    $scope.signalSrc='error';
                    $scope.msg='登陆失败，请检查账号和密码~';
                    $('.signal_text').css('color','red');
                    $scope.isShow=true;  
                }
            },function(err){
                console.log(err.data);
            });
    }
})
// console.log($('#x').val);