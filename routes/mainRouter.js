/**
 * Created by kusion on 2014/12/5.
 */
/**
 * Created by xin on 2014/10/13.
 */
var routes = require('./index');
var users=require('./users/main');
var testRoute=require('./routerTest/index.js');
var ucenter=require('./ucenter/main.js');
var settings=require('./users/settings/ajax_main.js');
//var modules = require('./modules/ajax_main.js');
var userWebajax=require('./users/ajax/uajax-data');
var cement = require('./cement/main.js');
var group = require('./group/main.js');
var pluginSelector=require('./platform/ajax/plugin-selector');
var kankanBlog=require('./platform/ajax/kankanreq');
function mainRouterSetting(app){
    app.use('/', routes);
    app.use('/users',users);
    app.use('/test',testRoute);
    app.use('/ucenter',ucenter);
    app.use('/settings',settings);
    //app.use('/modules',modules);
    app.use('/webajax/usrdata',userWebajax);
    app.use('/cement',cement);
    app.use('/group',group);
    app.use('/webajax/plugins/selector',pluginSelector);
    app.use('/webajax/kkcom',kankanBlog);
}

exports.use=mainRouterSetting;