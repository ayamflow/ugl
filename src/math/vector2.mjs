export class Vector2 extends Array {
    constructor(x = 0, y = 0) {
        super(x, y)
    }

    get x() {
        return this[0]
    }
    
    get y() {
        return this[1]
    }
    
    set x(value) {
        this[0] = value
    }
    
    set y(value) {
        this[1] = value
    }

    set(x, y, z) {
        if (y == undefined) {
            y = x
        }

        this.x = x
        this.y = y
    }
}