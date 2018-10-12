let Engine = Matter.Engine,
    Gui = Matter.Gui,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Render = Matter.Render,
    Mouse = Matter.Mouse

    let canvasContainer = document.querySelector('#canvascontainer')

    let engine = Engine.create()

    let render = Render.create({
        canvas:  canvasContainer,
        engine: engine,
        options: {
            wireframes: true,
            showAngleIndicator: true,
            showDebug: true
        }
    })

let world = engine.world
let  _sceneWidth,
    _sceneHeight


function fullscreen() {
    let _fullscreenElement = render.canvas
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (_fullscreenElement.requestFullscreen) {
            _fullscreenElement.requestFullscreen()
        } else if (_fullscreenElement.mozRequestFullScreen) {
            _fullscreenElement.mozRequestFullScreen()
        } else if (_fullscreenElement.webkitRequestFullscreen) {
            //_fullscreenElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }
    }

}

function updateGravity() {
    if(!engine) {
        return
    }

    let orientation = window.orientation,
        gravity = world.gravity

        if (orientation === 0) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(event.beta, -90, 90) / 90;
        } else if (orientation === 180) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
        } else if (orientation === 90) {
            gravity.x = Common.clamp(event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
        } else if (orientation === -90) {
            gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
        }
}

function updateScene() {
    if (!engine)
            return;
        
        _sceneWidth = document.documentElement.clientWidth;
        _sceneHeight = document.documentElement.clientHeight;

        var boundsMax = engine.world.bounds.max,
            renderOptions = render.options,
            canvas = render.canvas;

        boundsMax.x = _sceneWidth;
        boundsMax.y = _sceneHeight;

        canvas.width = renderOptions.width = _sceneWidth;
        canvas.height = renderOptions.height = _sceneHeight;
        var offset = 5;
        World.addBody(world, Bodies.rectangle(_sceneWidth * 0.5, -offset, _sceneWidth + 0.5, 50.5, { isStatic: true }));
        World.addBody(world, Bodies.rectangle(_sceneWidth * 0.5, _sceneHeight + offset, _sceneWidth + 0.5, 50.5, { isStatic: true }));
        World.addBody(world, Bodies.rectangle(_sceneWidth + offset, _sceneHeight * 0.5, 50.5, _sceneHeight + 0.5, { isStatic: true }));
        World.addBody(world, Bodies.rectangle(-offset, _sceneHeight * 0.5, 50.5, _sceneHeight + 0.5, { isStatic: true }));
    Render.run(render)
}

function start() {
    let mouse = Mouse.create(render.canvas)
    let options = {
        mouse: mouse,
        Constraint: {
            stiffness: 1,
            render: {
                visible: true
            }
        }
    }
    let msConstraint = MouseConstraint.create(engine, options)
    World.add(world, msConstraint)

    let stack = Composites.stack(20, 20, 10, 5, 0, 0, function(x, y, column, row) {
        switch (Math.round(Common.random(0, 1))) {
            
        case 0:
            if (Math.random() < 0.8) {
                return Bodies.rectangle(x, y, Common.random(20, 40), Common.random(20, 40), { friction: 0.01, restitution: 0.4 })
            } else {
                return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30), { friction: 0.01, restitution: 0.4 })
            }
            break;
        case 1:
            return Bodies.polygon(x, y, Math.round(Common.random(4, 6)), Common.random(20, 40), { friction: 0.01, restitution: 0.4 })
        
        }
    })
    World.add(world, stack)

}

function init() {
    fullscreen()
    setTimeout(function() {
        Engine.run(engine)
        updateScene()
    },1500)
    window.addEventListener('deviceorientation', updateGravity(), true)
    window.addEventListener('touchstart', fullscreen())
    window.addEventListener('orientationchange', function() {
        updateGravity()
        updateScene()
        fullscreen()
        
    }, false)
    start()
}

document.addEventListener('DOMContentLoaded', function() {
    init()
})