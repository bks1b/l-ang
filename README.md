# L-ang
L-ang is a language for rendering [Lindenmayer systems](https://en.wikipedia.org/wiki/L-system) (aka L-systems, hence the project's name).

# Examples
There are several examples, along with their respective results in the [test directory](https://github.com/bks1b/l-ang/tree/main/test).
An example implementation of a [Sierpiński arrowhead curve](https://en.wikipedia.org/wiki/Sierpi%C5%84ski_curve#Arrowhead_curve):
```
rules {
    X: Y+X+Y
    Y: X-Y-X
}
operations {
    X, Y: line(10)
    +: rotate_counter(60)
    -: rotate(60)
}
axiom: X
iterations: 7
```
<img src="https://raw.githubusercontent.com/bks1b/l-ang/main/test/res/sierpinski_ah.png">

# Syntax
The main "level" of a program is a set of key-value pairs:
- `config`: Key-value pairs which can later be accessed by their identifiers. Useful for defining constants which are used multiple times in code.
- `init`: A list of statements to be executed before rendering. Useful for transformations such as initial rotations.
- `rules`: The set of rewriting rules, as key-value pairs.
- `operations`*: The list of operations (statements) corresponding to each rule. Not every rule needs an operation assigned to it.
- `axiom`*: The initial string of rules.
- `iterations`: The amount of rewriting iterations.

Keys followed by a `*` are required. If rules are specified, then iterations have to be specified too.

## Key-value pairs
Key-value pairs can be single-line or multi-line, however, in some cases, only a single value is accepted:
```
key: value
// or
key: {
    value
}
// or
key: {
    value1
    value2
    ...
    value[n]
}
```
Here, `value` may refer to a statement, an expression, a rule, or a key-value pair, depending on the context.

## Expressions
Expressions can be function calls (`functionName(arg1, arg2, ..., arg[n])`), numbers, identifiers or colors (either a 3 or 6 letter hex string starting with a `#`, or any of the [16 HTML color keywords](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color_keywords)).

## Rules
Allowed characters for rules are English uppercase characters and `+-[]{}`.
Each character corresponds to a single operation, except when a character is followed by a `(`, in which case, it is parsed as a parametric rule, where `()` enclose the arguments.
Rules can be concatenated with functions calls (as long as they return rules): `A+repeat(B, 3)`.

## Comments
`//` ignores the rest of the line it's on, and `/*` ignores the code until the next occurrence of `*/`.

# Functions
For simplicity, angles are expected to be given in degrees.
- `rgb(r, g, b)`: Represents an RGB color. Useful for alternative notation for colors, as well as generating colors systematically.
- `stroke_color(c)`: Sets the line color.
- `fill_color(c)`: Sets the fill color.
- `line_width(n)`: Sets the line width.
- `opacity(n)`: Sets the opacity.
- `repeat(R, n)`: Repeats a rule n times. For example, `repeat(A+B, 3)` -> `A+BA+BA+B`.
- `add`, `subtract`, `multiply`, `divide` are operations on 2 numbers.
- `pow(b, n)`: `b` raised to the `n`-th power (`b^n`).
- `root(b, n)`: The `n`-th root of `b` (`b^(1/n)`).
- `log(n, b)`: The base-`b` logarithm of `n`.
- `mod(a, n)`: The remainder of `a` when divided by `n`.
- `floor`, `ceil`, `round`, `abs`, `sin`, `cos`, `tan` are operations on 1 number.
- `min`, `max` are operations on multiple numbers.
- `set_rotation(a)`: Sets the cursor's rotation.
- `rotate(a)`, `rotate_counter(a)`: Rotates the cursor clockwise/counterclockwise.
- `move(n)`: Moves the cursor along its rotation.
- `move_to(x, y)`: Sets the cursor's position.
- `line(n)`: Draws a line along the cursor's rotation, and moves the cursor to the line's endpoint.
- `line_to(x, y)`: Draws a line to the specified position, and moves the cursor there.
- `fill_circle(r)`: Fills a circle with radius `r`.
- `stroke_circle(r)`: Draws the outline of a circle with radius `r`.
- `background(c)`: Sets the background color.
- `random_num(a, b)`: Generates a random number from `a` to `b` (inclusive).
- `random(...arr)`: Picks a random element from the given list of arguments.
- `neg(n)`: Negates a number.
- `push`/`pop`[`_x`, `_y`, `_rotation`]: Saves (`push`) or restores (`pop`) the cursor's x/y position, or its rotation. If a type isn't specified (`push`/`pop`), the function saves/restores all 3 values.