import { Transform } from './transform.mjs'

export class Mesh extends Transform {
    #gl

    constructor(geometry, program) {
        super()
        this.geometry = geometry
        this.program = program

        this.program.uniforms.modelMatrix.value = this.worldMatrix
    }

    compile(gl) {
        if (this.#gl) return this.#gl

        const program = this.program.compile(gl)
        const geometry = this.geometry.compile(gl, program.program)
        
        this.#gl = {
            program,
            geometry
        }

        return this.#gl
    }
    
    render(gl, camera, options = {}) {
        const uniforms = this.program.uniforms
        uniforms.modelMatrix.value = this.worldMatrix
        if (camera) {
            uniforms.viewMatrix.value = camera.worldMatrix
            uniforms.projectionMatrix.value = camera.projectionMatrix
        }

        if (!this.#gl) this.compile(gl)

        this.program.render(gl, options)
        this.geometry.render(gl, this.#gl.program.program)
    }
}