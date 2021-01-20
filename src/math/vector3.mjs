export class Vector3 extends Array {
    constructor(x, y, z) {
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
}