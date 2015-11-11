/**
 * Created by jialin on 2014/12/11.
 */
var express = require('express');
var router = express.Router();
var reqcom = require('../../../lib/reqcommon');
var userinfo = require('../../../business/users/settings/userinfo');
var _checkData = require('../../../lib/checkData.js');
//获取验证码
router.post('/addValidInfo', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
    passport=req.param('passport'),
    passportID=req.i8session.uid,
    accountID=req.i8session.aid
    userinfo.addValidInfo(_subdomain,accountID,passportID,passport,1,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//获取整个人员信息
router.post('/GetPersonInfoEntity', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        passportID=req.i8session.uid,
        accountID=req.i8session.aid
    userinfo.GetPersonInfoEntity(_subdomain,accountID,passportID,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//获取整个登入凭证
router.post('/GetPassportEntity', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
    uid=req.i8session.uid
    userinfo.GetPassportEntity(_subdomain,uid,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//提交修改邮箱
router.post('/ChangePassport', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        sessionID=req.i8session.sid,
        oldPassport=req.param('oldPassport'),
        newPassport=req.param('newPassport'),
        password=req.param('password'),
        code=req.param('vcode')
    userinfo.ChangePassport(_subdomain,sessionID,oldPassport,newPassport,password,code,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//增加新登录凭据
router.post('/SetNewPassport', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        passportID =req.i8session.uid,
        newPassport=req.param('newPassport');
    userinfo.SetNewPassport(_subdomain,passportID,newPassport,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//删除老的登录凭据
router.post('/DeletePassport', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        passportID =req.i8session.uid,
        oldPassport=req.param('oldPassport'),
        password=req.param('password');
    userinfo.DeletePassport(_subdomain,passportID,oldPassport,password,function(data){
       res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//更新同步邮箱或者手机
router.post('/UpdatePassport', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        passportID =req.i8session.uid,
        accountID =req.i8session.aid,
        newPassport=req.param('newPassport');
    userinfo.UpdatePassport(_subdomain,passportID,accountID,newPassport,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});

//获取个人信息
router.post('/GetPerson', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        passportID =req.i8session.uid,
        accountID =req.i8session.aid
    userinfo.GetPerson(_subdomain,accountID,passportID,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//更新个人信息
router.post('/UpdateInfo', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        passportID =req.i8session.uid,
        psn =req.param('subData'),
        accountID =req.i8session.aid;
    psn.passportID=passportID;
    userinfo.UpdateInfo(_subdomain,accountID,psn,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//获取工作信息或者教育信息
router.post('/GetExperience', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        passportID =req.i8session.uid,
        expType =req.param('expType');
    userinfo.GetExperience(_subdomain,passportID,expType,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//保存工作信息或者教育信息
router.post('/SaveExperience', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        passportID =req.i8session.uid,
        entity =req.param('entity');
    entity.passportID=passportID;
    userinfo.SaveExperience(_subdomain,entity,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//删除工作信息或者教育信息
router.post('/DeleteExperience', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        id =req.param('id');
    userinfo.DeleteExperience(_subdomain,id,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//获取随机标签
router.post('/SuggestLables', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        except =req.param('except'),
        accountID =req.i8session.aid,
        count=3;
    userinfo.SuggestLables(_subdomain,accountID,count,except,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//保存标签
router.post('/UpdateLabel', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        labels =req.param('labels'),
        accountID =req.i8session.aid,
        passportID =req.i8session.uid
    userinfo.UpdateLabel(_subdomain,accountID,passportID,labels,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//修改密码
router.post('/ChangePassword', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        newPassword =req.param('newPassword'),
        oldPassword =req.param('oldPassword'),
        passportID =req.i8session.uid
    userinfo.ChangePassword(_subdomain,passportID,oldPassword,newPassword,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
//设置提醒设置
router.post('/UpdateAlarm', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        alarm =req.param('alarm'),
        passportID =req.i8session.uid,
        accountID =req.i8session.aid
    userinfo.UpdateAlarm(_subdomain,accountID,passportID,alarm,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});

////获取通讯录（获取人员组织架构）
router.post('/GetDefaultOrgTree', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req),
        accountID =req.i8session.aid
    userinfo.GetDefaultOrgTree(_subdomain,accountID,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});



router.post('/checkMailVcode', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    userinfo.checkMailVcode(_subdomain,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
router.post('/checkMailPsw', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    userinfo.checkMailPsw(_subdomain,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});

router.post('/subChageMailorMobile', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    userinfo.subChageMail(_subdomain,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
router.post('/getMobileVCode', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    userinfo.subChageMail(_subdomain,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
router.post('/checkMobileVcode', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    userinfo.subChageMail(_subdomain,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});
router.post('/getTipsSet', function(req, res) {
    var _subdomain = reqcom.getSubdomain(req);
    userinfo.getTipsSet(_subdomain,function(data){
        res.send(JSON.stringify(_checkData.Check(data)));
    });
});






module.exports=router;