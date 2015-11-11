/**
 * Created by kusion on 2014/12/30.
 */
var crypto = require('crypto');

exports.encrypt = function (data, secretKey) {
    var cipher = crypto.createCipher('aes-128-ecb',secretKey);
    return cipher.update(data,'utf8','hex') + cipher.final('hex');
};

exports.decrypt = function (data, secretKey) {
    var cipher = crypto.createDecipher('aes-128-ecb',secretKey);
    return cipher.update(data,'hex','utf8') + cipher.final('utf8');
};
