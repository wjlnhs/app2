var info_cn = require('../configs/info_cn');
var Check=function(data){
    if(!data.Result){
        data.Message=info_cn['c'+data.Code];
    }
    return data;
}
var removeNull=function(data){
    if(data){
        for(var i in data){
            if (data[i]==null){
                data[i]=''
            }
        }
    }
    return data;
}
exports.Check=Check;
exports.removeNull=removeNull;