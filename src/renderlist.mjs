export class RenderList {
    constructor() {
        this.objects = []
    }

    setFrom(parent) {
        this.objects.length = 0
        this.objects.push(parent)
        parent.children.forEach(child => {
            if (child.children) this.setFrom(child)
            else this.objects.push(child)
        })
    }
}