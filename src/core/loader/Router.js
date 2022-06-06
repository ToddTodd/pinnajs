'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const KoaRouter = require('@koa/router');
const _ = require('lodash');

const utils = require('../../core/utils')
const Validator = require('../../core/utils/validator');

/**
 * 从module根目录加载router.js
 */
class RouterLoader extends KoaRouter {
    constructor(app, baseDir) {
        super();

        this.app = app;
        this.baseDir = baseDir;

        assert(this.app, 'app is required');
        assert(this.baseDir, 'BaseDir is required');
    }

    load() {
        const modules = fs.readdirSync(this.baseDir);
        assert(modules.length, `Not found any modules in ${this.baseDir}`);

        for (const module of modules) {
            let routePath = path.join(this.baseDir, module, 'route.js');
            routePath = utils.resolveModule(routePath);
            if (!routePath) continue;

            let exports = utils.loadFile(routePath);
            assert(Validator.isFunction(exports), `route file must be function ${routePath}`);

            exports(this, this.app.Controller[module].controller);
        }
    }

    resources(controller) {
        const { properties: { className, module, filePath } } = controller
        if (!this.prefix) this.prefix = `api/${module}/v1`;

        Object.keys(controller).forEach(key => {
            switch (key) {
                case 'create':
                    this.post(`${this.prefix}/${className}`, controller[key]);
                    break;
                case 'update':
                    this.put(`${this.prefix}/${className}/:id`, controller[key]);
                    break;
                case 'show':
                    this.get(`${this.prefix}/${className}/:id`, controller[key]);
                    break;
                case 'list':
                    this.get(`${this.prefix}/${className}`, controller[key]);
                    break;
                case 'delete':
                    this.delete(`${this.prefix}/${className}`, controller[key]);
                    break;
                default:
            }
        });

        return this;
    }

}

module.exports = RouterLoader;