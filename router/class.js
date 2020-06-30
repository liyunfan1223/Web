var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'public/static/'});
var fs = require('fs');

router.get('/',function(req,res,next){
    res.sendfile('public/class.html');
})

router.get('/download',function(req,res,next){
    // console.log('hello?');
    // res.send('hello');
    // console.log('!!!');
    var query=req.query;
    console.log(query.filename);
    var url='public/static/'+query.filename;
    res.download(url);
})
router.post('/upload',upload.any(),function(req,res,next){
    console.log(req.files);
    var now=req.files[0];
    console.log(now.path);
    console.log(now.destination+now.originalname);
    fs.rename(now.path,now.destination+now.originalname,function(err){
        if (err){
            throw err;
        }
    });
    // console.log(req.headers);
    res.json(req.body);
    // res.json(req.body);
})

module.exports = router;