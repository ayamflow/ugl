export class Geometry {
    #gl

    constructor(attributes = {}, mode) {
        this.needsUpdate = true
        this.attributes = {}
        this.mode = mode

        if (attributes) Object.keys(attributes).forEach(key => {
            this.attributes[key] = attributes[key]
        })
    }

    compile(gl) {
        if (this.#gl && !this.needsUpdate) return this.#gl

        const attributes = {}
        Object.keys(this.attributes).forEach(key => {
            let attribute = this.attributes[key]

            attribute.count = attribute.value.length / attribute.size

            let buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, attribute.value, gl.STATIC_DRAW)

            if (location < 0) throw new Error(`[µgl] The attribute ${key} is not used in the shader`)

            attribute.needsUpdate = false

            attributes[key] = {
                buffer,
                size: attribute.size,
                count: attribute.count,
                type: attribute.type || gl.FLOAT
            }
        })

        this.needsUpdate = false
        this.#gl = {
            attributes
        }

        return this.#gl
    }

    render(gl, program) {
        if (!this.#gl || this.needsUpdate) this.compile(gl)


        Object.keys(this.#gl.attributes).forEach(key => {
            let attribute = this.#gl.attributes[key]
            const location = program.attributes[key].location

            // TODO: check attribute.needsUpdate
            gl.enableVertexAttribArray(location)
            gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer)
            gl.vertexAttribPointer(location, attribute.size, attribute.type, false, 0, 0) // normalize // stride // offset
        })

        gl.drawArrays(this.mode || gl.TRIANGLES, 0, this.attributes.position.count)
    }
}