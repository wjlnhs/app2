/**
 * Created by kusion on 2014/12/30.
 */
var MD5=require('blueimp-md5').md5;
//console.log(MD5("wuxin@hvming.com"))

var crypto = require('crypto');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'hvming';
var text = 'YwA1AGYAMgAyAGMAZgBjAC0AYwBmADcAMAAtADQAOQBlAGMALQA5ADkANQA1AC0AMQAwADYANQA2ADIAZAAwADMAOQAwADQAfAAyADAAMQA0ADEAMgAzADEAMQAxADAANgA1ADAAfAAyAGUAMQAzAGMAMAAxADEALQAxADcANQA2AC0ANAAwADUAMAAtADgAZABmADUALQBkADYAYwA5ADQANwBhADIANwAyADgAYwB8ADkAYQA1AGQAZQA2AGQAOQAxADEANwAwADEAMQAzADkANwAxADgANQAxAGUAYgAzAGQAMwA3ADQAOABhAGEAYQA=';

var cipher = crypto.createCipher(algorithm, key);
var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
console.log(encrypted);
var decipher = crypto.createDecipher(algorithm, key);
var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

console.log(decrypted);


//var cryptoMD = require('../../lib/crypto');
//cryptoMD.decrypt("wuxin@hvming.com","123")
//console.log(cryptoMD.decrypt("wuxin@hvming.com","123"));
//console.log(crypto.)