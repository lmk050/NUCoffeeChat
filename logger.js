var exports = module.exports = {};
var log4js = require('log4js'); 
//console log is loaded by default, so you won't normally need to do this
//log4js.loadAppender('console');
log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());
log4js.addAppender(log4js.appenders.file('./logs/coffeeChat.log'), 'coffeeChat');

var logger = log4js.getLogger('coffeeChat');
logger.setLevel('DEBUG');

exports.getLogger = function()
{
    return logger;
}