d.rebase (function () {
  var p = d.parser = function () {return d.parser.parse.apply (this, arguments)};
p.indexed_stream = (index, empty) >$> '@xs = $0, @position = $1 || 0'.ctor ({
  empty: '$0.call(@xs, @position)'.fn(empty.fn()),
   head: '$0.call(@xs, @position)'.fn(index.fn()),
   tail: 'new @constructor (@xs, @position + 1)'.fn()});

p.string_stream = p.indexed_stream ('@charAt($0)', '$0 >= @length');
p.array_stream  = p.indexed_stream ('$_[$0]',      '$0 >= @length');