config: angle: 45
rules {
    X: XX
    Y: X[Y]Y
}
operations {
    X, Y: line(10)
    [ {
        push()
        rotate_counter(angle)
    }
    ] {
        pop()
        rotate(angle)
    }
}
init: rotate(-90)
axiom: Y
iterations: 7