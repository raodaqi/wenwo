var AV = require('leanengine');
appJs = require('app.js');
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});

AV.Cloud.define('settleAccounts', function(request, response) {

  appJs.settleAccounts();

  console.log('结账');
});

module.exports = AV.Cloud;
