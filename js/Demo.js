/**
* The Matter.js demo page controller and example runner.
*
* NOTE: For the actual example code, refer to the source files in `/examples/`.
*
* @class Demo
*/

(function() {
    var sourceLinkRoot = 'samples';

    var demo = MatterTools.Demo.create({
        toolbar: {
            title: 'PhysX',
            url: '#',
            reset: true,
            source: false,
            inspector: false,
            tools: false,
            fullscreen: true,
            exampleSelect: true
        },
        tools: {
            inspector: false,
            gui: true
        },
        inline: false,
        preventZoom: true,
        resetOnOrientation: true,
        routing: true,
        startExample: 'mixed',
        examples: [
            {
                name: 'Fricción Aire',
                id: 'airFriction',
                init: Example.airFriction,
                sourceLink: sourceLinkRoot + '/airFriction.js'
            },
            {
                name: 'Avalancha',
                id: 'avalanche',
                init: Example.avalanche,
                sourceLink: sourceLinkRoot + '/avalanche.js'
            },
            {
                name: 'Catapulta',
                id: 'catapult',
                init: Example.catapult,
                sourceLink: sourceLinkRoot + '/catapult.js'
            },
            {
                name: 'Cadenas',
                id: 'chains',
                init: Example.chains,
                sourceLink: sourceLinkRoot + '/chains.js'
            },
            {
                name: 'Friccion',
                id: 'friction',
                init: Example.friction,
                sourceLink: sourceLinkRoot + '/friction.js'
            },
            {
                name: 'Mixto',
                id: 'mixed',
                init: Example.mixed,
                sourceLink: sourceLinkRoot + '/mixed.js'
            },
            {
                name: 'Péndulo de Newton',
                id: 'newtonsCradle',
                init: Example.newtonsCradle,
                sourceLink: sourceLinkRoot + '/newtonsCradle.js'
            },
            {
                name: 'Restitución',
                id: 'restitution',
                init: Example.restitution,
                sourceLink: sourceLinkRoot + '/restitution.js'
            },
            {
                name: 'Resortera',
                id: 'slingshot',
                init: Example.slingshot,
                sourceLink: sourceLinkRoot + '/slingshot.js'
            },
            {
                name: 'Resortes',
                id: 'springs',
                init: Example.constraints,
                sourceLink: sourceLinkRoot + '/spring.js'
            },
            {
                name: 'Vacío',
                id: 'terrain',
                init: Example.terrain,
                sourceLink: sourceLinkRoot + '/terrain.js'
            },
            {
                name: 'Attracción',
                id: 'attractors',
                init: Example.basic,
                sourceLink: sourceLinkRoot + '/attractors.js'
            },
            {
                name: 'Gravitación',
                id: 'gravitation',
                init: Example.gravity,
                sourceLink: sourceLinkRoot + '/gravitation.js'
            }
        ]
    });

    document.body.appendChild(demo.dom.root);

    MatterTools.Demo.start(demo);
})();
