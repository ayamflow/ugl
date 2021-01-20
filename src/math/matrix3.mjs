export class Matrix3 extends Array {
    constructor(x1, x2, x3, y1, y2, y3, z1, z2, z3) {
        super(x1, x2, x3, y1, y2, y3, z1, z2, z3)

        // https://webgl2fundamentals.org/webgl/lessons/webgl-matrix-vs-math.html
        // [
        // x1, x2, x3,
        // y1, y2, y3,
        // z1, z2, y3,
        // ]
    }
}