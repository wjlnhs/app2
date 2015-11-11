/**
 * Created by kusion on 2014/10/27.
 */
var ucookie;
var ucontext={};
var ucacheBase={};
var _=require('underscore');
var serverConfig=require('../configs/serverConfig');
var redis=require('redis');
var log4js=require('./log');
var rClient=redis.createClient(serverConfig.redisPort,serverConfig.redisHost,{connect_timeout:100});
rClient.on("error",function(err){
    log4js.logger.error('redis error:'+err.message);
});
exports.setCache=function(key,value,fncallback){
    if(key&&value) {
        var saveData= _.isObject(value)?JSON.stringify(value):value;
        rClient.set(key, saveData, function (err, res) {
            if (!err) {
                if (fncallback) {
                    fncallback({result:true,data:res});
                }
            }else{
                if (fncallback) {
                    fncallback({result:false,data:err});
                }
            }
        });
        //rClient.end();
    }else{
        if (fncallback) {
            fncallback({result:false,data:'Key or value is null!'});
        }
    }
};
exports.hGetCache=function(key,field,fncallback){
    if(key) {
        rClient.hget(key,field, function (err, res) {
            if (!err&&res) {
                var newData = null;
                try {
                    newData = JSON.parse(res);
                } catch (ex) {
                    newData = res;
                }
                if (fncallback) {
                    fncallback({result: true, data: newData});
                }else{
                    return;
                }
            }else {
                if(fncallback){
                    fncallback({result:false,data:res});
                }else{
                    return;
                }
            }
        });
        //rClient.end();
    }else{
        fncallback({result:false,data:'No key'});
    }
}
exports.getCache=function(key,fncallback){
    if(key) {
        rClient.get(key, function (err, res) {
            if (!err&&res) {
                var newData = null;
                try {
                    newData = JSON.parse(res);
                } catch (ex) {
                    newData = res;
                }
                if (fncallback) {
                    fncallback({result: true, data: newData});
                }else{
                    return;
                }
            }else {
                if(fncallback){
                    fncallback({result:false,data:res});
                }else{
                    return;
                }
            }
        });
        //rClient.end();
    }else{
        fncallback({result:false,data:'No key'});
    }
}
exports.clearCache=function(key,fncallback){
    if(key){
        rClient.del(key);
    }
}
