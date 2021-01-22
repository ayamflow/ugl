export class Matrix3 extends Array {
    constructor(x1, x2, x3, y1, y2, y3, z1, z2, z3) {
        super(x1, x2, x3, y1, y2, y3, z1, z2, z3)
        if (x1 == undefined) this.identity()

        // https://webgl2fundamentals.org/webgl/lessons/webgl-matrix-vs-math.html
        // [
        // x1, x2, x3,
        // y1, y2, y3,
        // z1, z2, y3,
        // ]
    }

    identity() {
        this.fill(0)
        this[0] = 1
        this[4] = 1
        this[8] = 1
        
        return this
    }

    translate(vec) {
        this[6] = this[0] * vec.x + this[3] * vec.y + this[6]
        this[7] = this[1] * vec.x + this[4] * vec.y + this[7]
        this[8] = this[2] * vec.x + this[5] * vec.y + this[8]
        
        return this
    }

    scale(vec) {
        this[0] *= vec.x
        this[1] *= vec.x
        this[2] *= vec.x
        this[3] *= vec.y
        this[4] *= vec.y
        this[5] *= vec.y
        
        return this
    }

    rotate(angle) {
        const out = []
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        out[0] = this[0] * cos + this[3] * sin
        out[1] = this[1] * cos + this[4] * sin
        out[2] = this[2] * cos + this[5] * sin
        out[3] = this[3] * cos - this[0] * sin
        out[4] = this[4] * cos - this[1] * sin
        out[5] = this[5] * cos - this[2] * sin
        this.copy(out)

        return this
    }

    multiply(matrix) {
        const out = []
        const a = matrix
        const b = this

        out[0] = b[0] * a[0] + b[1] * a[3] + b[2] * a[6]
        out[1] = b[0] * a[1] + b[1] * a[4] + b[2] * a[7]
        out[2] = b[0] * a[2] + b[1] * a[5] + b[2] * a[8]
        
        out[3] = b[3] * a[0] + b[4] * a[3] + b[5] * a[6]
        out[4] = b[3] * a[1] + b[4] * a[4] + b[5] * a[7]
        out[5] = b[3] * a[2] + b[4] * a[5] + b[5] * a[8]
        
        out[6] = b[6] * a[0] + b[7] * a[3] + b[8] * a[6]
        out[7] = b[6] * a[1] + b[7] * a[4] + b[8] * a[7]
        out[8] = b[6] * a[2] + b[7] * a[5] + b[8] * a[8]
        this.copy(out)
        
        return this
    }

    copy(matrix) {
        matrix.forEach((val, i) => {
            this[i] = val
        })
    }
}