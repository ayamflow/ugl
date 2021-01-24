export class Texture {
    #gl

    constructor(options = {}) {
        this.image = options.image
        this.format = options.format
        this.type = options.type
        this.flipY = options.flipY || true
        this.wrapS = options.wrapS
        this.wrapT = options.wrapT
        this.minFilter = options.minFilter
        this.magFilter = options.magFilter
        this.needsUpdate = true
    }

    compile(gl) {
        if (this.#gl && !this.needsUpdate) return this.#gl

        this.format = this.format || gl.RGB
        this.type = this.type || gl.UNSIGNED_BYTE
        this.wrapS = this.wrapS || gl.CLAMP_TO_EDGE
        this.wrapT = this.wrapT || gl.CLAMP_TO_EDGE
        this.minFilter = this.minFilter || gl.LINEAR
        this.magFilter = this.magFilter || gl.LINEAR

        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)

        if (this.flipY === true) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        }

        if (this.image && (this.image.complete && this.image.width && this.image.height || this.image instanceof Image === false)) {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, this.image)
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, this.format, 1, 1, 0, this.format, this.type, new Uint8Array([0, 0, 0, 255]))
        }

        // if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        //     gl.generateMipmap(gl.TEXTURE_2D)
        // }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter)

        this.#gl = {
            texture
        }

        return this.#gl
    }

    render(gl, options = {}) {
        if (!this.#gl || this.needsUpdate) this.compile(gl)

        gl.activeTexture(gl.TEXTURE0 + options.textureId)
        gl.bindTexture(gl.TEXTURE_2D, this.#gl.texture)
        options.textureId++
    }
}

// function isPowerOf2(value) {
//     return (value & (value - 1)) == 0
// }