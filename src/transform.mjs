import { Matrix4 } from './math/matrix4.mjs'
import { Vector3 } from './math/vector3.mjs'

export class Transform {
    constructor() {
        this.position = new Vector3()
        this.rotation = new Vector3()
        this.scale = new Vector3(1, 1, 1)
        this.localMatrix = new Matrix4()
        this.worldMatrix = new Matrix4()

        this.children = []
        this.parent = null
    }

    updateLocalMatrix() {
        this.localMatrix
            .identity()
            .scale(this.scale)
            .rotate(this.rotation)
            .translate(this.position)
    }

    updateWorldMatrix() {
        this.updateLocalMatrix()
        this.worldMatrix.set(this.localMatrix)
        if (this.parent) {
            this.worldMatrix.multiply(this.parent.worldMatrix)
        }

        this.children.forEach(child => child.updateWorldMatrix())
    }

    addChild(child) {
        if (child.parent) {
            child.parent.removeChild(child)
        }

        child.parent = this
        this.children.push(child)
    }

    removeChild(child) {
        child.parent = null
        this.children.splice(this.children.indexOf(child), 1)
    }
}