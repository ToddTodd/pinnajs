'use strict';

const assert = require('assert');
const fs = require('fs')
const path = require('path');

const globby = require('globby');
const _ = require('lodash');
const decamelize = require('decamelize');
const debug = require('debug')('pinna:controller');;

const utils = require('../../core/utils');
const Validator = require('../../core/utils/validator');

class ControllerLoader {

    constructor(app, baseDir) {
        this.app = app;
        this.baseDir = baseDir;

        assert(this.app, 'app is required');
        assert(this.baseDir, 'BaseDir is required');
    }

    load() {
        const target = this.app.Controller = {};
        const items = this.loadController();

        for (const item of items) {
            item.properties.reduce((target, property, index) => {
                let obj;
                if (index === item.properties.length - 1) {
                    obj = item.exports;

                    const properties = {};
                    const { className, filepath, module } = item;
                    _.assign(properties, { className, filepath, module });
                    obj.properties = properties;
                } else {
                    obj = target[property] || {};
                }

                target[property] = obj;
                return obj;
            }, target);


        }
    }

    loadController() {
        const modules = fs.readdirSync(this.baseDir);
        assert(modules.length, `Not found any modules in ${this.baseDir}`)

        const items = [];
        for (const module of modules) {
            const modulePath = path.join(this.baseDir, module);
            debug('Load controller from path: %s', modulePath);

            items[module] = [];

            const filepaths = globby.sync(`${modulePath}/controller/*.js`);
            for (const filepath of filepaths) {
                const propertyPath = _.replace(filepath, `${this.baseDir}/`, '');
                const properties = propertyPath.split('/');
                properties[properties.length - 1] = properties[properties.length - 1].split('.')[0];

                let exports = utils.loadFile(filepath);
                assert(Validator.isClass(exports), `Controller file must be class ${propertyPath}`);

                let result = {};
                const proto = exports.prototype;
                const keys = Object.getOwnPropertyNames(proto);
                for (const key of keys) {
                    if (key === 'constructor') continue;

                    const propertyDescriptor = Object.getOwnPropertyDescriptor(proto, key);
                    if (Validator.isFunction(propertyDescriptor.value) || Validator.isAsyncFunction(propertyDescriptor.value)) {
                        result[key] = methodToMiddleware(exports, key);
                    }
                }

                items.push({
                    filepath,
                    module,
                    properties,
                    exports: result,
                    Controller: exports,
                    className: decamelize(_.last(properties), { separator: '-' })
                })
            }
        }

        return items;
    }
}

module.exports = ControllerLoader;

function methodToMiddleware(Controller, key) {
    return function ControllerMiddleware(ctx) {
        const controller = new Controller(ctx);

        const fn = controller[key];

        if (!Validator.isFunction(fn)) return;

        return controller[key].call(controller, ctx);
    };
}