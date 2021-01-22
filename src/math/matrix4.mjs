export class Matrix4 extends Array {
    constructor(x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4, w1, w2, w3, w4) {
        super(x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4, w1, w2, w3, w4)
        if (x1 == undefined) this.identity()

        // https://webgl2fundamentals.org/webgl/lessons/webgl-matrix-vs-math.html
        // [
        // x1, x2, x3, x4,
        // y1, y2, y3, y4,
        // z1, z2, z3, z4,
        // w1, w2, w3, w4
        // ]
    }

    identity() {
        this.fill(0)
        this[0] = 1
        this[5] = 1
        this[10] = 1
        this[15] = 1

        return this
    }

    translate(vec) {
        const {x, y, z} = vec
        this[12] = this[0] * x + this[4] * y + this[8] * z + this[12]
        this[13] = this[1] * x + this[5] * y + this[9] * z + this[13]
        this[14] = this[2] * x + this[6] * y + this[10] * z + this[14]
        this[15] = this[3] * x + this[7] * y + this[11] * z + this[15]
        
        return this
    }

    scale(vec) {
        this[0] *= vec.x
        this[1] *= vec.x
        this[2] *= vec.x
        this[3] *= vec.x
        this[4] *= vec.y
        this[5] *= vec.y
        this[6] *= vec.y
        this[7] *= vec.y
        this[8] *= vec.z
        this[9] *= vec.z
        this[10] *= vec.z
        this[11] *= vec.z
        
        return this
    }

    rotate(vec) {
        // TODO
        
        return this
    }

    multiply(matrix) {
        const out = []
        const a = matrix
        const b = this

        out[0] = b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12]
        out[1] = b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13]
        out[2] = b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14]
        out[3] = b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15]
        
        out[4] = b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12]
        out[5] = b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13]
        out[6] = b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14]
        out[7] = b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15]
        
        out[8] = b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12]
        out[9] = b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13]
        out[10] = b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14]
        out[11] = b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15]
        
        out[12] = b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12]
        out[13] = b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13]
        out[14] = b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14]
        out[15] = b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15]

        this.copy(out)
        return this
    }

    copy(matrix) {
        matrix.forEach((val, i) => {
            this[i] = val
        })
    }
}