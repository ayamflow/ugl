import { RenderList } from './renderlist.mjs'

export class Renderer {
    #gl
    #canvas
    #pixelRatio
    #renderList

    constructor(options) {
        let canvas = options.canvas || document.createElement('canvas')
        let glOptions = {
            premultipliedAlpha: false,
            alpha: false,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance'
        }
        let gl = canvas.getContext('webgl2', glOptions)
        if (!gl) {
            throw new Error('[µgl] WebGL2 is not supported')
        }

        this.setPixelRatio(window.devicePixelRatio || 1)

        this.#gl = gl
        this.#canvas = canvas
        this.#renderList = new RenderList()
    }

    setPixelRatio(dpr) {
        this.#pixelRatio = dpr
    }

    setSize(width, height) {
        let dpr = this.#pixelRatio
        this.#canvas.style.width = `${width}px`
        this.#canvas.style.height = `${height}px`
        this.#canvas.width = width * dpr
        this.#canvas.height = height * dpr
        this.#gl.viewport(0, 0, width * dpr, height * dpr)
    }

    clear(color, depth, stencil) {
        const gl = this.#gl
		let bits = 0
		if (color) bits |= gl.COLOR_BUFFER_BIT
		if (depth) bits |= gl.DEPTH_BUFFER_BIT
		if (stencil) bits |= gl.STENCIL_BUFFER_BIT

        gl.clear(bits)
    }

    render(scene, camera) {
        const gl = this.#gl
        gl.viewport(0, 0, this.#canvas.width, this.#canvas.height)
        
        if (camera) camera.updateWorldMatrix()
        
        this.#renderList.setFrom(scene)
        let lastProgramId = null
        let textureId = 0
        this.#renderList.objects.forEach(object => {
            object.render(gl, camera, {lastProgramId, textureId})
            lastProgramId = object.program.id
        })
    }

    destroy() {

    }

    get pixelRatio() {
        return this.#pixelRatio
    }
    
    get gl() {
        return this.#gl
    }

    get canvas() {
        return this.#canvas
    }
}