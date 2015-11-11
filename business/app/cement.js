/**
 * Created by chenshanlian on 2015/01/06.
 */
var asyncData=require('./../common/asyncGetData.js');
var syncData=require('./../common/getDataByCMD.js');
//var reqcom=require('../../lib/reqcommon');
var _ = require('underscore');
//新增公告
var _addCement = function(_subdomain,req, callback){
    var accountID = req.i8session.aid;
    var passportID = req.i8session.uid;
    var categoryID = req.param('categoryID');
    var title = req.param('title');
    var content = req.param('content');
    var releaseType = req.param('releaseType');
    var sendTime = req.param('sendTime');
    var scope = req.param('scope');
    var attachment = req.param('attachment');
    var status = req.param('status');
    var pData = {
        accountID: accountID,
        passportID: passportID,
        categoryID: categoryID,
        title: title,
        content: content,
        releaseType: releaseType,
        sendTime: sendTime,
        scope: scope,
        attachment: attachment,
        status:status
    };
    var param = {
        command: "CPEC.Apps.Service.Announcement.AnnouncementService.AddAnnouncement",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
//修改公告
var _updateCement = function(_subdomain,req, callback){
    var accountID = req.i8session.aid;
    var passportID = req.i8session.uid;
    var announID = req.param('announID');
    var categoryID = req.param('categoryID');
    var title = req.param('title');
    var content = req.param('content');
    var releaseType = req.param('releaseType');
    var sendTime = req.param('sendTime');
    var scope = req.param('scope');
    var attachment = req.param('attachment');
    var status = req.param('status');
    var pData = {
        accountID: accountID,
        passportID: passportID,
        categoryID: categoryID,
        announID: announID,
        title: title,
        content: content,
        releaseType: releaseType,
        sendTime: sendTime,
        scope: scope,
        attachment: attachment,
        status:status
    };
    var param = {
        command: "CPEC.Apps.Service.Announcement.AnnouncementService.UpdateAnnouncement",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
//获取公告列表
var _getAnnouncementListParam = function(_subdomain,req, callback){
    var accountID = req.i8session.aid;
    var passportID = req.i8session.uid;
    var isManage = req.param('isManage');
    var index = req.param('index');
    var size = req.param('size');
    var pData = {
        accountID: accountID,
        passportID: passportID,
        isManage: isManage,
        index: index,
        size: size
    };
    var param = {
        command: "CPEC.Apps.Service.Announcement.AnnouncementService.GetAnnouncementList",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
//获取公告详情
var _getAnnouncementParam = function(_subdomain,req, callback){
    var accountID = req.i8session.aid;
    var passportID = req.i8session.uid;
    var announcementID = req.param('announcementID');
    var pData = {
        accountID: accountID,
        passportID: passportID,
        announcementID: announcementID
    };
    var param = {
        command: "CPEC.Apps.Service.Announcement.AnnouncementService.GetAnnouncement",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
//删除公告
var _deleteAnnouncementParam = function(_subdomain,req, callback){
    var accountID = req.i8session.aid;
    var passportID = req.i8session.uid;
    var announcementID = req.param('announcementID');
    var pData = {
        accountID: accountID,
        passportID: passportID,
        announcementID: announcementID
    };
    var param = {
        command: "CPEC.Apps.Service.Announcement.AnnouncementService.DeleteAnnouncement",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
//获取可用的分类信息
var _getCategoryListParam = function(_subdomain,req, callback){
    var accountID = req.i8session.aid;
    var passportID = req.i8session.uid;
    var announcementID = req.param('announcementID');
    var pData = {
        accountID: accountID
    };
    var param = {
        command: "CPEC.Apps.Service.Announcement.AnnounCategoryService.GetCategoryList",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
//删除分类
var _deleteCategoryParam = function(_subdomain,req, callback){
    var accountID = req.i8session.aid;
    var categoryID = req.param('categoryID');
    var pData = {
        accountID: accountID,
        categoryID: categoryID
    };
    var param = {
        command: "CPEC.Apps.Service.Announcement.AnnounCategoryService.GetCategoryList",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
//新增分类
var _addCategoryParam = function(_subdomain,req, callback){
    var accountID = req.i8session.aid;
    var name = req.param('name');
    var passportID = req.i8session.uid;
    var pData = {
        accountID: accountID,
        passportID: passportID,
        name: name
    };
    var param = {
        command: "CPEC.Apps.Service.Announcement.AnnounCategoryService.AddCategory",
        data: pData,
        subdomain: _subdomain,
        success: function (data) {
            callback(data);
        }
    };
    var org = syncData.getPlatformService(param);
    org.init();
}
exports.addCement = _addCement;
exports.updateCement = _updateCement;
exports.getAnnouncementListParam = _getAnnouncementListParam;
exports.getAnnouncementParam = _getAnnouncementParam;
exports.deleteAnnouncementParam = _deleteAnnouncementParam;
exports.getCategoryListParam = _getCategoryListParam;
exports.deleteCategoryParam = _deleteCategoryParam;
exports.addCategoryParam = _addCategoryParam;
