/**
 * Created by kusion on 2014/10/23.
 */
var thenJs=require('thenjs');
var socketClient=require('./base-socket.js');
var serviceConfig=require('../../configs/serverConfig.json');
var ucache=require('../../lib/cache');
var reqcom=require('../../lib/reqcommon');
var _=require('underscore');
var serviceType=require('../../configs/serviceType.json');
var resultformate=require('../../lib/resultData');
var log4js=require('../../lib/log');
function getSocketData(_setting){
    this.command=_setting.command||'';
    this.data=_setting.data||{};
    this.serverType=_setting.serverType||'';
    this.success=_setting.success;
    this.error=_setting.error;
    this.receiveEnd=_setting.receiveEnd;
    this.subdomain=_setting.subdomain;
}
getSocketData.prototype.init=function(){
    var _this=this;
    //this.subdomain+".serverInfo"
    ucache.hGetCache("node",this.subdomain,function(resp){
        if(resp.result&& !_.isEmpty(resp.data)){
            _this.startReq(resp.data);
        }else{
        var mainHostIp = serviceConfig.remoteIp;
        var mainHostPort = serviceConfig.serPorts['CPEC.AccountCenterService'];
        var mainReq = new socketClient.getRemoteData({port: mainHostPort, host: mainHostIp, command: 'CPEC.AccountCenterService.Account.ServerInfoService.GetDataServerInfoByDomain{accountDomain:"' + _this.subdomain + '"}'});
        mainReq.connecting();
        mainReq.on("receiveData", function (data) {
            if(data.Result){
                var cData=data.ReturnObject;
                var newCPMInfo= _.isObject(cData) ? cData : JSON.parse(cData);
                if(newCPMInfo){
                    var c_value={};//精简请求来的数据对象，并缓存
                    _.each(newCPMInfo.Result,function(item){
                        c_value["type_"+item.Type]={name:item.Name,addr:item.Address,port:item.Port,type:item.Type};
                    });
                    if(!_.isEmpty(c_value)) {
                        ucache.setCache(_this.subdomain + ".serverInfo", c_value);//添加或更新缓存,以二级域名作为KEY，帐套服务地址作为VALUE，缓存起来
                    }
                    _this.startReq(c_value);
                }
            }else{
                if(_this.error){
                    log4js.logger.error("8891:帐套数据不存在!CPEC.AccountCenterService.Account.ServerInfoService.GetDataServerInfoByDomain{accountDomain:" + _this.subdomain + "}");
                    _this.error(resultformate(8891,'帐套数据不存在!'));
                }
            }
        });
        mainReq.on("error", function (err) {
            if(_this.error){
                log4js.logger.error(err.message+"CPEC.AccountCenterService.Account.ServerInfoService.GetDataServerInfoByDomain{accountDomain:" + _this.subdomain + "}");
                _this.error(err);
            }
       })
        }
    })
}
getSocketData.prototype.startReq=function(srvDataObj){
    var rqeSrv=reqcom.convertReqAddr(srvDataObj,this.serverType);
    this.command=this.command+JSON.stringify(this.data);//合并command与data对象，作为socket数据指令
    var _this=this;
    var cnt= new socketClient.getRemoteData({port:rqeSrv.serverPort,host:rqeSrv.serverIp,command:this.command});
    cnt.connecting();
    cnt.on("receiveData",function(data){
        if(!data.Result){
            log4js.logger.error(data.ReturnObject);
        }
        _this.success(data);
    });
    cnt.on("receiveEnd",function(){
        if(_this.receiveEnd){
            _this.receiveEnd();
        }
    });
    cnt.on("error",function(err){
        if(_this.error){
            log4js.logger.error('getDataByCMD.js '+err.message+_this.command);
            _this.error(err);
        }
    })
}
/*
 *服务调用分发
 */

exports.getDataService=function(setting){
    setting.serverType=serviceType.DATA;
    return new getSocketData(setting);
};
exports.getAccountCenterService=function(setting){
    setting.serverType=serviceType.ACCOUNT;
     return new getSocketData(setting);
};
exports.getWorkflowService=function(setting){
    setting.serverType=serviceType.WORKFLOW;
    return new getSocketData(setting);
};
exports.getUserCenterService=function(setting){
    setting.serverType=serviceType.UCENETER;
    return new getSocketData(setting);
};
exports.getBasicService=function(setting){
    setting.serverType=serviceType.BASIC;
    return new getSocketData(setting);
};
exports.getTemplateService=function(setting){
    setting.serverType=serviceType.TEMPLATE;
    return new getSocketData(setting);
};
exports.getPlatformService=function(setting){
    setting.serverType=serviceType.PLATFORM;
    return new getSocketData(setting);
};
exports.getCenterService=function(setting){
    setting.serverType=serviceType.CENTER;
    return new getSocketData(setting);
};
exports.getAppsService=function(setting){
    setting.serverType=serviceType.APPS;
    return new getSocketData(setting);
};