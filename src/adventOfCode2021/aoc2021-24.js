/*
inp w		w1
mul x 0
add x z
mod x 26
div z 1
add x 10
eql x w
eql x 0		x=1
mul y 0
add y 25
mul y x
add y 1		y=26
mul z y		z=0
mul y 0
add y w
add y 1
mul y x
add z y		z = w1 + 1
inp w		w2
mul x 0
add x z
mod x 26
div z 1
add x 11
eql x w
eql x 0		x=1
mul y 0
add y 25
mul y x
add y 1		y=26
mul z y
mul y 0
add y w
add y 9		y=w2+9
mul y x
add z y		z = (w1 + 1)*26 + (w2 + 9)
inp w		w3
mul x 0
add x z
mod x 26	x = w2 + 9
div z 1
add x 14
eql x w
eql x 0		x = 1
mul y 0
add y 25
mul y x
add y 1		y = 26
mul z y
mul y 0
add y w
add y 12
mul y x
add z y		z = ((w1 + 1)*26 + (w2 + 9))*26 + (w3 + 12)
inp w		w4
mul x 0
add x z
mod x 26	x = w3 + 12
div z 1
add x 13
eql x w
eql x 0		x = 1
mul y 0
add y 25
mul y x
add y 1		y = 26
mul z y
mul y 0
add y w
add y 6
mul y x
add z y		z = (((w1 + 1)*26 + (w2 + 9))*26 + (w3 + 12))*26 + (w4 + 6)
inp w		w5
mul x 0
add x z
mod x 26	x = w4 + 6
div z 26	z = ((w1 + 1)*26 + (w2 + 9))*26 + (w3 + 12)
add x -6	x = w4
eql x w		x = w4 === w5
eql x 0		x = 0 (w4 === w5)
mul y 0
add y 25
mul y x
add y 1		y = 1
mul z y
mul y 0
add y w
add y 9
mul y x
add z y		z unchanged ((w1 + 1)*26 + (w2 + 9))*26 + (w3 + 12)
inp w		w6
mul x 0
add x z
mod x 26
div z 26	z = (w1 + 1)*26 + (w2 + 9)
add x -14	x = w3 - 2
eql x w		x = w3 === w6 + 2
eql x 0		x = 0 (w3 === w6 + 2)
mul y 0
add y 25
mul y x
add y 1		y = 1
mul z y
mul y 0
add y w
add y 15
mul y x
add z y		z unchanged (w1 + 1)*26 + (w2 + 9)
inp w		w7
mul x 0
add x z
mod x 26
div z 1
add x 14	x = w2 + 23
eql x w
eql x 0		x = 1
mul y 0
add y 25
mul y x
add y 1		y = 26
mul z y
mul y 0
add y w
add y 7
mul y x
add z y		z = ((w1 + 1)*26 + (w2 + 9))*26 + (w7 + 7)
inp w		w8
mul x 0
add x z
mod x 26
div z 1
add x 13	x = w7 + 20
eql x w
eql x 0		x = 1
mul y 0
add y 25
mul y x
add y 1		y = 26
mul z y
mul y 0
add y w
add y 12
mul y x
add z y		z = (((w1 + 1)*26 + (w2 + 9))*26 + (w7 + 7))*26 + (w8 + 12)
inp w		w9
mul x 0
add x z
mod x 26
div z 26	z = ((w1 + 1)*26 + (w2 + 9))*26 + (w7 + 7)
add x -8	x = w8 + 4
eql x w
eql x 0		x = 0 (w8 + 4 === w9)
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y 15
mul y x
add z y		z unchanged ((w1 + 1)*26 + (w2 + 9))*26 + (w7 + 7)
inp w		w10
mul x 0
add x z
mod x 26
div z 26	z = (w1 + 1)*26 + (w2 + 9)
add x -15	x = w7 - 8
eql x w
eql x 0		x = 0 (w7 === w10 + 8)
mul y 0
add y 25
mul y x
add y 1		y = 1
mul z y
mul y 0
add y w
add y 3
mul y x
add z y		z unchanged (w1 + 1)*26 + (w2 + 9)
inp w		w11
mul x 0
add x z
mod x 26
div z 1
add x 10	x = w2 + 19
eql x w
eql x 0		x = 1
mul y 0
add y 25
mul y x
add y 1		y = 26
mul z y
mul y 0
add y w
add y 6
mul y x
add z y		z = ((w1 + 1)*26 + (w2 + 9))*26 + (w11 + 6)
inp w		w12
mul x 0
add x z
mod x 26
div z 26	z = (w1 + 1)*26 + (w2 + 9)
add x -11	x = w11 - 5
eql x w
eql x 0		x = 0 (w11 === w12 + 5)
mul y 0
add y 25
mul y x
add y 1		y = 1
mul z y
mul y 0
add y w
add y 2
mul y x
add z y		z unchanged (w1 + 1)*26 + (w2 + 9)
inp w		w13
mul x 0
add x z
mod x 26
div z 26	z = (w1 + 1)
add x -13	x = w2 - 4
eql x w
eql x 0		x = 0 (w2 === w13 + 4)
mul y 0
add y 25
mul y x
add y 1		y = 1
mul z y
mul y 0
add y w
add y 10
mul y x
add z y		z unchanged (w1 + 1)
inp w
mul x 0
add x z
mod x 26
div z 26	z = 0
add x -4	x = w1 - 3
eql x w
eql x 0		x = 0 (w1 === w14 + 3)
mul y 0
add y 25
mul y x
add y 1		y = 0
mul z y
mul y 0
add y w
add y 12
mul y x
add z y		z unchanged 0

w1 = w14 + 3
w2 = w13 + 4
w3 = w6 + 2
w4 = w5
w7 = w10 + 8
w8 + 4 = w9
w11 = w12 + 5

MAX

w1 = 9
w2 = 9
w3 = 9
w4 = 9
w5 = 9
w6 = 7
w7 = 9
w8 = 5
w9 = 9
w10 = 1
w11 = 9
w12 = 4
w13 = 5
w14 = 6

99999795919456

MIN

w1 = 4
w2 = 5
w3 = 3
w4 = 1
w5 = 1
w6 = 1
w7 = 9
w8 = 1
w9 = 5
w10 = 1
w11 = 6
w12 = 1
w13 = 1
w14 = 1

45311191516111
*/