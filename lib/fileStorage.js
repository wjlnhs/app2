/**
 * Created by kusion on 2014/11/17.
 */
var qiniu=require('../business/common/qiniuStorage');
var i8storage=require('../business/data/storage');
var _=require('underscore');
var logger=require('./log');
exports.i8InsertMeta=function(setting,callbackFnc){
    var settings= _.extend({filetype:'attachment',domain:'',accountid:'',passportid:'',filedata:[],pmts:[]},setting);
    var afile={"filetype":"attachment",accountid:'',passportid:'',fileOrginalPath:''};
    qiniu.postFileToQN(settings,function(resp){
        if(resp.result){
            var files=[];
            //logger.logger.debug('total lib :'+JSON.stringify(resp));
            _.each(resp.data,function(data){
                //logger.logger.debug('each data key:'+JSON.stringify(data));
                var _setFname=data.key.substr(data.key.lastIndexOf('/')+1,data.key.length);
                var file_id=_setFname.split('.')[0];
                var fileObj=_.findWhere(settings.filedata,{fileid:file_id});
                var file_name= fileObj.originalname;
                files.push({id:file_id,size:data['x:size'],url:data['url'],name:file_name,ext:fileObj.extension});
            });
            //图片信息入库
            i8storage.insertMeta({
                domain:settings.domain,
                accountID:settings.accountid,
                userID:settings.passportid,
                files:files,
                pmts:settings.pmts
            },callbackFnc);
        }else{
            if(callbackFnc){
                callbackFnc({result:false,data:'QN远程存储失败!'+resp.error});
            }
        }
    })
}