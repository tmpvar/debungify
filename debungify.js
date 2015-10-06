var parser = require('falafel');
var through = require('through');
var fs = require('fs');
var path = require('path');
var debung = path.join(__dirname, '/', 'debung.js');
var handle = {}

module.exports = transform

function childOfDebung(node) {
  var c = node;
  while (c) {
    var callee = c.callee;
    // console.log(callee)
    if (callee && callee.object && callee.object.name === 'debung') {
      return true;
    }

    c = c.parent;
  }
  return false;
}

function transform(file) {
  if (file.indexOf('debung.js') > -1) {
    return through();
  }

  var data = '';
  return through(write, end);

  function write (buf) { data += buf.toString();}
  function end () {
    data = data.replace(/\/\/ *debung: *(.*)/g, 'debung.label("$1")')

    try {
      var out = parser(data, function(node) {
        if (!node.scopeDepth) {
          node.scopeDepth = 0;
        }

        if (handle[node.type]) {
          node.debunged = true;
          if (!childOfDebung(node)) {
            handle[node.type](node, node.parent, node.source());
          }
        } else {
          console.log('missed', node.type)
        }
      }).toString();

      if (out.indexOf('var debung') === -1) {
        this.queue("var debung = require('" + debung + "');\n");
      }

      this.queue(out);
    } catch (e) {
      this.emit('error', e);
    }
    this.queue(null);
  }
}

handle.BinaryExpression = function(n, p, source) {
  var left = n.left.value || n.left.name;
  var right = n.right.value || n.right.name;
  if (!n.left.value) {
    // console.log('BINARY', n);
  }

  var op = [left, n.operator, right].join(' ');
  n.update('debung.op("' + op + '", ' + source + ')')
};

handle.ArrayExpression = function(n, p, source) {
  var name = ''
  if (p.id && p.id.type === 'Identifier') {
    name = p.id.name;
  }

  n.update('debung.array("' + name + '",' + source + ')');
}

handle.VariableDeclaration = function(n, p, source) {
  n.declarations.forEach(function(dec) {
    var name = dec.id.name;
    if (!dec.init) {
      // handle `var a;`
      return;
    }
    var value = dec.init.raw;


    var str = [name, '=', value].join(' ')
    dec.init.update('debung.value("' + str + '",' + dec.init.source() + ')');
  })
}

handle.CallExpression = function(n, p, source) {
  // console.log('call', source, 'child?', childOfDebung(n))
}

handle.Literal = function(n, p, source) {
  // console.log('literal', source)
}

handle.MemberExpression = function(n, p, source) {
  // console.log('member', source)
}

handle.ExpressionStatement = function(n, p, source) {
  // console.log('ExpressionStatement', source)
}

handle.Identifier = function(n, p, source) {
  // console.log('Identifier', source)
}

handle.AssignmentExpression = function(n, p, source) {
  // console.log('assign', source)
}

handle.UpdateExpression = function(n, p, source) {
  n.update('debung.op("' + source + '", ' + source + ')')
}

// handle.ForStatement = handle.WhileStatement = function(n, p, source) {
//   n.update('debung.enterLoop()\n' + source);
// }

handle.BlockStatement = function(n, p, source) {
  var type = 'cycle'
  // TODO: handle function bodies
  if (p.type === 'ForStatement' || p.type === 'WhileStatement') {

    var newSource = [
      '{',
      '  debung.enterLoop()',
      '    ' + source.replace(/^\{|\}$/g, '').trim(),
      '  debung.exitLoop()',
      '}',
    ].join('\n')

    n.update(newSource);


  } else if (p.type === 'FunctionDeclaration' || p.type === 'FunctionExpression') {
    var newSource = [
      '{',
      '  return debung.wrap("' + p.id.name + '", this, arguments, function() {',
      '    ' + source.replace(/^\{|\}$/g, '').trim(),
      '  })',
      '}',
    ].join('\n')

    n.update(newSource);
  } else {
    console.log('OTHER', p.type, source)
  }
}
