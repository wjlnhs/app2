var thenJs=require('thenjs');
var socketClient=require('./base-socket.js');
var ucache=require('../../lib/cache');
var reqcom=require('../../lib/reqcommon');
var _=require('underscore');
var serviceType=require('../../configs/serviceType.json');
var serviceConfig=require('../../configs/serverConfig.json');
var log4js=require('../../lib/log');
var _baseThen=function(cont,arg){
        var sType=arg.serverType;
        var command=arg.command||'';
        var data=arg.data||{};
        var subdomain=arg.subdomain||'';
        command=command+JSON.stringify(data);
        var requestHost=function(srvData){
            var rqeSrv=reqcom.convertReqAddr(srvData,sType);
            var config={
                    port:rqeSrv.serverPort,
                    host:rqeSrv.serverIp,
                    command:command
                };
            var cnt= new socketClient.getRemoteData(config);
            cnt.connecting();
            cnt.on("receiveData",function(data){
                cont(null, data);
                if(!data.Result) {
                    log4js.logger.error(data.ReturnObject);
                }
            });
            cnt.on("receiveEnd",function(data){
                //console.log('logo!');
            });
            cnt.on("error",function(data){
                cont(null,data);
                log4js.logger.error(data.ReturnObject);
                console.log(data);
               //new Error(JSON.stringify(data));
            });
        }
    //若缓存不存在，则刷新或更新缓存//subdomain+".serverInfo"
    ucache.getCache("node",function(resp){
        if(resp.result&& !_.isEmpty(resp.data)){
            requestHost(resp.data);
        }else{
            var mainHostIp = serviceConfig.remoteIp;
            var mainHostPort = serviceConfig.serPorts['CPEC.AccountCenterService'];
            var mainReq = new socketClient.getRemoteData({port: mainHostPort, host: mainHostIp, command: 'CPEC.AccountCenterService.Account.ServerInfoService.GetDataServerInfoByDomain{accountDomain:"' + subdomain + '"}'});
            mainReq.connecting();
            mainReq.on("receiveData", function (data) {
                var newCPMInfo= _.isObject(data) ? data : JSON.parse(data);
                if(newCPMInfo){
                    var c_value={};//精简请求来的数据对象，并缓存
                    _.each(newCPMInfo.Result,function(item){
                        c_value["type_"+item.Type]={name:item.Name,addr:item.Address,port:item.Port,type:item.Type};
                    });
                    ucache.setCache(subdomain+".serverInfo",c_value);//添加或更新缓存,以二级域名作为KEY，帐套服务地址作为VALUE，缓存起来
                    requestHost(c_value);
                }
            });
            mainReq.on("error", function (err) {

            })
        }
    })
}
//exports.baseThen=_baseThen;
exports.getDataServiceByThen=function(cont,setting){
    setting.serverType=serviceType.DATA;
    return _baseThen(cont,setting);
};
exports.getAccountCenterServiceByThen=function(cont,setting){
    setting.serverType=serviceType.ACCOUNT;
    return _baseThen(cont,setting);
};
exports.getWorkflowServiceByThen=function(cont,setting){
    setting.serverType=serviceType.WORKFLOW;
    return _baseThen(cont,setting);
};
exports.getUserCenterServiceByThen=function(cont,setting){
    setting.serverType=serviceType.UCENETER;
    return _baseThen(cont,setting);
};
exports.getBasicServiceByThen=function(cont,setting){
    setting.serverType=serviceType.BASIC;
    return _baseThen(cont,setting);
};
exports.getTemplateServiceByThen=function(cont,setting){
    setting.serverType=serviceType.TEMPLATE;
    return _baseThen(cont,setting);
};
exports.getPlatformServiceByThen=function(cont,setting){
    setting.serverType=serviceType.PLATFORM;
    return _baseThen(cont,setting);
};
exports.getCenterServiceByThen=function(cont,setting){
    setting.serverType=serviceType.CENTER;
    return _baseThen(cont,setting);
}
exports.getAppsServiceByThen=function(cont,setting){
    setting.serverType=serviceType.APPS;
    return _baseThen(cont,setting);
}