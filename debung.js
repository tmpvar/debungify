
var varargs = require('varargs')
var debunger = module.exports = {};
var flow = [];
var depth = 0;


debunger.array = function (name, a) {
  flow.push([Date.now(), depth, name, a.slice()])
  return a;
}

debunger.op = function (text, result) {
  flow.push([Date.now(), depth, text, result])
  return result;
}

debunger.label = function (text) {
  flow.push([Date.now(), depth, text])
}

debunger.value = function (text, result) {
  flow.push([Date.now(), depth, text, result])
  return result;
}

debunger.wrap = function(name, ctx, args, fn) {
  flow.push([Date.now(), depth, 'wrap', name, varargs(args)])
  depth++;
  var res = fn.call(ctx);
  depth--;
  flow.push([Date.now(), depth, 'unwrap', name, res])
  return res;
}

debunger.enterLoop = function() {
  flow.push([Date.now(), depth, 'enter loop'])
  depth++
}

debunger.exitLoop = function() {
  depth--;
  flow.push([Date.now(), depth, 'exit loop'])
}

// provide a safe haven from debunger mutations
debunger.debug = function(fn) {
  return fn()
}

debunger.flow = function getFlow(fn) {
  return flow.map(fn)
}
