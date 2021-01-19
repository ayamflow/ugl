export class Mesh {
    #gl

    constructor(geometry, program) {
        this.geometry = geometry
        this.program = program
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
    
    render(gl) {
        if (!this.#gl) this.compile(gl)

        this.program.render(gl)
        this.geometry.render(gl, this.#gl.program.program)
    }
}