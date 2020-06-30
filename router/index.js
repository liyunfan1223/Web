var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    let coo=req.cookies;
    console.log(coo);
    console.log(coo.username);
    console.log(coo.loginType);
    if (coo.username==undefined) {
        console.log(coo);
        res.redirect('/login');
    }
    else {
        res.sendfile('public/index.html')
    }
})
router.post('/',function(req,res,next){
    let bod=req.body;
    console.log(bod);
    if (bod.logout=='1'){
        res.clearCookie('username');
        res.clearCookie('loginType');
        res.json({success:1});
    };
});
module.exports = router;