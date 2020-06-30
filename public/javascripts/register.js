var app=angular.module('register',[]);

app.controller('registerController',function($scope,$http,$timeout){
    // $scope.username='student';
    // $scope.password='student';
    // $scope.passwordChecker='student';
    $scope.loginType='0';
    // $scope.identify='';
    $scope.register= function(){
        var data={
            username:$scope.username,
            password:$scope.password,
            passwordChecker:$scope.passwordChecker,
            loginType:$scope.loginType,
            identify:$scope.identify
        }
        $http.post('/register',data).then(
            function(res){
                console.log(res.data);
                if (res.data.error=='0') {
                    $scope.signalSrc='correct';
                    $scope.msg='注册成功，即将跳转至首页~';
                    $('.signal_text').css('color','green');
                    $scope.isShow=true;   
                    $timeout(function() {
                        window.location.href='/';
                    },1000)
                }
                else {
                    if (res.data.error=='1')
                        $scope.msg='注册失败，用户名有误，请重试~';
                    if (res.data.error=='2')
                        $scope.msg='注册失败，密码有误，请重试~';
                    if (res.data.error=='3')
                        $scope.msg='注册失败，两次密码不一致，请重试~';
                    if (res.data.error=='4')
                        $scope.msg='注册失败，教师验证码有误，请重试~';
                    if (res.data.error=='5')
                        $scope.msg='注册失败，用户名已被注册，请重试~';
                    if (res.data.error=='6')
                        $scope.msg='注册失败，数据库写入失败，请重试~';
                    $scope.signalSrc='error';
                    $('.signal_text').css('color','red');
                    $scope.isShow=true;   
                }
            },function(err){
                console.log(err.data);
            }
        );
    }
});