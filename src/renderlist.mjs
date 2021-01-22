export class RenderList {
    constructor() {
        this.objects = []
    }

    findChildren(parent) {
        if (parent.render) this.objects.push(parent)
        parent.children.forEach(child => {
            if (child.children) this.findChildren(child)
            else if (child.render) this.objects.push(child)
        })
    }

    setFrom(parent) {
        this.objects.length = 0
        this.findChildren(parent)
    }
}