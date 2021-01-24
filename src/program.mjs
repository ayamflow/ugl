import { Vector2, Vector3, Vector4, Matrix3, Matrix4, Color } from './math/index.mjs'
import { Texture } from './texture.mjs'

var UID = 0

export class Program {
    #gl
    #id

    constructor(options = {}) {
        this.#id = UID++

        this.needsUpdate = true
        this.vertex = options.vertex
        this.fragment = options.fragment
        
        this.uniforms = {
            viewMatrix: { value: null },
            modelMatrix: { value: null },
            projectionMatrix: { value: null }
        }
        Object.keys(options).forEach(key => {
            const uniform = options[key]
            if (uniform.value != undefined) {
                this.uniforms[key] = options[key]
            }
        })
    }

    get id() {
        return this.#id
    }

    compile(gl) {
        if (this.#gl && !this.needsUpdate) return this.#gl

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, this.vertex)
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER,this.fragment)
        const program = createProgram(gl, vertexShader, fragmentShader)

        const uniforms = {}
        Object.keys(this.uniforms).forEach(key => {
            const uniform = this.uniforms[key]
            if (uniform.value == undefined && uniform.value !== null) throw new Error(`[µgl] The uniform ${key} has no value`)
            const location = gl.getUniformLocation(program, key)
            const type = getUniformType(uniform)

            uniforms[key] = {
                location,
                type,
                value: uniform.value
            }
        })

        this.needsUpdate = false
        this.#gl = {
            vertexShader,
            fragmentShader,
            program,
            uniforms
        }

        return this.#gl
    }
    
    render(gl, {lastProgramId, textureId} = {}) {
        if (!this.#gl || this.needsUpdate) this.compile(gl)

        if (lastProgramId != this.#id) {
            gl.useProgram(this.#gl.program)
        }

        let numUniforms = gl.getProgramParameter(this.#gl.program, gl.ACTIVE_UNIFORMS)
        for (let i = 0; i < numUniforms; i++) {
            let name = gl.getActiveUniform(this.#gl.program, i).name
            let uniform = this.#gl.uniforms[name]

            if (uniform.value instanceof Texture) {
                gl[uniform.type](uniform.location, textureId)
                uniform.value.render(gl, {textureId})
            } else if (uniform.value instanceof Matrix3 || uniform.value instanceof Matrix4) {
                gl[uniform.type](uniform.location, false, this.uniforms[name].value)
            } else {
                gl[uniform.type](uniform.location, this.uniforms[name].value)
            }
        }
    }

    destroy() {

    }
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
        return shader
    }

    console.warn('[µgl] (createShader error)', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)

    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    if (success) {
        return program
    }

    // TODO:
    // more error info?
    // see https://github.com/mrdoob/three.js/blob/6e89128f1ae239f29f2124a43133bb3d767b19bf/src/renderers/webgl/WebGLProgram.js#L556

    console.warn('[µgl] (createProgram error)', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

function getUniformType(uniform) {
    if (uniform.value instanceof Vector2) return `uniform2fv`
    if (uniform.value instanceof Vector3) return `uniform3fv`
    if (uniform.value instanceof Vector4) return `uniform4fv`
    if (uniform.value instanceof Matrix3) return `uniformMatrix3fv`
    if (uniform.value instanceof Matrix4) return `uniformMatrix4fv`
    if (uniform.value instanceof Texture) return `uniform1i`
    if (uniform.value instanceof Color) return `uniformvec3fv`

    // TODO:
    // Quaternion
    // Arrays
    // int ?
    
    // Default to float
    return 'uniform1f'
}