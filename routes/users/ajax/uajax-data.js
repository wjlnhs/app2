/**
 * Created by kusion on 2014/12/29.
 */
var express = require('express');
var router = express.Router();
var MD5=require('blueimp-md5').md5;
var reqcom = require('../../../lib/reqcommon');
var requsrdata=require('../../../business/account/passport');
var resultData=require('../../../lib/resultData');
var serverConfig=require('../../../configs/serverConfig.json');
var iconv=require('iconv-lite');
var log4js=require('../../../lib/log');
var moment=require('moment');
var Cookies=require('cookies');
var ucache=require('../../../lib/cache');
var crypto = require('crypto');
var _=require('underscore');

router.post('/authusrlogin', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    var _pwd=req.body.password||'';
    var _usr=req.body.email||'';
    requsrdata.authusrLogin({passport:_usr,password:_pwd,reqHeader:req.headers},
        function(data){
            if(data.result){
                var _cookies = new Cookies(req, res);
                var options={};
                if(serverConfig['cookiesDomain'].status=="on"){
                    options={domain:serverConfig['cookiesDomain'].value};
                }
                _cookies.set('u', data.cookies,options);//设置Cookies
                var sessionid=data.sessionid;
                if(data.defaultgo){//有默认社区的，直接进
                    var subdomain=data.loginInfo.domain,//三级域名
                        accountid=data.loginInfo.aid;//帐套ID
                    var encrypted_authCode=createDesLinkCode(accountid,subdomain,sessionid);
                    res.json(resultData(0,{dego:true,redirectUrl:"/newcontext?auth="+encrypted_authCode}));
                }else{//没有默认社区的，需要生成不同社区进入口令
                    var accountList=[];
                    _.each(data.account,function(item){
                        item['redirectUrl']="/newcontext?auth="+createDesLinkCode(item.aid,item.domain,sessionid);
                        accountList.push(item);
                    });
                    res.json(resultData(0,{dego:false,alist:accountList}));
                }
            }else{//登录失败
                res.json(resultData(1015,null));
            }
        }
    )
});
//加密混合CODE生成
var createDesLinkCode=function(acountid,subdomain,sessionid){
    var cipher_value=acountid+"|"+subdomain;//加密前原字符串
    var cipher = crypto.createCipher('aes256', sessionid);//将sessionid作为KEY
    var encrypted_authCode = cipher.update(cipher_value, 'utf8', 'hex') + cipher.final('hex');
    return encrypted_authCode
};
//进入社区，用户上下文信息
router.get('/setcommunity',function(req,res){
    var a_id=req.query.aid;
    var ucookie = new Buffer(req.cookies.u, 'base64');
    var uAryD = iconv.decode(ucookie, "utf16le");
    var cookiesAryInfo = uAryD.split('|');
    var passportID = cookiesAryInfo[0];
    if(a_id&&passportID) {
        requsrdata.setdefaultCommunity({account_id: a_id, passport_id: passportID}, function (data) {
            if (data.Result) {
                res.json(resultData(0, {}));
            } else {
                res.json(resultData(data.Code, {}));
            }
        })
    }else{
        res.json(resultData(1,{Description:"登录信息失败，操作失败！"}));
    }
})
module.exports=router;