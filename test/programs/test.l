rules {
    F(x): X(x)F(add(x, 1))X(x)F(add(x, 2))repeat(X(subtract(x,1)),2)
}
operations {
    X(x) {
        stroke_color(rgb(random_num(0, 200), random_num(50, 255), random_num(50, 255)))
        line_width(random_num(0.5, 3))
        line(pow(x, random_num(1, 2)))
        rotate(pow(x, 1.1))
    }
}
init: background(#cfd)
axiom: F(1)
iterations: 11