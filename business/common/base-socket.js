/**
 * Created by xin on 2014/10/14.
 */
var net = require('net');
var util=require('util');
var _=require('underscore');
var EventEmitter=require('events').EventEmitter;
var format=require('../../lib/resultData');
var socketConnect=function(setting){
    this.port=setting.port||0;
    this.host=setting.host||'127.0.0.1';
    this.command=setting.command||'';
}
util.inherits(socketConnect,EventEmitter);
socketConnect.prototype.connecting=function(){
    var _this=this;
    var client = new net.Socket();
    client.connect(this.port, this.host, function() {
        var buf = new  Buffer(_this.command ,encoding='utf8');
        var bufToW= new  Buffer(buf.length+8);
        bufToW.write('I801');
        bufToW.writeUInt32BE(buf.length,4);
        buf.copy(bufToW,8,0,buf.length);
        client.write(bufToW);
    });
    var alllen = 0,allrBuf,allPos=0;
    client.on('data', function(data) {
        var isBuffer = Buffer.isBuffer(data);
        if(isBuffer){
            if(alllen==0){
                alllen = data.readInt32BE(0) ;
                allrBuf =new Buffer(alllen);
                data.copy(allrBuf,allPos,4,data.length);
                allPos = data.length-4;
                if(allPos==alllen){
                    var totalString=allrBuf.toString();
                    var newDataObj=null;
                    try{
                        newDataObj=JSON.parse(totalString);
                    }catch (ex){
                        _this.emit("receiveData",format(8887,'convert service data error!'+ex+'[socket request details: host('+_this.host+'),port('+_this.port+'),command('+_this.command+')]'));
                    }
                    if(_.isObject(newDataObj)){
                        _this.emit("receiveData",newDataObj);
                    }
                }
            }
            else
            {
                data.copy(allrBuf,allPos,0,data.length);
                allPos = allPos+ data.length;
                if(allPos==alllen){
                    var totalString=allrBuf.toString();
                    var newDataObj=null;
                    try{
                        newDataObj=JSON.parse(totalString);
                    }catch (ex){
                        _this.emit("receiveData",format(8887,'convert service data error!'+ex+'[socket request details: host('+_this.host+'),port('+_this.port+'),command('+_this.command+')]'));
                    }
                    if(_.isObject(newDataObj)){
                        _this.emit("receiveData",newDataObj);
                    }
                }
            }
        }
        else {
            console.log('DATA: ' + data);
        };
        //client.destroy();
    });
    client.setTimeout(30000,function(){
        _this.emit("receiveData",format(8889,'there is no response of remote service!'+'[socket request details: host('+_this.host+'),port('+_this.port+'),command('+_this.command+')]'));
        _this.emit("timeout",format(8889,'there is no response of remote service!'+'[socket request details: host('+_this.host+'),port('+_this.port+'),command('+_this.command+')]'));
    });
    client.on('end',function(){
        _this.emit("receiveEnd");
    });
    client.on("error",function(err){
        _this.emit("receiveData",format(8888,err.message+'[socket request details: host('+_this.host+'),port('+_this.port+'),command('+_this.command+')]'));
        _this.emit("error",format(8888,err.message+'[socket request details: host('+_this.host+'),port('+_this.port+'),command('+_this.command+')]'));
        new Error('socket request data error:'+err.message+'[socket request details: host('+_this.host+'),port('+_this.port+'),command('+_this.command+')]');
    });
// 为客户端添加“close”事件处理函数
    client.on('close', function() {
        _this.emit("connectionClosed");
    });
};
exports.getRemoteData=socketConnect;


