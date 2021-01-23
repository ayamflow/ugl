import { Transform } from './transform.mjs'
import { Matrix4 } from './math/matrix4.mjs'

export class Camera extends Transform {
    constructor(options = {}) {
        super()
        this.projectionMatrix = new Matrix4()
        this.viewMatrix = new Matrix4()

        if (options.fov) this.perspective(options)
        else this.orthographic(options)
    }

    perspective({fov, aspect, near, far}) {
        // https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
        var vFOV = Math.tan(Math.PI * 0.5 - 0.5 * fov)
        var rangeInv = 1 / (near - far)
 
        this.projectionMatrix.set([
            vFOV / aspect, 0, 0, 0,
            0, vFOV, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ])
    }

    orthographic({left, right, top, bottom, near, far}) {
        // https://webgl2fundamentals.org/webgl/lessons/webgl-3d-orthographic.html
        this.projectionMatrix.set([
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, -2 / (near - far), 0,
       
            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1,
        ])
    }

    updateWorldMatrix() {
        super.updateWorldMatrix()
        this.viewMatrix.copy(this.worldMatrix).inverse()
    }
}