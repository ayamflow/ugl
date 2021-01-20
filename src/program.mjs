
export class Program {
    #gl

    constructor(options = {}) {
        this.needsUpdate = true
        this.vertex = options.vertex
        this.fragment = options.fragment
        
        this.uniforms = {}
        Object.keys(options).forEach(key => {
            const uniform = options[key]
            if (uniform.value != undefined) {
                this.uniforms[key] = options[key]
            }
        })
    }

    compile(gl) {
        if (this.#gl && !this.needsUpdate) return this.#gl

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, this.vertex)
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER,this.fragment)
        const program = createProgram(gl, vertexShader, fragmentShader)

        const uniforms = {}
        Object.keys(this.uniforms).forEach(key => {
            const uniform = this.uniforms[key]
            const location = gl.getUniformLocation(program, key)
            const type = getUniformType(uniform.type)

            uniforms[key] = {
                location,
                type
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
    
    render(gl) {
        if (!this.#gl || this.needsUpdate) this.compile(gl)

        Object.keys(this.#gl.uniforms).forEach(key => {
            const uniform = this.#gl.uniforms[key]
            gl[uniform.type](uniform.location, this.uniforms[key].value)
            // console.log(key, uniform.type, uniform.location, this.uniforms[key].value);
        })
        gl.useProgram(this.#gl.program)
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

function getUniformType(type) {
    switch (type) {
        case 'int':
        case 'sampler2D':
            return 'uniform1i'

        case 'float':
            return 'uniform1f'

        case 'mat2':
        case 'mat3':
        case 'mat4':
            let mat = type.charAt(3)
            return `uniformMatrix${mat}fv`

        case 'vec2':
        case 'vec3':
        case 'vec4':
            let vec = type.charAt(3)
            return `uniform${vec}fv`

        default:
            console.error(`[µgl] Unknown uniform type: ${type}`)
            return
    }
}