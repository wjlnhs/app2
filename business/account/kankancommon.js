/**
 * Created by kusion on 2015/1/4.
 */
var syncData=require('../common/getDataByCMD.js');
var reqcom=require('../../lib/reqcommon');
var reqcom=require('../../lib/resultData');
var _ = require('underscore');

var saveKankanPost=function(_setting,_domain,callback){
    var setting= _.extend({accountID:"",userID:"",postData:{} },_setting);
    var params={
        command:'CPEC.Platform.Service.Blog.BlogService.Add',
        data:{entity:setting.postData,accountID:setting.accountID,userID:setting.userID},
        subdomain:_domain,
        success:function(data){
            if(callback){
                callback(data);
            }
        },
        error:function(data){
            if(callback){
                callback(data);
            }
        }
    }
    var asyobj=syncData.getPlatformService(params);
    asyobj.init();
};
var getKankanList=function(_setting,_domain,callback){
    var postData= _.extend({accountID:"",userID:"",dateTime:"",pageSize:10,pageIndex:1},_setting);
    var param={
        command:"CPEC.Platform.Service.Blog.BlogService.GetPubList",
        data:postData,
        subdomain:_domain,
        success:function(data){
            if(callback){
                callback(data);
            }
        },
        error:function(data){
            if(callback){
                callback(data);
            }
        }
    };
    var asyobj=syncData.getPlatformService(param);
    asyobj.init();
};
exports.getKKBlogsList=getKankanList;
exports.saveKankanPostBlog=saveKankanPost;