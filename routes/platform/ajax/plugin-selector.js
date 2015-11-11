/**
 * Created by kusion on 2015/1/4.
 */
/**
 * Created by kusion on 2014/11/12.
 */
var express = require('express');
var router = express.Router();
var reqcom=require('../../../lib/reqcommon');
var resultData=require('../../../lib/resultData');
    //根据关键词查询
    router.get('/selectentity', function (req, res) {
        var person = require('../../../business/account/personInfo');
        var searchType = req.query.t;
        var typeArray = [];
        if (searchType) {
            var types=searchType.split(',');
            for(var i=0;i<types.length;i++){
                if(types[i]=='user'){
                    typeArray.push(1);
                }else if(types[i]=='org'){
                    typeArray.push(3);
                }else if(types[i]=='grp'){
                    typeArray.push(4);
                }
            }
        }
        var existIds = req.query.g;
        var existGuids = [];
        if (existIds) {
            var ext=existIds.split('|');
            for(var i=0;i<ext.length;i++){
                if(ext[i].length==36)
                    existGuids.push(ext[i]);
            }
        }
        var selectdata = {
            accountID: req.i8session.aid,
            type: typeArray,
            key: decodeURIComponent(req.query.k),
            exits: existGuids,
            domain:reqcom.getSubdomain(req)
        };
        person.selectEntity(selectdata, function (data) {
            res.json(data);
        });
    });
//获取组织结构信息
    router.get('/getorgdata',function(req,res){
        var personInfo=require('../../../business/data/org');
        var accountId=req.i8session.aid;
        if(req.i8session) {
            personInfo.getOrg({accountID: accountId, domain:reqcom.getSubdomain(req)}, function (data) {
                res.json(data);
            })
        }
    });

    router.get('/getOrgpersion',function(req,res){
        if(req.i8session) {
            var accountID = req.i8session.aid;
            var orgID = req.query.orgid;
            var orgPersaon = require('../../../business/data/org');
            orgPersaon.getOrgPerson({accountID: accountID, orgID: orgID,domain:reqcom.getSubdomain(req)}, function (data) {
                res.json(resultData(0,data));
            })
        }
    });
    router.post('/getpers',function(req,res){
        var datas=req.body.data;
        if(datas){
            var orgPersaon = require('../../../business/data/org');
            orgPersaon.getEntity({domain:reqcom.getSubdomain(req), accountID: req.i8session.aid, data: JSON.parse(datas)},function(data){
                res.json(data);
            })
        }
    });
    //var grouplib=require('../../../business/data/groups');
    router.get('/getmygroups',function(req,res){
        var uid=req.i8session.uid;
        var aid=req.i8session.aid;
        grouplib.getmygroups({domain:reqcom.getSubdomain(req),accountID:aid,passportid:uid},function(data){
            if(data.Result){
                res.json(resultData(0,{List:data.ReturnObject.Item1,Total:data.ReturnObject.Item2}));
            }
        })
    });


    router.get('/getUserInfo',function(req,res){
        var personInfo = require('../../../business/account/personInfo.js');
        var _userInfo=req.i8session;
        var _uidArr = (req.param('userID')||'').split(',');
        personInfo.getUserInfo({'accountID':_userInfo.aid,'entityIDs':_uidArr,'domain':reqcom.getSubdomain(req)},function(data){
                res.send(data);
            }
        );
    });

    router.get('/getUserFullInfo',function(req,res){
        var personInfo = require('../../../business/account/personInfo.js');
        var _userInfo=req.i8session;
        var _uid = req.param('userID')||'';
        personInfo.getUserFullInfo({'accountID':_userInfo.aid,'userID':_uid,'domain':reqcom.getSubdomain(req)},function(data){
                res.send(data);
            }
        );
    });

module.exports=router;