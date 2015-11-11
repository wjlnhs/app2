/**
 * Created by jialin on 2014/12/9.
 */
var express = require('express');
var router = express.Router();
var reqcom = require('../../lib/reqcommon');
var globalSearch = require('../../business/account/global-search.js');
var _checkData = require('../../lib/checkData.js');
router.get('/globalsearch', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    globalSearch.globalSearch(_subdomain,function(data){
        // res.send(JSON.stringify(_checkData.Check(data)));
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
router.get('/contacts', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    var resRender = require('../../lib/layout');
    var ejs=require('ejs');
    resRender.commonLayoutRender('ucenter/contacts', {subData: '子模板数据！', title: 'i8通讯录'}, res,req);
});

module.exports=router;