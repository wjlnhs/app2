/**
 * Created by chenshanlian on 2014/12/22.
 */
var asyncData=require('./../common/asyncGetData.js');
var syncData=require('./../common/getDataByCMD.js');
var thenJs=require('thenjs');
//var reqcom=require('../../lib/reqcommon');
var _ = require('underscore');
var _getNewMembers = function(_subdomain,accountID, topN , callback){
    var pData = {
        accountID: accountID,
        topN: topN
    };
    var param = {
        command: "CPEC.Platform.Service.Platform.PersonInfoService.GetNewMate",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
var _getApps = function(req, callback){
    callback({Result:true, ReturnObject:[
        {name:'工作流',num:'1',bgtype:'sprite-45'},
        {name:'周报日报',bgtype:'sprite-46'},
        {name:'日程',bgtype:'sprite-47'},
        {name:'任务',bgtype:'sprite-48'},
        {name:'微邮',bgtype:'sprite-49'}
    ]});
}
var _getLinks = function(req, callback){
    var uid = req.param('uid');
    if(uid){
        callback({Result:true, ReturnObject:[
            {name:'公司点餐系统',url:'http://www.baidu.com'},
            {name:'bug管理系统',url:'http://www.weixin.com'},
            {name:'投资管理系统',url:'http://www.qq.com'}
        ]});
    }else{
        callback({Result:true, ReturnObject:[
            {name:'公司点餐系统',url:'http://www.baidu.com'},
            {name:'bug管理系统',url:'http://www.weixin.com'},
            {name:'投资管理系统',url:'http://www.qq.com'},
            {name:'公司点餐系统',url:'http://www.baidu.com'},
            {name:'bug管理系统',url:'http://www.weixin.com'},
            {name:'投资管理系统',url:'http://www.qq.com'}
        ]});
    }
}
var _updateSet = function(req, callback){
    callback({Result:true, Description:'设置成功'});
}
var _getBirthday = function(_subdomain,accountID, topN, callback){
    var pData = {
        accountID: accountID,
        topN: topN
    };
    var param = {
        command: "CPEC.Platform.Service.Platform.PersonInfoService.GetBirthMate",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
var _getHotTopic = function(_subdomain,accountID, topN, callback){
    var pData = {
        accountID: accountID,
        grpID: '00000000-0000-0000-0000-000000000000',
        topN: topN
    };
    var param = {
        command: "CPEC.Platform.Service.Blog.TopicHotService.GetHotTopic",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
var _getBBs = function(req, callback){
    callback({Result:true, Description:'', ReturnObject:[
        {ID:'',name:'天弘基金加速进入移动互联时代',url:'http://blog.i8xiaoshi.com/post/101.html'},
        {ID:'',name:'微信企业号首款应用正式上线', url:'http://blog.i8xiaoshi.com/post/100.html'},
        {ID:'',name:'i8小时9月24日升级提醒',url:'http://blog.i8xiaoshi.com/post/99.html'},
        {ID:'',name:'微信企业号，打老虎还是拍苍蝇？', url:'http://blog.i8xiaoshi.com/post/98.html'},
        {ID:'',name:'i8小时流程设计培训精彩分享',url:'http://blog.i8xiaoshi.com/post/97.html'},
        {ID:'',name:'i8小时9月24日升级提醒',url:'http://blog.i8xiaoshi.com/post/99.html'},
        {ID:'',name:'微信企业号，打老虎还是拍苍蝇？', url:'http://blog.i8xiaoshi.com/post/98.html'},
        {ID:'',name:'i8小时流程设计培训精彩分享',url:'http://blog.i8xiaoshi.com/post/97.html'}
    ]});
}
var _updateModues = function(_subdomain, req, callback){
    var accountID = req.i8session.aid;
    var passportID = req.i8session.uid;
    var portal = req.param('portal');
    var pData = {
        accountID: accountID,
        passportID : passportID,
        portal: portal
    };
    var param = {
        command: "CPEC.Platform.Service.Platform.PersonInfoService.UpdatePortal",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
exports.getNewMembers = _getNewMembers;
exports.getApps = _getApps;
exports.getLinks = _getLinks;
exports.updateSet = _updateSet;
exports.getBirthday = _getBirthday;
exports.getHotTopic = _getHotTopic;
exports.getBBs = _getBBs;
exports.updateModues = _updateModues;