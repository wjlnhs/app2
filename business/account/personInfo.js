/**
 * Created by kusion on 2014/10/23.
 */
var _=require('underscore');
var asyncData=require('../common/asyncGetData.js');
var syncData=require('../common/getDataByCMD.js');
var thenJs=require('thenjs');
var resultData = require('../../lib/resultData.js');
exports.selectEntity = function(_entityInfo, callback) {
    var entityInfo=_.extend({domain:'', accountID:'',type:[1], key:'',limit:5,exits:[]},_entityInfo);
    thenJs(function(cont){
        var pData={
                accountID:entityInfo.accountID,
                key:entityInfo.key,
                type:entityInfo.type,
                TopCount:entityInfo.limit,
                exits:entityInfo.exits
        };
        var param={
            command:"CPEC.Platform.Service.Platform.KeywordService.GetSearchMembersByKey",
            data:pData,
            subdomain:entityInfo.domain
        };
        asyncData.getPlatformServiceByThen(cont,param);
    }).then(function(cont,data){
        var usersInfo = [];
        if(data.Result) {
            data = data.ReturnObject;
            var i;
            if (data.Persons != null) {
                for (i = 0; i < data.Persons.length; i++) {
                    var userInfo = data.Persons[i];
                    usersInfo.push({ "guid": userInfo.PassportID, "name": userInfo.Name, "datatype": "user", "department": userInfo.OrgName, "passport": userInfo.Passport, "headimg": userInfo.HeadImage });
                }
            }
            var orginfo = [];
            if (data.Orgs != null) {
                for (i = 0; i < data.Orgs.length; i++) {
                    var org = data.Orgs[i];
                    orginfo.push({ "guid": org.ID, "name": org.OrgName, "datatype": "org" });
                }
            }
            var groupinfo = [];
            if (data.Groups != null) {
                for (i = 0; i < data.Groups.length; i++) {
                    var group = data.Groups[i];
                    groupinfo.push({ "guid": group.ID, "name": group.Name, "datatype": "grp" });
                }
            }
            callback(resultData(0, {"user": usersInfo, "grp": groupinfo, "org": orginfo}));
        }
        else
            callback(data);
    }).fail(function(cont,data){
        callback(data);
    });
};

exports.getUserInfo = function(_userInfo, callback) {
    var userInfo = _.extend({domain:'', accountID: '', entityIDs: []}, _userInfo);
    var pData = {
        accountID: userInfo.accountID,
        entityIDs: userInfo.entityIDs
    };
    var param = {
        command: "CPEC.DataService.Person.PersonInfoService.GetList",
        data: pData,
        subdomain: userInfo.domain,
        success:function(data){
            callback(data);
        }
    };
    var user = syncData.getDataService(param);
    user.init();
};
