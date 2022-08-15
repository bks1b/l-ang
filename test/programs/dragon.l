rules {
    X: X+Y
    Y: X-Y
}
operations {
    X, Y: line(10)
    +: rotate(-90)
    -: rotate(90)
}
axiom: X
iterations: 15