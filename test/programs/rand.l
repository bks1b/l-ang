config: angle: 10
rules: F: random(F[+F]F[-F]F, F[+F]F, F[-F]F)
operations {
    F: line(10)
    +: rotate_counter(angle)
    -: rotate(angle)
    [: push()
    ]: pop()
}
init: rotate_counter(90)
axiom: F
iterations: 5