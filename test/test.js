var browserify = require('browserify')
var beautify = require('js-beautify').js_beautify
var debungify = require('../debungify')

var b = browserify();

b.add(__dirname + '/array.js');

b.transform(debungify)
b.bundle(function done(e, r) {
  if (e) throw e;
  r = r.toString();
  // console.log(beautify(r))
  eval(r);
})

