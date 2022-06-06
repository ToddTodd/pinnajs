'use strict';
const path = require('path');
const assert = require('assert');
const ConfigLoader = require('../../src/core/loader/ConfigLoader');
const ControllerLoader = require('../../src/core/loader/ControllerLoader');
const RouterLoader = require('../../src/core/loader/RouterLoader');

const baseDir = path.join(__dirname,'../fixtures/controller/app');

const controllerLoader = new ControllerLoader({},baseDir);
const controllers = controllerLoader.loadController()

const routerLoader = new RouterLoader({config:{}},null,controllers);
routerLoader.loadRouter();

// let app = {
//     appName: 'testApp'
// };

// const baseDir = path.join(__dirname,'../fixtures/config/config.default');
// const configLoader = new ConfigLoader(app,baseDir);



// configLoader.loadConfig();