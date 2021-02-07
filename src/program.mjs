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

        this.depthTest = options.depthTest || true
        this.depthWrite = options.depthWrite || true
        this.side = options.side // null is Double Sided / no culling
        
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

        // Uniforms location
        const uniforms = {}
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
        for (let i = 0; i < numUniforms; i++) {
            const name = gl.getActiveUniform(program, i).name
            const uniform = this.uniforms[name]
            if (uniform.value == undefined && uniform.value !== null) {
                throw new Error(`[µgl] The uniform ${key} has no value`)
            }
            const location = gl.getUniformLocation(program, name)
            const type = getUniformType(uniform)

            uniforms[name] = {
                location,
                type
            }
        }

        // Attributes location
        const attributes = {}
        const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
        for (let i = 0; i < numAttribs; i++) {
            const name = gl.getActiveAttrib(program, i).name
            const location = gl.getAttribLocation(program, name)

            attributes[name] = {
                location
            }
        }

        this.needsUpdate = false
        this.#gl = {
            vertexShader,
            fragmentShader,
            program,
            uniforms,
            attributes
        }

        return this.#gl
    }
    
    render(gl, {lastProgramId, textureId} = {}) {
        if (!this.#gl || this.needsUpdate) this.compile(gl)

        if (lastProgramId != this.#id) {
            gl.useProgram(this.#gl.program)
        }

        // Cull test/side
        if (this.side) {
            gl.enable(gl.CULL_FACE)
            gl.cullFace(this.side)
        } else {
            gl.disable(gl.CULL_FACE)
        }

        // Depth test/write
        // gl.depthFunc(gl.LESS) // Default
        if (this.depthTest) gl.enable(gl.DEPTH_TEST)
        else gl.disable(gl.DEPTH_TEST)
        gl.depthMask(this.depthWrite)

        const numUniforms = gl.getProgramParameter(this.#gl.program, gl.ACTIVE_UNIFORMS)
        for (let i = 0; i < numUniforms; i++) {
            const name = gl.getActiveUniform(this.#gl.program, i).name
            const uniform = this.#gl.uniforms[name]
            const value = this.uniforms[name].value

            // TODO: new uniforms might need location

            if (value instanceof Texture) {
                gl[uniform.type](uniform.location, textureId)
                value.render(gl, {textureId})
            } else if (value instanceof Matrix3 || value instanceof Matrix4) {
                gl[uniform.type](uniform.location, false, value)
            } else {
                gl[uniform.type](uniform.location, value)
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