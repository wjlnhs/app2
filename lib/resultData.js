/*
* 前端WEB ajax与Nodejs相互公共数据格式块*
*/
var _=require('underscore');
var cnCode=require('../configs/info_cn');
module.exports = function(code, data) {
    var translateCode=function(c){
        return cnCode['c'+c]||'';
    }
    return _.extend({Code:1,Result:false,ReturnObject:null,Description:''},{
        Code:code,
        Result:code==0,
        ReturnObject:data,
        Description:translateCode(code)
    });
}

