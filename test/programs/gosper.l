rules {
    L: L+R++R-L--LL-R+
    R: -L+RR++R+L--L-R
}
operations {
    L, R: line(10)
    +: rotate(-60)
    -: rotate(60)
}
axiom: R
iterations: 5