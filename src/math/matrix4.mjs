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
        //]
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

    // rotate(angle, axis) {
    //     // bro honestly this one I just copypasta
    //     // https://github.com/toji/gl-matrix/blob/master/src/mat4.js#L612

    //     const out = []

    //     const cos = Math.cos(angle)
    //     const sin = Math.sin(angle)
    //     const tan = 1 - cos
    //     let x = axis[0]
    //     let y = axis[1]
    //     let z = axis[2]
    //     const len = 1 / Math.hypot(x, y, z)

    //     x *= len
    //     y *= len
    //     z *= len

    //     let m0 = x * x * tan + cos
    //     let m1 = y * x * tan + z * sin
    //     let m2 = z * x * tan - y * sin
    //     let m4 = x * y * tan - z * sin
    //     let m5 = y * y * tan + cos
    //     let m6 = z * y * tan + x * sin
    //     let m8 = x * z * tan + y * sin
    //     let m9 = y * z * tan - x * sin
    //     let m10 = z * z * tan + cos
    //     console.log({x, tan, cos})

    //     out[0] = this[0] * m0 + this[4] * m1 + this[8] * m2
    //     out[1] = this[1] * m0 + this[5] * m1 + this[9] * m2
    //     out[2] = this[2] * m0 + this[6] * m1 + this[10] * m2
    //     out[3] = this[3] * m0 + this[7] * m1 + this[11] * m2
    //     out[4] = this[0] * m4 + this[4] * m5 + this[8] * m6
    //     out[5] = this[1] * m4 + this[5] * m5 + this[9] * m6
    //     out[6] = this[2] * m4 + this[6] * m5 + this[10] * m6
    //     out[7] = this[3] * m4 + this[7] * m5 + this[11] * m6
    //     out[8] = this[0] * m8 + this[4] * m9 + this[8] * m10
    //     out[9] = this[1] * m8 + this[5] * m9 + this[9] * m10
    //     out[10] = this[2] * m8 + this[6] * m9 + this[10] * m10
    //     out[11] = this[3] * m8 + this[7] * m9 + this[11] * m10
    //     this.copy(out)
    //         // console.log(out)
    //     return this
    // }
    rotate(euler) {
        // https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js#L144
        const out = []
        const { x, y, z } = euler
        const cosX = Math.cos(x)
        const sinX = Math.sin(x)
        const cosY = Math.cos(y)
        const sinY = Math.sin(y)
        const cosZ = Math.cos(z)
        const sinZ = Math.sin(z)

        const xz = cosX * cosZ
        const xsz = cosX * sinZ
        const sxz = sinX * cosZ
        const sxsz = sinX * sinZ

        out[0] = cosY * cosZ
        out[1] = xsz + sxz * sinY
        out[2] = sxsz - xz * sinY
        out[3] = 0
        out[4] = - cosY * sinZ
        out[5] = xz - sxsz * sinY
        out[6] = sxz + xsz * sinY
        out[7] = 0
        out[8] = sinY
        out[9] = - sinX * cosY
        out[10] = cosX * cosY
        out[11] = 0
        out[12] = 0
        out[13] = 0
        out[14] = 0
        out[15] = 1
        this.multiply(out)

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

    inverse() {
        const out = []
        let m0 = this[0] * this[5] - this[1] * this[4]
        let m1 = this[0] * this[6] - this[2] * this[4]
        let m2 = this[0] * this[7] - this[3] * this[4]
        let m3 = this[1] * this[6] - this[2] * this[5]
        let m4 = this[1] * this[7] - this[3] * this[5]
        let m5 = this[2] * this[7] - this[3] * this[6]
        let m6 = this[8] * this[13] - this[9] * this[12]
        let m7 = this[8] * this[14] - this[10] * this[12]
        let m8 = this[8] * this[15] - this[11] * this[12]
        let m9 = this[9] * this[14] - this[10] * this[13]
        let m10 = this[9] * this[15] - this[11] * this[13]
        let m11 = this[10] * this[15] - this[11] * this[14]

        let det = m0 * m11 - m1 * m10 + m2 * m9 + m3 * m8 - m4 * m7 + m5 * m6
        if (!det) {
            return null
        }
        det = 1.0 / det

        out[0] = (this[5] * m11 - this[6] * m10 + this[7] * m9) * det
        out[1] = (this[2] * m10 - this[1] * m11 - this[3] * m9) * det
        out[2] = (this[13] * m5 - this[14] * m4 + this[15] * m3) * det
        out[3] = (this[10] * m4 - this[9] * m5 - this[11] * m3) * det
        out[4] = (this[6] * m8 - this[4] * m11 - this[7] * m7) * det
        out[5] = (this[0] * m11 - this[2] * m8 + this[3] * m7) * det
        out[6] = (this[14] * m2 - this[12] * m5 - this[15] * m1) * det
        out[7] = (this[8] * m5 - this[10] * m2 + this[11] * m1) * det
        out[8] = (this[4] * m10 - this[5] * m8 + this[7] * m6) * det
        out[9] = (this[1] * m8 - this[0] * m10 - this[3] * m6) * det
        out[10] = (this[12] * m4 - this[13] * m2 + this[15] * m0) * det
        out[11] = (this[9] * m2 - this[8] * m4 - this[11] * m0) * det
        out[12] = (this[5] * m7 - this[4] * m9 - this[6] * m6) * det
        out[13] = (this[0] * m9 - this[1] * m7 + this[2] * m6) * det
        out[14] = (this[13] * m1 - this[12] * m3 - this[14] * m0) * det
        out[15] = (this[8] * m3 - this[9] * m1 + this[10] * m0) * det
        this.copy(out)

        return this
    }

    copy(matrix) {
        matrix.forEach((val, i) => {
            this[i] = val
        })

        return this
    }
}