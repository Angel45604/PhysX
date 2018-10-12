let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint

let engine = Engine.create()
let world = engine.world

let canvasContainer = document.querySelector('#canvascontainer')

let render = Render.create({
    engine: engine,
    canvas: canvasContainer,
    options: {
        width: 700,
        height: 500,
        pixelRatio: window.devicePixelRatio,
        background: '#fafafa',
        wireframeBackground: '#222',
        hasBounds: true,
        enabled: true,
        wireframes: true,
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false

    }
})

Engine.run(engine)

Render.run(render)

let mouses = Mouse.create(render.canvas)
let msConstraintOptions = {
    mouse: mouses,
    constraint : {
        stiffness: 1,
        render: {
            visible: false
        }
    }
}
let msConstraint = MouseConstraint.create(engine, msConstraintOptions)
World.add(world, msConstraint)

let ground = new Box(render.options.width/2, render.options.height, render.options.width, 5, true)

const UNIT = render.options.width/10;
console.log(UNIT)

let box = new Box(50, 0, UNIT, UNIT)
let box2 = new Box(1500, 0, UNIT, UNIT)
console.log(Render)

let boxes = []
render.canvas.addEventListener('click', function(event) {
    let offset = document.querySelector('.spacer').offsetWidth;
    console.log(offset)
    console.log(event)
    console.log(event.clientX, event.clientY)
    console.log(world.bodies)
    if(event.ctrlKey) {
        boxes.push(new Box(event.clientX - offset, event.clientY - 20, 50, 50))
        Engine.update(engine)
    }
})

Matter.Events.on(engine, 'beforeUpdate', function() {
    //boxes.push(new Box(350, 50, UNIT, UNIT))

    for(let i = 0; i < boxes.length; i++) {
        if(boxes[i].body.position.y > render.options.height) {
            boxes[i].removeFromWorld()
            boxes.splice(i, 1)
            i--
        }
    }
})