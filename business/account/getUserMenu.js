/**
 * Created by chent696 on 2014/10/27.
 */
var _=require('underscore');
var asyncData=require('../common/asyncGetData.js');
var thenJs=require('thenjs');
exports.getUserMenuByAccount = function(req,callback){
   //console.log('data='+ );
    var _userInfoStr = req.i8session;//.userBaseInfo;
    if(!_userInfoStr){
        return;
    }
    var _userInfo = {};
    if(typeof _userInfoStr !== 'object') {
         _userInfo = JSON.parse(_userInfoStr);
    }else{
        _userInfo = _userInfoStr;
    }
    if(!_userInfo){
        return;
    }

    thenJs(function(cont){
        var reqcom=require('../../lib/reqcommon');
        var hostName=reqcom.getSubdomain(req);
        //console.log('recieve data'+JSON.stringify(_userInfo));
        var jData = { "accountID":_userInfo.aid,"userID":_userInfo.uid};
        //console.log('userData='+JSON.stringify(jData));
        var param={
            command: "CPEC.WorkflowService.Service.NavigationService.GetNavigation",
            subdomain:hostName,
            data:jData
        };
       asyncData.getWorkflowServiceByThen(cont,param);
    }).then(function(cont,data){
       // console.log('userData='+data);
        if(data.Result){
            callback(data);
        }else{
            callback(data);
        }
   }).fail(function(cont,data){
        callback({result:false,data:data});
    })

}