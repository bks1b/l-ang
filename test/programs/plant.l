config: angle: 25
rules {
    X: F+[[X]-X]-F[-FX]+X
    F: FF
}
operations {
    F: line(10)
    [: push()
    ]: pop()
    -: rotate(angle)
    +: rotate_counter(angle)
}
init: rotate_counter(add(angle, 45))
axiom: X
iterations: 5