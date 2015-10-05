
var varargs = require('varargs');
var deepClone = require('clone');

var debunger = module.exports = {};

var flow = [];
var depth = 0;

function now() {
  return typeof window !== 'undefined' ? window.performance.now() * 1000 : Date.now();
}

function clone(thing) {
  try {
    return deepClone(thing);
  } catch (e) {
    return thing;
  }
}

debunger.array = function (name, a) {
  flow.push([now(), depth, name, clone(a)])
  return a;
}

debunger.op = function (text, result) {
  flow.push([now(), depth, text, clone(result)])
  return result;
}

debunger.label = function (text) {
  flow.push([now(), depth, text])
}

debunger.value = function (text, result) {
  flow.push([now(), depth, text, clone(result)])
  return result;
}

debunger.wrap = function(name, ctx, args, fn) {
  flow.push([now(), depth, 'wrap', name, clone(varargs(args))])
  depth++;
  var res = fn.call(ctx);
  depth--;
  flow.push([now(), depth, 'unwrap', name, clone(res)])
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
