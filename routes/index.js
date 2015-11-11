/**
 * Created by kusion on 2014/12/5.
 */
var express = require('express');
var router = express.Router();
var Cookies=require('cookies');
var iconv=require('iconv-lite');
var crypto = require('crypto');
var reqUserContext=require('../business/account/contextInfo');
var serverConfig=require('../configs/serverConfig.json');
var ucache=require('../lib/cache');
var reqcom=require('../lib/reqcommon');
var fs=require('fs');
var stream=require('stream');
/* GET home page. */
router.get('/', function(req, res) {
    var error=req.query.error;
    var errorMsg="";
    switch (error){
        case "wrong_id":
            errorMsg="用户名或密码错误！";
            break;
        case "unlogin":
            errorMsg="未登录或登录超时！";
        case "forcedout":
            errorMsg="你的帐号已在其它地登录！";
            break;
        case "nopersonalinfo":
            errorMsg="该社区不存在个人信息！";
    }
    var _cookies=new Cookies(req,res);
    _cookies.set('u',undefined);
    res.render('test/login', {css:error?"display:block":"",errormsg:errorMsg,layout:false,redirectUrl:encodeURIComponent(req.query.returl||"")});
});
router.get('/less', function(req, res) {
    var resRender = require('../lib/layout');
    var ejs=require('ejs');
    res.render('test/lesstest');
});
router.get('/home', function(req, res) {
    var resRender = require('../lib/layout');
    var ejs=require('ejs');
    resRender.commonLayoutRender('ucenter/home', {subData: '子模板数据！', title: 'i8工作流主页'}, res,req);
});
//初始化用户社区上下文
router.get('/newcontext',function(req,res){
    var authCode=req.query.auth;
    if(authCode){
        //try catch error
        try {
            var ucookie = new Buffer(req.cookies.u, 'base64');
            var uAryD = iconv.decode(ucookie, "utf16le");
            var cookiesAryInfo = uAryD.split('|');
            var passportID = cookiesAryInfo[0];
            var session_id = cookiesAryInfo[2];
            //还原混淆代码
            var decipher = crypto.createDecipher('aes256', session_id);//用sessionid来还原
            var decrypted_str = decipher.update(authCode, 'hex', 'utf8') + decipher.final('utf8');
            var aryads = decrypted_str.split('|');//拆分(accountid|domain)
            if (aryads.length = 2) {
                var accountid = aryads[0], domain = aryads[1];
                var user_info_key = domain + ".userBaseInfo." + passportID;
                //还原加密串出来的accountID与passportID后，再去获取用户的上下文信息
                reqUserContext.getContextInfo({account_id: accountid, passport_id: passportID, domain: domain}, function (data) {
                    if (data) {
                        data['sid'] = session_id;
                        ucache.setCache(user_info_key, data, function () {
                            //将上下文信息存入Redis缓存后，则表明社区信息加载完毕，正式跳转到社区首页
                            var defaultDomain = serverConfig['cookiesDomain'].value;
                            res.redirect("http://" + domain + "." + defaultDomain + "/home");
                        });
                    }else{
                        //获取个人信息失败
                        reqcom.clearCookie(req,res);
                        return res.redirect("/?error=nopersonalinfo")
                    }
                })
            }
        }catch (err){

        }
    }else{//无验证信息
        //清掉cookies
        reqcom.clearCookie(req,res);
        res.redirect('/?error=autherror');
    }
});

router.get('/i8ui', function(req, res) {
    var resRender = require('../lib/layout');
    resRender.mainLayoutRender('main', {subData: '子模板数据！', title: 'i8工作流主页'}, res,req);
});
router.get('/logout',function(req,res){
    reqcom.clearCookie(req,res);
    res.redirect('/');
});
router.get('/release',function(req,res){
    res.json('发布页');
})

router.post('/file',function(req,res){
    var body = '';
    req.on('data', function(chunk) {
        console.log(chunk)
        body +=chunk
    })
    req.on('end',function(){

        console.log(body);
        var writeStream = fs.createWriteStream('buffer/aaa.png');
        writeStream.write(body)
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');

    })

})
module.exports = router;
