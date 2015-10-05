var a = [1]

// var i = 0;
var j = 0;
// a[0]++;

for (var i = 0; i < 10; i++) {
  // debung: inside my debug loop
  j = j + 1;
  j = i + 2;
  callme(i)
}

// while(j--) { console.log('here') }



function callme(a) {
  var j = gimme([a, a+1, a+2])
  return j;
}

function gimme(a) {
  return a;
}

debung.debug(function() {
  var depth = 0;

  debung.flow(function(o) {
    var padding = ''
    for (var i=0; i<o[1]; i++) {
      padding += '  |';
    }

    padding += '  |-'

    var r = o.slice(2);

    console.log(padding, r.length === 1 ? r[0] : JSON.stringify(r))
  })
})
