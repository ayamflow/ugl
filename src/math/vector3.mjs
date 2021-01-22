export class Vector3 extends Array {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z)
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

    set x(value) {
        this[0] = value
    }
    
    set y(value) {
        this[1] = value
    }
    
    set z(value) {
        this[2] = value
    }

    set(x, y, z) {
        if (y == undefined && z == undefined) {
            y = x
            z = x
        }

        this.x = x
        this.y = y
        this.z = z
    }
}