d.rebase (function () {
  var p = d.parser = '@matcher = $0'.ctor ({
      fn: '@bound("match")'.fn(),
    fail: '{failure: $0}'.fn(),
    pass: '{stream: $0, result: $1}'.fn(),
   match: '@matcher.apply(this, @_)'.fn()});

  d.rebase.alias_in (d.parser.prototype, {
    '%$%': 'fail',
      '%': 'match'});

  d.functional(p.prototype);
p.indexed_stream = (index, empty) >$> '@xs = $0, @position = $1 || 0'.ctor ({
  empty: '$0.call(@xs, @position)'.fn(empty.fn()),
   head: '$0.call(@xs, @position)'.fn(index.fn()),
   tail: 'new @constructor (@xs, @position + 1)'.fn()});

p.empty_stream = {empty: _ >$> true};

p.string_stream = p.indexed_stream ('@charAt($0)', '$0 >= @length');
p.array_stream  = p.indexed_stream ('$_[$0]',      '$0 >= @length');
p.list_stream   =
  '@h = $1, $t = $2.empty ? $2 : new $0.list_stream ($2, $0.empty_stream)'.fn (p).ctor ({
  empty: _ >$> false, head: '@h'.fn(), tail: '@t'.fn()});
var def_combinator = (name, operator, matcher) >$>
  (p[name] = matcher,
   p.prototype[name] = p.prototype[operator] =
     'new @constructor($0($_, $1))'.fn (matcher));
p.terminal = match >$> (stream >$>
  (! stream.empty() && stream.head() === match ?
    this.pass (stream.tail(), match) :
    this %$% 'Expected "#{match}" but found (#{stream.head()})'));
p.end = stream >$>
  (stream.empty() ? this.pass (stream, null) :
    this %$% 'Expected end of input, but found #{stream.head()}');
def_combinator ('sequence', '<<', (p1, p2) >$> (stream >$>
  ((p1 % stream, this) |$> ((m1, t) >$>
    (m1.failure ? t %$% m1.failure :
      (p2 % m1.stream |$> (m2 >$>
        (m2.failure ? t %$% m2.failure :
          this.pass (m2.stream, new p.list_stream (m1.result, m2.result))))))))));
def_combinator ('disjunction', '|', (p1, p2) >$> (stream >$>
  ((p1 % stream, this) |$> ((m1, t) >$>
    (m1.stream ? m1 :
      (p2 % stream |$> (m2 >$>
        (m2.stream ? m2 :
          this %$% m2.failure))))))));
def_combinator ('map', '*', (p, f) >$> (stream >$>
  ((p % stream, this) |$> ((m, t) >$>
    (m.failure ? t %$% m.failure :
      this.pass (m.stream, f.fn()(m.result)))))));
}) ();