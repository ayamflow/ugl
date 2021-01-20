export class Vector2 extends Array {
    constructor(x, y) {
        super(x, y)
    }

    get x() {
        return this[0]
    }
    
    get y() {
        return this[1]
    }
}