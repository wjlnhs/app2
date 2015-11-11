/**
 * Created by jialin on 2014/12/8.
 */
var asyncData=require('../common/asyncGetData');
var syncData=require('../common/getDataByCMD.js');
var thenJs=require('thenjs');
var reqcom=require('../../lib/reqcommon');
var reqcom=require('../../lib/resultData');
var _ = require('underscore');

//申请记录
var globalSearch=function(_subdomain,callback){
    /*thenJs(function(cont){
        var jData = {
            account:accountID,
            user:userID,
            pageIndex:pageIndex,
            pageSize:pageSize,
            param:QueryParams
        };
        var param={
            command:"CPEC.WorkflowService.Service.ProcessService.GetApplicationRecordsByQueryParam",
            data:jData,
            subdomain:_subdomain
        };
        asyncData.getWorkflowServiceByThen(cont,param);
    }).then(function(cont,data){
        callback({'title':'test'});
    })*/
    callback({Result:{'title':'test'}});

}
exports.globalSearch=globalSearch;