/**
 * Created by kusion on 2014/12/5.
 */
/**
 * Created by xin on 2014/10/15.
 */
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename:'logs/access/access.log',
            maxLogSize: 1024,
            backups:3,
            //pattern:'"-yyyy-MM-dd.log',
            category: 'normal'
        }
    ],
    replaceConsole: true,
    levels:{ dateFileLog: 'INFO'}
});
var dateFileLog = log4js.getLogger('normal');
exports.logger = dateFileLog;
exports.use = function(app) {
    app.use(log4js.connectLogger(dateFileLog, {level:log4js.levels.INFO, format:':method :url'}));
}

