rules {
    F: F-G+F+G-F
    G: GG
}
operations {
    F, G: line(10)
    +: rotate_counter(120)
    -: rotate(120)
}
init: rotate(180)
axiom: F-G-G
iterations: 7