/**
 * Created by chenshanlian on 2014/12/5.
 */
var express = require('express');
var router = express.Router();
var layout=require('../../lib/layout');

//群组主页
router.get('/home',function(req,res){
    layout.cementLayoutRender('group/home.ejs',{title:"群组首页-i8小时"},res,req);
});
//群组列表
router.get('/list',function(req,res){
    layout.commonLayoutRender('group/list.ejs',{title:"群组列表-i8小时"},res,req);
});
//群组编辑
router.get('/edit',function(req,res){
    layout.cementLayoutRender('cement/edit.ejs',{title:"公告管理-i8小时"},res,req);
});
//群组
router.get('/detial',function(req,res){
    layout.cementLayoutRender('cement/detial.ejs',{title:"公告管理-i8小时"},res,req);
});

module.exports=router;