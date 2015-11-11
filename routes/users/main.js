/**
 * Created by kusion on 2014/12/9.
 */
var express = require('express');
var router = express.Router();
var layout=require('../../lib/layout');
var reqcom = require('../../lib/reqcommon');
var userinfo = require('../../business/users/settings/userinfo');
var _checkData = require('../../lib/checkData.js');
var moment=require('moment');
var ejs=require('ejs');

//设置中心
router.get('/settings',function(req,res){
    res.redirect('/users/settings/userinfo');
});

//个人信息
router.get('/settings/info', function(req, res) {
    //获取个人资料
    var _subdomain = reqcom.getSubdomain(req),
        passportID=req.i8session.uid,
        accountID=req.i8session.aid
    ejs.filters.dateformat = function(obj, format) {
        if (format == undefined) {
            format = 'YYYY-MM-DD HH:mm:ss';
        }
        var ret = moment(obj).format(format);
        return ret == 'Invalid date' ? '0000-00-00 00:00:00' : ret;
    };

    userinfo.GetPerson(_subdomain,accountID,passportID,function(data){
        Person=_checkData.removeNull(data.ReturnObject);
        PBI=_checkData.removeNull(data.ReturnObject);
        Today=new Date();
        Today=Today.getFullYear()+'-'+parseInt(Today.getMonth()+1)+'-'+Today.getDate();
        userinfo.GetPassportEntity(_subdomain,passportID,function(data){
            //个人信息
            IdentitysResult=data.result;
            Identitys=_checkData.removeNull(data.ReturnObject);
            userinfo.GetExperience(_subdomain,passportID,1,function(data){
                //工作信息
                jobDataResult=data.Result;
                jobData=_checkData.removeNull(data.ReturnObject);
                if(jobData.length>0){
                    jobData=jobData.sort(function(a,b){
                        return new Date(b.StartTime).getTime()- new Date(a.StartTime).getTime();
                    })
                }
                //教育信息
                userinfo.GetExperience(_subdomain,passportID,2,function(data){
                    eduDataResult=data.Result;
                    eduData=_checkData.removeNull(data.ReturnObject);
                    if(eduData.length>0){
                        eduData=eduData.sort(function(a,b){
                            return new Date(b.StartTime).getTime()- new Date(a.StartTime).getTime();
                        })
                    }
                    layout.commonLayoutRender('users/setting/userinfo',{title:"个人信息--i8小时",PBI:PBI,Person:Person,IdentitysResult:IdentitysResult,jobData:jobData,Identitys:Identitys,jobDataResult:jobDataResult,eduDataResult:eduDataResult,eduData:eduData,Today:Today},res,req);
                })
            })
        })

        //console.log(data)
    })
    /*userinfo.getPersonaldata(_subdomain,function(data){
        Person=_checkData.removeNull(data.ReturnObject.Preson);
        PBI=_checkData.removeNull(data.ReturnObject.PBI);
        Today=new Date();
        Today=Today.getFullYear()+'-'+parseInt(Today.getMonth()+1)+'-'+Today.getDate();
        //工作信息
        userinfo.getOccupationInformationdata(_subdomain,function(data){
            jobDataResult=data.Result;
            jobData=_checkData.removeNull(data.ReturnObject);
            //教育信息
            userinfo.getEduInformationdata(_subdomain,function(data){
                eduDataResult=data.Result;
                eduData=_checkData.removeNull(data.ReturnObject);
                layout.commonLayoutRender('users/setting/userinfo',{title:"个人信息--i8小时",PBI:PBI,Person:Person,jobData:jobData,jobDataResult:jobDataResult,eduDataResult:eduDataResult,eduData:eduData,Today:Today},res,req);
            })
        })
        //res.send(JSON.stringify(_checkData.Check(data)));
    });*/

});

//头像修改
router.get('/settings/header',function(req,res){

    layout.commonLayoutRender('users/setting/userHeader',{title:"头像修改--i8小时"},res,req);
});

//密码修改
router.get('/settings/pwdreset',function(req,res){

    layout.commonLayoutRender('users/setting/userPwd',{title:"密码修改--i8小时"},res,req);
});

//提醒设置
router.get('/settings/tips',function(req,res){
    var _subdomain = reqcom.getSubdomain(req);
    userinfo.getTipsSet(_subdomain,function(data){
        Result=data.Result;
        data=_checkData.removeNull(data.ReturnObject[0]);
        layout.commonLayoutRender('users/setting/userTips',{title:"提醒设置--i8小时",data:data,Result:Result},res,req);
    })
})

//插件
router.get('/settings/communityPlugin',function(req,res){

    layout.commonLayoutRender('controls/ucenter/communityPlugin',{title:"插件"},res,req);
})

module.exports=router;