var app = angular.module('index',[]);
app.controller('indexController',function($scope,$http){
    // $scope.username='123';
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
    $scope.username=getCookie('username');
    var loginType=getCookie('loginType')
    if (loginType=='0') $scope.loginType='学生';
    else $scope.loginType='教师';
    $scope.logout = function(){
        var data={
            logout:'1'
        }
        $http.post('/',data).then(
            function(res){
                console.log(res.data);
                if (res.data.success=='1')
                    window.location.href='/login';
            },function(err){
                console.log(err.data);
            }
        )
    }
    $scope.class = function(){
        window.location.href='/class';
    }
    $scope.live = function(){
        window.location.href='/view-stream.html'
    }
    $scope.photo = function(){
        window.location.href='/face.html';
    }
})