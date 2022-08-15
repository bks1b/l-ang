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