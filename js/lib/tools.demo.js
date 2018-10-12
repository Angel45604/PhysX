/*!
 * matter-tools 0.11.1 by Liam Brummitt 2017-07-02
 * https://github.com/liabru/matter-tools
 * License MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("matter-js"), require("matter-tools"));
	else if(typeof define === 'function' && define.amd)
		define(["matter-js", "matter-tools"], factory);
	else if(typeof exports === 'object')
		exports["Demo"] = factory(require("matter-js"), require("matter-tools"));
	else
		root["MatterTools"] = root["MatterTools"] || {}, root["MatterTools"]["Demo"] = factory(root["Matter"], root["MatterTools"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	let installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		let module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/demo/lib";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * A tool for for running and testing example scenes.
	 * @module Demo
	 */

	let Matter = __webpack_require__(1);
	let Common = Matter.Common;
	let Demo = module.exports = {};
	let Gui = __webpack_require__(2).Gui;
	let Inspector = __webpack_require__(2).Inspector;
	let ToolsCommon = __webpack_require__(3);

	Demo._isIOS = window.navigator && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

	Demo._matterLink = 'MEGUSTANLOSMEMES';

	/**
	 * Creates a new demo instance.
	 * See example for options and usage.
	 * @function Demo.create
	 * @param {} options
	 */
	Demo.create = function (options) {
	  let demo = Object.assign({
	    example: {
	      instance: null
	    },
	    examples: [],
	    resetOnOrientation: false,
	    preventZoom: false,
	    inline: false,
	    startExample: true,
	    appendTo: document.body,
	    toolbar: {
	      title: null,
	      url: null,
	      reset: true,
	      source: false,
	      inspector: false,
	      tools: false,
	      fullscreen: true,
	      exampleSelect: false
	    },
	    tools: {
	      inspector: null,
	      gui: null
	    },
	    dom: {}
	  }, options || {});

	  if (demo.examples.length > 1 && options.toolbar.exampleSelect !== false) {
	    demo.toolbar.exampleSelect = true;
	  }

	  if (Demo._isIOS) {
	    demo.toolbar.fullscreen = false;
	  }

	  if (!Gui) {
	    demo.toolbar.tools = false;
	    demo.tools.gui = false;
	  }

	  if (!Inspector) {
	    demo.toolbar.inspector = false;
	    demo.tools.inspector = false;
	  }

	  demo.dom = Demo._createDom(demo);
	  Demo._bindDom(demo);

	  if (demo.inline) {
	    demo.dom.root.classList.add('matter-demo-inline');
	  }

	  if (demo.appendTo) {
	    demo.appendTo.appendChild(demo.dom.root);
	  }

	  if (demo.startExample) {
	    Demo.start(demo, demo.startExample);
	  }

	  return demo;
	};

	/**
	 * Starts a new demo instance by running the first or given example.
	 * See example for options and usage.
	 * @function Demo.start
	 * @param {demo} demo
	 * @param {string} [initalExampleId] example to start (defaults to first)
	 */
	Demo.start = function (demo, initalExampleId) {
	  initalExampleId = typeof initalExampleId === 'string' ? initalExampleId : demo.examples[0].id;

	  if (window.location.hash.length > 0) {
	    initalExampleId = window.location.hash.slice(1);
	  }

	  Demo.setExampleById(demo, initalExampleId);
	};

	/**
	 * Stops the currently running example in the demo.
	 * This requires that the `example.init` function returned 
	 * an object specifiying a `stop` function.
	 * @function Demo.stop
	 * @param {demo} demo
	 */
	Demo.stop = function (demo) {
	  if (demo.example && demo.example.instance) {
	    demo.example.instance.stop();
	  }
	};

	/**
	 * Stops and restarts the currently running example.
	 * @function Demo.reset
	 * @param {demo} demo
	 */
	Demo.reset = function (demo) {
	  Common._nextId = 0;
	  Common._seed = 0;

	  Demo.setExample(demo, demo.example);
	};

	/**
	 * Starts the given example by its id. 
	 * Any running example will be stopped.
	 * @function Demo.setExampleById
	 * @param {demo} demo
	 * @param {string} exampleId 
	 */
	Demo.setExampleById = function (demo, exampleId) {
	  let example = demo.examples.filter(function (example) {
	    return example.id === exampleId;
	  })[0];

	  Demo.setExample(demo, example);
	};

	/**
	 * Starts the given example.
	 * Any running example will be stopped.
	 * @function Demo.setExample
	 * @param {demo} demo
	 * @param {example} example 
	 */
	Demo.setExample = function (demo, example) {
	  if (example) {
	    let instance = demo.example.instance;

	    if (instance) {
	      instance.stop();

	      if (instance.canvas) {
	        instance.canvas.parentElement.removeChild(instance.canvas);
	      }
	    }

	    window.location.hash = example.id;

	    demo.example.instance = null;
	    demo.example = example;

	    demo.example.instance = instance = example.init(demo);

	    if (!instance.canvas && instance.render) {
	      instance.canvas = instance.render.canvas;
	    }

	    if (instance.canvas) {
	      demo.dom.header.style.maxWidth = instance.canvas.width + 'px';
	      demo.dom.root.appendChild(instance.canvas);
	    }

	    demo.dom.exampleSelect.value = example.id;
	    demo.dom.buttonSource.href = example.sourceLink || demo.url || '#';

	    setTimeout(function () {
	      if (demo.tools.inspector) {
	        Demo.setInspector(demo, true);
	      }

	      if (demo.tools.gui) {
	        Demo.setGui(demo, true);
	      }
	    }, 500);
	  } else {
	    Demo.setExample(demo, demo.examples[0]);
	  }
	};

	/**
	 * Enables or disables the inspector tool.
	 * If `enabled` a new `Inspector` instance will be created and the old one destroyed.
	 * @function Demo.setInspector
	 * @param {demo} demo
	 * @param {bool} enabled
	 */
	Demo.setInspector = function (demo, enabled) {
	  if (!enabled) {
	    Demo._destroyTools(demo, true, false);
	    demo.dom.root.classList.toggle('matter-inspect-active', false);
	    return;
	  }

	  let instance = demo.example.instance;

	  Demo._destroyTools(demo, true, false);
	  demo.dom.root.classList.toggle('matter-inspect-active', true);

	  demo.tools.inspector = Inspector.create(instance.engine, instance.render);
	};

	/**
	 * Enables or disables the Gui tool.
	 * If `enabled` a new `Gui` instance will be created and the old one destroyed.
	 * @function Demo.setGui
	 * @param {demo} demo
	 * @param {bool} enabled
	 */
	Demo.setGui = function (demo, enabled) {
	  if (!enabled) {
	    Demo._destroyTools(demo, false, true);
	    demo.dom.root.classList.toggle('matter-gui-active', false);
	    return;
	  }

	  let instance = demo.example.instance;

	  Demo._destroyTools(demo, false, true);
	  demo.dom.root.classList.toggle('matter-gui-active', true);

	  demo.tools.gui = Gui.create(instance.engine, instance.runner, instance.render);
	};

	Demo._destroyTools = function (demo, destroyInspector, destroyGui) {
	  let inspector = demo.tools.inspector,
	      gui = demo.tools.gui;

	  if (destroyInspector && inspector && inspector !== true) {
	    Inspector.destroy(inspector);
	    demo.tools.inspector = null;
	  }

	  if (destroyGui && gui && gui !== true) {
	    Gui.destroy(gui);
	    demo.tools.gui = null;
	  }
	};

	Demo._toggleFullscreen = function (demo) {
	  let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

	  if (!fullscreenElement) {
	    fullscreenElement = demo.dom.root;

	    if (fullscreenElement.requestFullscreen) {
	      fullscreenElement.requestFullscreen();
	    } else if (fullscreenElement.mozRequestFullScreen) {
	      fullscreenElement.mozRequestFullScreen();
	    } else if (fullscreenElement.webkitRequestFullscreen) {
	      fullscreenElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    }
	  } else {
	    if (document.exitFullscreen) {
	      document.exitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitExitFullscreen) {
	      document.webkitExitFullscreen();
	    }
	  }
	};

	Demo._bindDom = function (demo) {
	  let dom = demo.dom;

	  window.addEventListener('orientationchange', function () {
	    setTimeout(function () {
	      if (demo.resetOnOrientation) {
	        Demo.reset(demo);
	      }
	    }, 300);
	  });

	  if (demo.preventZoom) {
	    document.body.addEventListener('gesturestart', function (event) {
	      event.preventDefault();
	    });

	    let allowTap = true,
	        tapTimeout;

	    document.body.addEventListener('touchstart', function (event) {
	      if (!allowTap) {
	        event.preventDefault();
	      }

	      allowTap = false;

	      clearTimeout(tapTimeout);
	      tapTimeout = setTimeout(function () {
	        allowTap = true;
	      }, 500);
	    });
	  }

	  if (dom.exampleSelect) {
	    dom.exampleSelect.addEventListener('change', function () {
	      let exampleId = this.options[this.selectedIndex].value;
	      Demo.setExampleById(demo, exampleId);
	    });
	  }

	  if (dom.buttonReset) {
	    dom.buttonReset.addEventListener('click', function () {
	      Demo.reset(demo);
	    });
	  }

	  if (dom.buttonInspect) {
	    dom.buttonInspect.addEventListener('click', function () {
	      let showInspector = !demo.tools.inspector;
	      Demo.setInspector(demo, showInspector);
	    });
	  }

	  if (dom.buttonTools) {
	    dom.buttonTools.addEventListener('click', function () {
	      let showGui = !demo.tools.gui;
	      Demo.setGui(demo, showGui);
	    });
	  }

	  if (dom.buttonFullscreen) {
	    dom.buttonFullscreen.addEventListener('click', function () {
	      Demo._toggleFullscreen(demo);
	    });

	    let fullscreenChange = function fullscreenChange() {
	      let isFullscreen = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen;
	      document.body.classList.toggle('matter-is-fullscreen', isFullscreen);

	      setTimeout(function () {
	        Demo.setExample(demo, demo.example);
	      }, 500);
	    };

	    document.addEventListener('webkitfullscreenchange', fullscreenChange);
	    document.addEventListener('mozfullscreenchange', fullscreenChange);
	    document.addEventListener('fullscreenchange', fullscreenChange);
	  }
	};

	Demo._createDom = function (options) {
	  let styles = __webpack_require__(4);
	  ToolsCommon.injectStyles(styles, 'matter-demo-style');

	  let root = document.createElement('div');

	  let exampleOptions = options.examples.map(function (example) {
	    return '<option value="' + example.id + '">' + example.name + '</option>';
	  }).join(' ');

	  let preventZoomClass = options.preventZoom && Demo._isIOS ? 'prevent-zoom-ios' : '';

	  root.innerHTML = `
<div class="matter-demo ${options.toolbar.title} ${preventZoomClass}">
	<div class="matter-header-outer">
		<header class="matter-header">
			<div class="matter-header-inner">
				<h1 class="matter-demo-title">
					<a href="${options.toolbar.url}" target="_blank">${options.toolbar.title}
						<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"/>
							<path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>
						</svg>
					</a>
				</h1>
				<div class="matter-toolbar">
					<div class="matter-select-wrapper">
						<select class="matter-example-select matter-select">${exampleOptions}</select>
						<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M7 10l5 5 5-5z"/>
							<path d="M0 0h24v24H0z" fill="none"/>
						</svg>
					</div>
					<button class="matter-btn matter-btn-reset" title="Reset">
						<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
							<path d="M0 0h24v24H0z" fill="none"/>
						</svg>
					</button>
					<a href="#" class="matter-btn matter-btn-source" title="Source" target="_blank">{ }</a>
					<button class="matter-btn matter-btn-tools" title="Tools">
						<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
							<path d="M0 0h24v24H0z" fill="none"/>
						</svg>
					</button>
					<button class="matter-btn matter-btn-inspect" title="Inspect">
						<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"/>
							<path d="M11 4.07V2.05c-2.01.2-3.84 1-5.32 2.21L7.1 5.69c1.11-.86 2.44-1.44 3.9-1.62zm7.32.19C16.84 3.05 15.01 2.25 13 2.05v2.02c1.46.18 2.79.76 3.9 1.62l1.42-1.43zM19.93 11h2.02c-.2-2.01-1-3.84-2.21-5.32L18.31 7.1c.86 1.11 1.44 2.44 1.62 3.9zM5.69 7.1L4.26 5.68C3.05 7.16 2.25 8.99 2.05 11h2.02c.18-1.46.76-2.79 1.62-3.9zM4.07 13H2.05c.2 2.01 1 3.84 2.21 5.32l1.43-1.43c-.86-1.1-1.44-2.43-1.62-3.89zM15 12c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm3.31 4.9l1.43 1.43c1.21-1.48 2.01-3.32 2.21-5.32h-2.02c-.18 1.45-.76 2.78-1.62 3.89zM13 19.93v2.02c2.01-.2 3.84-1 5.32-2.21l-1.43-1.43c-1.1.86-2.43 1.44-3.89 1.62zm-7.32-.19C7.16 20.95 9 21.75 11 21.95v-2.02c-1.46-.18-2.79-.76-3.9-1.62l-1.42 1.43z"/>
						</svg>
					</button>
					<button class="matter-btn matter-btn-fullscreen" title="Fullscreen">
						<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"/>
							<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
						</svg>
					</button>
				</div>

			</div>
		</header>
</div>
</div>
`;

	  let dom = {
	    root: root.firstElementChild,
	    title: root.querySelector('.matter-demo-title'),
	    header: root.querySelector('.matter-header'),
	    exampleSelect: root.querySelector('.matter-example-select'),
	    buttonReset: root.querySelector('.matter-btn-reset'),
	    buttonSource: root.querySelector('.matter-btn-source'),
	    buttonTools: root.querySelector('.matter-btn-tools'),
	    buttonInspect: root.querySelector('.matter-btn-inspect'),
	    buttonFullscreen: root.querySelector('.matter-btn-fullscreen')
	  };

	  if (!options.toolbar.title) {
	    ToolsCommon.domRemove(dom.title);
	  }

	  if (!options.toolbar.exampleSelect) {
	    ToolsCommon.domRemove(dom.exampleSelect.parentElement);
	  }

	  if (!options.toolbar.reset) {
	    ToolsCommon.domRemove(dom.buttonReset);
	  }

	  if (!options.toolbar.source) {
	    ToolsCommon.domRemove(dom.buttonSource);
	  }

	  if (!options.toolbar.inspector) {
	    ToolsCommon.domRemove(dom.buttonInspect);
	  }

	  if (!options.toolbar.tools) {
	    ToolsCommon.domRemove(dom.buttonTools);
	  }

	  if (!options.toolbar.fullscreen) {
	    ToolsCommon.domRemove(dom.buttonFullscreen);
	  }

	  return dom;
	};

	/*** EXPORTS FROM exports-loader ***/

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	/**
	* @class Common
	*/

	let Common = module.exports = {};

	Common.injectStyles = function (styles, id) {
	  if (document.getElementById(id)) {
	    return;
	  }

	  let root = document.createElement('div');
	  root.innerHTML = '<style id="' + id + '" type="text/css">' + styles + '</style>';

	  let lastStyle = document.head.querySelector('style:last-of-type');

	  if (lastStyle) {
	    Common.domInsertBefore(root.firstElementChild, lastStyle);
	  } else {
	    document.head.appendChild(root.firstElementChild);
	  }
	};

	Common.injectScript = function (url, id, callback) {
	  if (document.getElementById(id)) {
	    return;
	  }

	  let script = document.createElement('script');
	  script.id = id;
	  script.src = url;
	  script.onload = callback;

	  document.body.appendChild(script);
	};

	Common.domRemove = function (element) {
	  return element.parentElement.removeChild(element);
	};

	Common.domInsertBefore = function (element, before) {
	  return before.parentNode.insertBefore(element, before.previousElementSibling);
	};

	/*** EXPORTS FROM exports-loader ***/

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = `
	/*\n*\tMatterTools.Demo\n*/
.matter-demo {
	font-family: Helvetica, Arial, sans-serif;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	background: #14151f;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	height: 100vh;
}

.matter-demo canvas {
	border-radius: 8px;
	max-width: 100%;
	max-height: 100%;
}

.matter-demo.matter-demo-inline canvas {
	max-height: calc(100% - 50px);
}

@media screen and (min-width: 900px) and (min-height: 600px) {
	.matter-demo.matter-demo-inline canvas {
		max-height: calc(100% - 100px);
	}
}

.matter-is-fullscreen .matter-demo {
	width: 100%;
}

.matter-is-fullscreen .dg.ac,
.matter-is-fullscreen .ins-container {
	display: none;
}

.matter-header-outer {
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.2);
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-transition: background 400ms ease;
	-o-transition: background 400ms ease;
	transition: background 400ms ease;
}

.matter-header-outer:hover {
	background: rgba(0, 0, 0, 0.7);
}

.matter-demo-inline .matter-header-outer {
	position: static;
	background: transparent;
	z-index: 0;
	width: 100%;
}

.matter-header {
	width: 100%;
	padding: 7px 20px 8px 20px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
}

.matter-demo-inline .matter-header {
	padding: 10px;
}

body .ins-container, body .dg .dg.main, body .dg .dg.main.a {
	padding-top: 52px;
}

@media screen and (min-width: 500px) {
	.matter-demo-inline .matter-header {
		padding: 10px 30px 16px 30px;
	}
}

@media screen and (min-width: 900px) and (min-height: 600px) {
	.matter-demo-inline .matter-header {
		padding: 10px 30px 36px 30px;
	}
}

.matter-header-inner {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	justify-content: space-between;
	max-width: 960px;
	width: 100%;
}

.matter-header h1 {
	display: none;
	margin: 0;
	width: 18px;
	overflow: hidden;
}

.matter-header h1 a {
	color: #f2f2f5;
	font-size: 15px;
	font-weight: 400;
	font-family: Helvetica, Arial, sans-serif;
	display: block;
	text-decoration: none;
	padding: 8px 0 3px 0;
	border-bottom: 2px solid transparent;
	white-space: nowrap;
	float: right;
}

@media screen and (min-width: 300px) {
	.matter-header h1 {
		display: inline;
	}
}

@media screen and (min-width: 600px) {
	.matter-header h1 {
		width: auto;
		overflow: visible;
	}
}

.btn-home {
	display: none;
}

.matter-demo-title svg {
	fill: #fff;
	width: 16px;
	height: 16px;
	margin: 0px 0 -2px 4px;
}

.matter-header h1 a:hover {
	border-bottom: 2px solid #F5B862;
}

.matter-link {
	font-family: Helvetica, Arial, sans-serif;
	text-decoration: none;
	line-height: 13px;
	margin: 0 -10px 0 0;
}

.matter-logo {
	height: 33px;
	width: 52px;
}

.matter-logo #m-triangle {
	-webkit-transform-origin: 14px 856px;
	-ms-transform-origin: 14px 856px;
	transform-origin: 14px 856px;
	-webkit-transition: -webkit-transform 400ms ease;
	transition: -webkit-transform 400ms ease;
	-o-transition: transform 400ms ease;
	transition: transform 400ms ease;
	transition: transform 400ms ease, -webkit-transform 400ms ease;
}

.matter-logo:hover #m-triangle {
	-webkit-transform: rotate(-30deg) translate(-98px, -25px);
	-ms-transform: rotate(-30deg) translate(-98px, -25px);
	transform: rotate(-30deg) translate(-98px, -25px);
}

.matter-logo #m-circle {
	-webkit-transition: -webkit-transform 200ms ease;
	transition: -webkit-transform 200ms ease;
	-o-transition: transform 200ms ease;
	transition: transform 200ms ease;
	transition: transform 200ms ease, -webkit-transform 200ms ease;
	-webkit-transition-delay: 300ms;
	-o-transition-delay: 300ms;
	transition-delay: 300ms;
}

.matter-logo #m-square {
	-webkit-transition: -webkit-transform 150ms ease;
	transition: -webkit-transform 150ms ease;
	-o-transition: transform 150ms ease;
	transition: transform 150ms ease;
	transition: transform 150ms ease, -webkit-transform 150ms ease;
	-webkit-transition-delay: 400ms;
	-o-transition-delay: 400ms;
	transition-delay: 400ms;
}

.matter-logo:hover #m-circle {
	-webkit-transform: translate(18px, -33px);
	-ms-transform: translate(18px, -33px);
	transform: translate(18px, -33px);
}

.matter-logo:hover #m-square {
	-webkit-transform: translate(47px, -2px);
	-ms-transform: translate(47px, -2px);
	transform: translate(47px, -2px);
}

.matter-toolbar {
	-webkit-box-flex: 1;
	-ms-flex-positive: 1;
	flex-grow: 1;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
}

.matter-select {
	background: transparent;
	color: #fff;
	font-size: 15px;
	height: 30px;
	width: 100%;
	outline: none;
	padding: 0 7px;
	margin: 0;
	border: 0;
	border-radius: 0;
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
}

select option {
	margin: 40px;
    background: rgba(0, 0, 0, 0.2);
    color: #000;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);

}

.prevent-zoom-ios .matter-select {
	font-size: 16px;
}

.matter-select-wrapper {
	width: 20%;
	min-width: 100px;
	max-width: 200px;
	position: relative;
	display: inline-block;
	margin: 1px 6% 0 0;
}

.matter-select-wrapper:hover:after svg {
	fill: #fff;
}

.matter-select-wrapper svg {
	display: block;
	pointer-events: none;
	fill: #cecece;
	width: 22px;
	height: 22px;
	position: absolute;
	top: 4px;
	right: 5px;
}

.prevent-zoom-ios .matter-select-wrapper:after {
	top: 4px;
}

.matter-btn {
	font-family: Helvetica, Arial, sans-serif;
	border: 0;
	background: rgba(0,0,0,0.1);
	padding: 2px 0 0 0;
	width: 40px;
	height: 33px;
	border-radius: 2px;
	display: inline-block;
	font-size: 16px;
	line-height: 1;
	color: #c2cad4;
	text-decoration: none;
	text-align: center;
}

.matter-btn svg {
	fill: #fff;
	width: 16px;
	height: 16px;
	margin: 2px 0 0 0;
}

.matter-demo-inline .matter-btn {
	background: #0f0f13;
}

.matter-btn:focus {
	outline: 0;
}

.matter-btn:hover {
	-webkit-transform: translate(0px, -1px);
	-ms-transform: translate(0px, -1px);
	transform: translate(0px, -1px);
}

.matter-btn:active {
	-webkit-transform: translate(0px, 1px);
	-ms-transform: translate(0px, 1px);
	transform: translate(0px, 1px);
}

.matter-btn:hover {
	background: #212a3a;
}

.matter-btn-reset:active svg {
	fill: #76F09B;
}

.matter-btn-tools {
	display: none;
	font-size: 15px;
	padding-right: 3px;
}

.matter-gui-active .matter-btn-tools svg {
	fill: #F55F5F;
}

.matter-btn-inspect {
	display: none;
}

.matter-inspect-active .matter-btn-inspect svg {
	fill: #fff036;
}

.matter-btn-source {
	display: none;
	font-size: 12px;
	text-align: center;
	line-height: 31px;
}

.matter-btn-source:active {
	color: #F5B862;
}

.matter-btn-fullscreen {
	font-size: 18px;
}

.matter-btn-source:active svg {
	fill: #F5B862;
}

.matter-is-fullscreen .matter-btn-tools,
.matter-is-fullscreen .matter-btn-inspect {
	display: none;
}

.matter-is-fullscreen .matter-btn-fullscreen svg {
	fill: #76F09B;
}

.ins-container, body .dg {
	display: none;
}

@media screen and (min-width: 500px) {
	.ins-container, body .dg, .matter-btn-tools, .matter-btn-inspect, .matter-btn-source {
		display: block;
	}
}`

/***/ }
/******/ ])
});
;