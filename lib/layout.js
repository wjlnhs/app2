/**
 * Created by xin on 2014/10/17.
 */
var _=require('underscore');
var _mainLayoutRender=function(subPage,pageData,res,req){
    var userBaseInfo = req.i8session;
    var baseData={title:'i8工作流平台',layout: 'common/homeLayout','currentUserName':userBaseInfo.uname};
    var newData=_.extend(baseData,pageData);
    var ejs=require('ejs');
    ejs.filters.globalConfig=function(data){
        if(!data)
            return '{}';
        else
            return JSON.stringify(data);
    }
    res.render(subPage, newData);
}

var _commonLayoutRender=function(subPage,pageData,res,req){
    var userBaseInfo = req.i8session;
    var baseData={title:'i8社区平台',layout: 'layouts/commonTopBottom-layout','currentUserName':userBaseInfo.uname};
    var newData=_.extend(baseData,pageData);
    var ejs=require('ejs');
    ejs.filters.globalConfig=function(data){
        if(!data)
            return '{}';
        else
            return JSON.stringify(data);
    }
    res.render(subPage, newData);
}
exports.mainLayoutRender=_mainLayoutRender;
exports.commonLayoutRender=_commonLayoutRender;
