/**
 * Created by kusion on 2014/12/2.
 * 用于获取用户的帐套的上下文信息
 */
var remoteReq=require('../common/getDataByCMD');
var resConfig=require('../../configs/resConfig');
//var ucache=require('../../lib/cache');
var _=require('underscore');
exports.getContextInfo=function(setting,callback) {
    var account_id=setting.account_id;
    var passport_id=setting.passport_id;
    var domain=setting.domain;
    //var user_info_key=hostName+"_userBaseInfo_"+passportID;
    var getuInfo = new remoteReq.getPlatformService({
        subdomain: domain,
        command: 'CPEC.Platform.Service.Platform.PersonInfoService.GetPersonInfo',
        data: {accountID: account_id, passportID: passport_id},
        success: function (data) {
            if (data.Result) {
                //console.log('从重新获取了新的内容哦哦哦！！！')
                var newData = data.ReturnObject;
                var baseInfo = _.extend(newData, resConfig);
                baseInfo['subdomain'] = domain;
                if(callback){
                    callback(baseInfo);
                }
            } else {
               if(callback){
                   callback(null);
               }
            }
        },
        error: function (err) {
            if(callback){
                callback(null);
            }
        }
    });
    getuInfo.init();
}