var a = [1]

// var i = 0;
var j = 0;
// a[0]++;

for (var i = 0; i < 2; i++) {
  // debung: inside my debug loop
  j = j + 1;
  j = i + 2;

  while(j--) {
    // TODO: add function wrapper
    callme(i)
  }

}

// while(j--) { console.log('here') }



function callme(a) {
  return a-1;
}

debung.debug(function() {
  var depth = 0;

  debung.flow(function(o) {
console.log(o)
    var padding = ''
    for (var i=0; i<o[1]; i++) {
      padding += '  |';
    }

    padding += '  |-'

    var r = o.slice(2);

    console.log(padding, r.length === 1 ? r[0] : JSON.stringify(r))
  })
})
