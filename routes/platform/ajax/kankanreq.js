/**
 * Created by kusion on 2015/1/4.
 */
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
var kankanReq=require('../../../business/account/kankancommon');
var _=require('underscore');
var moment=require('moment');
//保存侃侃
router.post('/postblog',function(req,res){
    if(req.i8session) {
        var _ScopeType=req.body.scopeType||1,_Attachment=req.body.attachments||[],_KankanContent=req.body.kankanContent||"";
        var entityBody={
            CreaterID:req.i8session.uid,
            Message:_KankanContent,
            MessageType:1,
            AtUsers:{},
            ScopeType:_ScopeType,
            AppID:"00000000-0000-0000-0000-000000000000",
            FileIDs:[],
            Client:0
        };
        kankanReq.saveKankanPostBlog({postData:entityBody,accountID:req.i8session.aid,userID:req.i8session.uid},req.i8session.subdomain,function(data){
            if(data.Result){
                res.json(resultData(0,data.ReturnObject));
            }else{
                res.json(resultData(data.Code,{}));
            }
        });
    }
});
//获取侃侃列表
router.get('/getblogslist',function(req,res){
    if(req.i8session){
        var params={
            accountID:req.i8session.aid,
            userID:req.i8session.uid,
            dateTime:req.query.time||moment().format("YYYY-MM-DD HH:mm:ss"),
            pageSize:req.query.size||20,
            pageIndex:req.query.index||1
        };
        if(req.query.type==1||req.query.type==2){
            params['msgType']=req.query.type;
        }
        if(req.query.apps){
            if(req.query.apps.length==36||req.query.apps.length==32){
                params['appIDs']=[req.query.apps];
            }
        }
        kankanReq.getKKBlogsList(params,req.i8session.subdomain,function(data){
            if(data.Result){
                res.json(data);
            }else{
                res.json(resultData(data.Code,{Description:"服务请求数据失败！"}));
            }
        })
    }
});
//删除侃侃
router.get('/blogs-del',function(req,res){
    if(req.i8session){
        var param={
            accountID:req.i8session.aid,
            userID:req.i8session.uid,
            blogID:req.query.id
        };
        kankanReq.deleteBlog(param,req.i8session.subdomain,function(data){
            if(data.Result){
                res.json(data);
            }else{
                res.json(resultData(data.Code,{Description:"服务请求数据失败！"}))
            }
        })
    }
});
//添加评论
router.post('/comment-add',function(req,res){
   if(req.i8session){
       var _comment={
           CreaterID:req.i8session.uid,
           Message:req.body.msgContent||"",
           BlogID:req.body.fatherkkid||"",
           AtUsers:{},
           FileIDs:[]
       };
       kankanReq.addComment({accountID:req.i8session.aid,userID:req.i8session.uid,comment:_comment},req.i8session.subdomain,function(data){
           if(data.Result){
               res.json(data);
           }else{
               res.json(resultData(data.Code,{Description:"服务请求数据失败！"}))
           }
       })
   }
});
module.exports=router;