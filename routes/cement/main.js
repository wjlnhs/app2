/**
 * Created by chenshanlian on 2014/12/5.
 */
var express = require('express');
var router = express.Router();
var layout=require('../../lib/layout');
var ckModules = require('../../business/app/cement.js');
var _checkData = require('../../lib/checkData.js');
var reqcom = require('../../lib/reqcommon');

//公告管理列表
router.get('/manager',function(req,res){
    layout.cementLayoutRender('cement/manager.ejs',{title:"公告管理-i8小时"},res,req);
});
//公告列表
router.get('/list',function(req,res){
    layout.commonLayoutRender('cement/list.ejs',{title:"公告管理-i8小时"},res,req);
});
//公告编辑
router.get('/edit',function(req,res){
    layout.cementLayoutRender('cement/edit.ejs',{title:"公告管理-i8小时"},res,req);
});
//公告详细
router.get('/detial',function(req,res){
    layout.cementLayoutRender('cement/detial.ejs',{title:"公告管理-i8小时"},res,req);
});

//新增公告
router.get('/add-cement', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    ckModules.addCement(_subdomain, req,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//修改公告
router.get('/update-cement', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    ckModules.updateCement(_subdomain, req,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//获取公告列表
router.get('/get-cement', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    ckModules.getAnnouncementListParam(_subdomain, req,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//获取公告详情
router.get('/get-cementid', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    ckModules.getAnnouncementParam(_subdomain, req,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//删除公告
router.get('/del-cement', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    ckModules.deleteAnnouncementParam(_subdomain, req,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//获取可用的分类信息
router.get('/get-type', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    ckModules.getCategoryListParam(_subdomain, req,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//删除分类
router.get('/del-type', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    ckModules.deleteCategoryParam(_subdomain, req,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//新增分类
router.get('/add-type', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    ckModules.addCategoryParam(_subdomain, req,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
module.exports=router;