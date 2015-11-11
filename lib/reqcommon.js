/**
 * Created by kusion on 2014/10/29.
 */
var _=require('underscore');
var serviceConfig=require('../configs/serverConfig.json');
var srvType=require('../configs/serviceType.json');
var Cookies=require('cookies');
exports.convertReqAddr=function(srvDataObj,s_type){
    var serverIp,serverPort;
    var srv=srvDataObj["type_"+srvType.DATA];
    if(s_type==srvType.DATA&&srv){
       serverIp=srv.addr,
       serverPort=srv.port;
       serverIp=serviceConfig.remoteIp,serverPort=8882;//【*****测试专用*****】
    }else if(s_type==srvType.WORKFLOW&&srv){
        serverIp=srv.addr,
        serverPort=srv.port;
        serverIp=serviceConfig.remoteIp,serverPort=8884;//【*****测试专用*****】
    }else if(s_type==srvType.UCENETER){
        serverIp=serviceConfig.remoteIp,
        serverPort=serviceConfig.serPorts['CPEC.UserCenterService'];
    }else if(s_type==srvType.ACCOUNT){
        serverIp=serviceConfig.remoteIp,
        serverPort=serviceConfig.serPorts['CPEC.AccountCenterService'];
    }else if(s_type==srvType.BASIC){
        serverIp=serviceConfig.remoteIp,
        serverPort=serviceConfig.serPorts['CPEC.BasicService'];
    }else if(s_type==srvType.TEMPLATE){
        serverIp=serviceConfig.remoteIp,
        serverPort=serviceConfig.serPorts['CPEC.TemplateService'];
    }else if(s_type==srvType.PLATFORM){
        serverIp=serviceConfig.remoteIp,//平台服务
        serverPort=serviceConfig.serPorts['CPEC.Platform.Service'];
    }else if(s_type==srvType.CENTER){
        serverIp=serviceConfig.remoteIp,//用户中心服务
        serverPort=serviceConfig.serPorts['CPEC.Center.Service'];
    }else if(s_type==srvType.APPS){
        serverIp=serviceConfig.remoteIp,//应用中心服务
        serverPort=serviceConfig.serPorts['CPEC.Apps.Service'];
    }
    return {serverIp:serverIp,serverPort:serverPort};
};
//获取帐户的三级域名
exports.getSubdomain=function(req){
    var currentDomain="hvming";
    if(req.subdomains.length>0){
        var subdomain = req.subdomains[req.subdomains.length - 1];
        if (subdomain.toLowerCase() == "workflow") {
            currentDomain= "hvming";
        } else {
            currentDomain= subdomain;
        }
    }
    console.log('currentDomain:'+currentDomain);
    return currentDomain;
}
//清理cookies
exports.clearCookie=function(req,res){
    var _cookies = new Cookies(req, res);
    var options = {};//清cookies
    if (serviceConfig['cookiesDomain'].status == "on") {
        options = {domain: serviceConfig['cookiesDomain'].value};
    }
    options['maxAge'] = 0;
    _cookies.set('u', undefined, options);
}
