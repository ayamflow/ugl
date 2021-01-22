export class Vector4 extends Array {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(x, y, z, w)
    }

    get x() {
        return this[0]
    }
    
    get y() {
        return this[1]
    }
    
    get z() {
        return this[2]
    }
    
    get w() {
        return this[3]
    }
    
    set x(value) {
        this[0] = value
    }
    
    set y(value) {
        this[1] = value
    }
    
    set z(value) {
        this[2] = value
    }
    
    set w(value) {
        this[3] = value
    }

    set(x, y, z, w) {
        if (y == undefined && z == undefined && w == undefined) {
            y = x
            z = x
            w = x
        }

        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }
}