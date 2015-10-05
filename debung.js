
var varargs = require('varargs')
var debunger = module.exports = {};
var flow = [];
var depth = 0;

function now() {
  return window.performance.now() * 1000;
}

debunger.array = function (name, a) {
  flow.push([now(), depth, name, a.slice()])
  return a;
}

debunger.op = function (text, result) {
  flow.push([now(), depth, text, result])
  return result;
}

debunger.label = function (text) {
  flow.push([now(), depth, text])
}

debunger.value = function (text, result) {
  flow.push([now(), depth, text, result])
  return result;
}

debunger.wrap = function(name, ctx, args, fn) {
  flow.push([now(), depth, 'wrap', name, varargs(args)])
  depth++;
  var res = fn.call(ctx);
  depth--;
  flow.push([now(), depth, 'unwrap', name, res])
  return res;
}

debunger.enterLoop = function() {
  flow.push([now(), depth, 'enter loop'])
  depth++
}

debunger.exitLoop = function() {
  depth--;
  flow.push([now(), depth, 'exit loop'])
}

// provide a safe haven from debunger mutations
debunger.debug = function(fn) {
  return fn()
}

debunger.flow = function getFlow(fn) {
  return flow.map(fn)
}
