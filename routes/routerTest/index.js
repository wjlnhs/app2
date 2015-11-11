/**
 * Created by kusion on 2014/12/5.
 */
/**
 * Created by kusion on 2014/10/24.
 */
var express = require('express');
var Cookies=require('cookies');
var router = express.Router();
var URL=require('url');
var resRender=require('../../lib/layout');
var ucache=require('../../lib/cache');
/* GET users listing. */
router.post('/login',function(req,res,next){
    var log=require('../../business/account/passport');
    var goUrl=decodeURIComponent(req.query.returl);
    var userdata={
        req:req,
        reqHeader:req.headers,
        subdomains:req.subdomains,
        passport:req.body.email,
        password:req.body.password
    };
    var loginCallback=function(data){
        if(data.result){
            var _cookies = new Cookies(req, res);
            _cookies.set('u', data.cookies);//设置Cookies
            if(goUrl.indexOf('/')==0){
                res.redirect(goUrl);
            }else {
                res.redirect('/home');
            }
        }else{
            res.redirect('/?error=wrong_id');
        }
    }
    log.login(userdata,loginCallback);
});

module.exports = router;