/**
 * Created by kusion on 2014/11/15.
 */
var fs = require('fs');
var path = require('path');
var qn=require('qn');
var crypto = require('crypto');
var qnConfig=require('../../configs/qiniuConfig');
var FILETYPE=require('../../configs/fileType');
var util=require('util');
var _=require('underscore');
var thenjs=require('thenjs');
var log=require('../../lib/log');
var aFileSender=function(cont,option){
    var file_sets= _.extend({"filetype":"attachment",accountid:'',passportid:'',fileOrginalPath:'',fileid:'',extension:''},option);
    var _keyStr="",fileObj=FILETYPE[file_sets.filetype];
    var client=qn.create({
        accessKey:qnConfig.accessKey,
        secretKey:qnConfig.secretKey,
        bucket:fileObj.bucket,
        domain:fileObj.domain
    });
    if(file_sets.filetype=="attachment"){
        _keyStr=util.format(fileObj.format,file_sets.accountid,file_sets.fileid+"."+file_sets.extension);
    }else{
        _keyStr=util.format(fileObj.format,file_sets.fileid+"."+file_sets.extension);
    }
    //log.logger.debug('qn upload a file linux path :'+process.cwd()+file_sets.fileOrginalPath);
    client.uploadFile(process.cwd()+file_sets.fileOrginalPath,{key:_keyStr},function(err,result){
        //log.logger.debug('qn upload a file result:'+JSON.stringify(result));
        //log.logger.debug('qn upload a file result error info:'+JSON.stringify(err));
        if(_.isObject(result)){
            cont(null,result);
        }else{
            cont(null,file_sets.fileOrginalPath+'远程存储出错！');
        }
    })
}

exports.postFileToQN=function(settting,callbackFun){
    var file_sets= _.extend({"filetype":"attachment",accountid:'',filedata:[]},settting);
    var Thenjs=require('thenjs');
    var fileList=[];
    _.each(file_sets.filedata,function(data){
        fileList.push({"filetype":file_sets.filetype, accountid:file_sets.accountid, fileOrginalPath:"/"+data.path, fileid:data.fileid,extension:data.extension});
    })
    Thenjs.each(fileList,function(cont,value){
        aFileSender(cont,value);
    }).then(function(cont,result){
        if(callbackFun){
            callbackFun({result:true,data:result});
        }
    }).fail(function(cont,err){
        if(callbackFun){
            callbackFun({result:false,error:err});
        }
    })
}


//下载文件
var downloadFile=function(qnFileName, documentPath, callbackFun){
    var file_sets = _.extend({"filetype": "attachment", accountid: '', passportid: '', fileOrginalPath: '', fileid: '', extension: ''});
    var fileObj = FILETYPE[file_sets.filetype];
    var client = qn.create({
        accessKey: qnConfig.accessKey,
        secretKey: qnConfig.secretKey,
        bucket: fileObj.bucket,
        domain: fileObj.domain
    });
    var file = qnFileName.substring(qnFileName.lastIndexOf('/') + 1, qnFileName.length);//真实的文件名
    //先将文件下载到本地documentPath目录（即resource/document文件夹中）
    var filePathName = path.join(documentPath, file);
    client.download(qnFileName, function (err, content, response) {
        if (err) {
            console.error('下载文件失败，错误信息：' + err);
            throw err;
        }
        if(!fs.existsSync(documentPath)){
            fs.mkdirSync(documentPath);
        }
        fs.writeFile(filePathName, content, function (err) {
            if (err) {
                console.error('下载文件失败，错误信息：' + err);
                throw err;
            }
            console.log('下载文件成功');
            if(callbackFun) {
                callbackFun(content);
            }
        });
    });
}

exports.downloadFile = function(qnFileName, documentPath, callbackFun){
    downloadFile(qnFileName, documentPath, callbackFun);
}


//读取文件
exports.ReadFile=function(fileName, documentPath, isQNFile, callbackStat){
    var isExistLocalFile = false;
    var filePathName = "";//文件存放在本地的路径+文件名
    if(isQNFile){
        //七牛云存储
        var file = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length);//真实的文件名
        filePathName = path.join(documentPath, file);
        //判断本地文件夹中是否已经存在文件
        if(!fs.existsSync(filePathName)){
            //之前没有下载（不存在文件时，下载文件）
            downloadFile(fileName, documentPath, function(content){
                var file = fs.ReadStream(filePathName);
                var sha256 = crypto.createHash('sha256');
                var chunks = [];
                file.on('data', function (chunk) {
                    chunks.push(chunk);
                    sha256.update(chunk);
                });
                file.on('end', function () {
                    console.log('读取文件成功');
                    var shaValue = sha256.digest('base64');
                    //统计文件基本信息
                    if(callbackStat) {
                        fs.stat(filePathName, function (err, data) {
                            if (err) throw err;
                            callbackStat(data, shaValue);
                        });
                    }
                });
            });
        } else {
            //之前已经下载过（本地文件夹中已经存在文件）
            isExistLocalFile = true;
        }
    } else {
        //本地存储
        filePathName = path.join(documentPath, fileName);
        isExistLocalFile = true;
    }
    if(isExistLocalFile) {
        var file = fs.ReadStream(filePathName);
        var sha256 = crypto.createHash('sha256');
        var chunks = [];
        file.on('data', function (chunk) {
            chunks.push(chunk);
            sha256.update(chunk);
        });
        file.on('end', function () {
            console.log('读取文件成功');
            var shaValue = sha256.digest('base64');
            //统计文件基本信息
            if(callbackStat) {
                fs.stat(filePathName, function (err, data) {
                    if (err) throw err;
                    callbackStat(data, shaValue);
                });
            }
        });
    }
}
