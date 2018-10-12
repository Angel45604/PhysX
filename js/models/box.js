function Box(x, y, w, h, isStatic) {
    let options= {
        isStatic: isStatic
    }
    this.body = Bodies.rectangle(x, y, w, h, options)
    World.add(world, this.body)

    this.show = function() {
        let pos = this.body.position
        let angle = this.body.angle
    }

    this.isOffScreen = function() {
        let pos = this.body.position 
        console.log(this.body.position, world)
        return (pos.y > render.height + 100)
    }

    this.removeFromWorld = function() {
        World.remove(world, this.body)
    }
}