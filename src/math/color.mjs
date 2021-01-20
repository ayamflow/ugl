export class Color extends Array {
    constructor(r, g, b) {
        super(r, g, b)
    }

    get r() {
        return this[0]
    }
    
    get g() {
        return this[1]
    }
    
    get b() {
        return this[2]
    }
}