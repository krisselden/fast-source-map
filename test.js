QUnit = require('qunitjs');
var num = 1;
QUnit.begin(function (details) {
  console.log('1..'+details.totalTests);
});
QUnit.testDone(function (details) {
  console.log((details.failed ? 'not ok ' : 'ok ') + (num++) + ' - ' + details.module + ' - ' + details.name);
});

global.VLQ = require('.');
require('./test/index.js');

QUnit.load();
