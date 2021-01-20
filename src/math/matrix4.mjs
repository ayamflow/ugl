export class Matrix4 extends Array {
    constructor(x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4, w1, w2, w3, w4) {
        super(x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4, w1, w2, w3, w4)

        // https://webgl2fundamentals.org/webgl/lessons/webgl-matrix-vs-math.html
        // [
        // x1, x2, x3, x4,
        // y1, y2, y3, y4,
        // z1, z2, z3, z4,
        // w1, w2, w3, w4
        // ]
    }
}