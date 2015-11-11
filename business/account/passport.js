/**
 * Created by kusion on 2014/10/23.
 */
var _=require('underscore');
var asyncData=require('../common/asyncGetData.js');
var reqhostdata=require('../common/getDataByCMD');
var serverConfig=require('../../configs/serverConfig');
var thenJs=require('thenjs');
var MD5=require('blueimp-md5').md5;
var moment=require('moment');
var ucache=require('../../lib/cache');
var reqcom=require('../../lib/reqcommon');
var resConfig=require('../../configs/resConfig');
var log4js=require('../../lib/log');
var iconv=require('iconv-lite');
var socketClient=require('../common/base-socket.js');
exports.authusrLogin=function(_setting,callback){//登录没有根据subdomain走通用接口查询
    var setting= _.extend({passport:'',password:'',reqHeader:''},_setting);
    //var flag=false,sn_expire,sn_sessionid,sn_userid;
    var param= {
        command: "CPEC.Center.Service.Account.SessionService.Login",
        data: {
            param: {
                ClientInfo: setting.reqHeader['host'] + "§" + setting.reqHeader['user-agent'] + "§" + setting.reqHeader['referer'],
                ClientIP: setting.reqHeader.host,
                Passport: setting.passport,
                Password: setting.password,
                AppID: "00000000-0000-0000-0000-000000000000"
            }
        }
    };
    var server_host=serverConfig["remoteIp"];
    var server_ports=serverConfig.serPorts["CPEC.Center.Service"];
    var this_command=param.command+JSON.stringify(param.data);//合并command与data对象，作为socket数据指令
    var _this=this;
    var cnt= new socketClient.getRemoteData({port:server_ports,host:server_host,command:this_command});
    cnt.connecting();
    cnt.on("receiveData",function(data){
        var lgreturnData = data.ReturnObject;
        if(data.Result) {//登录成功
            var u_session = lgreturnData.Session;
            var sn_expire = u_session.ExpireTime;
            var sn_userid = u_session.PassportID;//
            var sn_sessionid = u_session.ID;//sessionID
            var nf_expire = moment(sn_expire).format("YYYYMMDDHHmmss");
            var hashticket = MD5(MD5(sn_userid + nf_expire) + sn_sessionid);
            var cookie_brf = new Buffer(sn_userid + "|" + nf_expire + "|" + sn_sessionid + "|" + hashticket);
            var c_utf16le = iconv.encode(cookie_brf, "utf16le");//编码
            var cookie_str = c_utf16le.toString('base64');//转义
            if (lgreturnData.LogInfo) {//如果loginfo存在，表示有默认社区
                if (callback) {
                    var u_loginfo = lgreturnData.LogInfo;
                    callback({result: true,defaultgo:true,cookies: cookie_str, loginInfo: u_loginfo,sessionid: u_session.ID});
                }
            } else if(_.isArray(lgreturnData.Account)){
                callback({result:true,defaultgo:false,cookies: cookie_str,sessionid: u_session.ID,account:lgreturnData.Account})
            }
        }else{
            if(data.Code==1015){//帐号与密码错误
                callback({result:false,code:1015,desc:"贴与密码错误"})
            }else{

            }
        }
    });
    cnt.on("error",function(err){
        if(_this.error){
            log4js.logger.error('login error '+err.message+_this.command);
            _this.error(err);
        }
    });
};
//设置默认社区
exports.setdefaultCommunity=function(_setting,callback){
    var setting= _.extend({account_id:'',passport_id:''},_setting);
    //var flag=false,sn_expire,sn_sessionid,sn_userid;
    var param= {
        command: "CPEC.Center.Service.Account.PassportService.SetDefaultAccount",
        data:{accountID:setting.account_id, passportID: setting.passport_id}
    };
    var server_host=serverConfig["remoteIp"];
    var server_ports=serverConfig.serPorts["CPEC.Center.Service"];
    var this_command=param.command+JSON.stringify(param.data);
    var _this=this;
    var cnt= new socketClient.getRemoteData({port:server_ports,host:server_host,command:this_command});
    cnt.connecting();
    cnt.on("receiveData",function(data){
          if(callback){
              callback(data)
          }
    });
    cnt.on("error",function(err){
        if(_this.error){
            log4js.logger.error('login error '+err.message+_this.command);
            _this.error(err);
        }
    });
}

