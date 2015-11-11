/**
 * Created by jialin on 2014/12/15.
 */
var express = require('express');
var router = express.Router();
var process = require('../../business/process/process');
var context = require('../../business/process/context');
var resRender = require('../../lib/layout');
var reqcom = require('../../lib/reqcommon');
var thenJs=require('thenjs');
var errorMsg = require('../../configs/info_cn');
router.get('/settings/info', function(req, res) {
    resRender.mainLayoutRender('/user/setting/userInfo',{subData: '子模板数据！', title: '流程待办'},res,req);
});