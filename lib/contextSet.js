/**
 * Created by kusion on 2014/10/28.
 */
var ucache=require('../lib/cache');
var reqcom=require('../lib/reqcommon');
var contextData=require('../business/account/contextInfo');
var serverConfig=require('../configs/serverConfig.json');
var iconv=require('iconv-lite');
var _=require('underscore');
module.exports=function(req,res,next){
    var hostName=reqcom.getSubdomain(req);
    //console.log('subdomain:'+hostName);
    var reqMainUrl=req.originalUrl.split('?')[0];
    if(req.cookies.u){
        if(reqMainUrl=="/newcontext"||reqMainUrl=="/webajax/usrdata/setcommunity") {//初始化用户上下文，进入社区
            next();
        }else{
            var ucookie = new Buffer(req.cookies.u, 'base64');
            var uAryD = iconv.decode(ucookie, "utf16le");
            var cookiesAryInfo = uAryD.split('|');
            var passportID = cookiesAryInfo[0];
            var session_id = cookiesAryInfo[2];
            var user_info_key = hostName + ".userBaseInfo." + passportID;
            ucache.getCache(user_info_key, function (resp) {
                if (resp.result && resp.data) {//如果缓存存在如果,并且在非登录情况下，取缓存内容
                    res.locals.userBaseInfo = req['i8session'] = resp.data;

                    if (resp.data.sid == session_id) {
                        next();
                    } else {
                        reqcom.clearCookie(req,res);//清除客户端Cookies
                        return res.redirect('/?error=forcedout&returl=' + encodeURIComponent(req.originalUrl));
                    }
                } else {// 当cookie存在，cache不存在，重新获取用户上下文数据
                    contextData.getContextInfo({hostName: hostName, passportID: passportID, req: req}, function (baseInfo) {
                        if (baseInfo) {
                            res.locals.userBaseInfo = baseInfo;
                            req['i8session'] = baseInfo;
                            ucache.setCache(user_info_key, baseInfo);
                            next();
                        } else {
                            next(new Error('用户数据获取失败!'));
                        }
                    });
                }
            })
        }
    }else{
        var letitgoUrl=["/","/test/login","/wopi/files/","/webajax/usrdata/authusrlogin"];
        if(_.contains(letitgoUrl,reqMainUrl.toLowerCase())){
            next();
        }else{
            if(reqMainUrl.toLowerCase().indexOf('/webajax/')==0){
                return res.json({Code:1,Result:false,ReturnObject:{},Description:'登录信息丢失！'});
            }else{
                return res.redirect('/?error=nologin&returl='+encodeURIComponent(req.originalUrl));
            }
        }
    }
}