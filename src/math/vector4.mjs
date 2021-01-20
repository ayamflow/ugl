export class Vector4 extends Array {
    constructor(x, y, z, w) {
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
}