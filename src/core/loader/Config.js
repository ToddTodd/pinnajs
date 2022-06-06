const path = require('path');
const assert = require('assert');

const _ = require('lodash');
const debug = require('debug')('pinna:config');

const utils = require('../utils');
const validator = require('../utils/validator');


/**
 * config.default.js 为默认的配置文件
 * config.prod.js 覆盖 config.default.js
 * config.dev.js 覆盖 config.default.js
 */
class ConfigLoader {
    constructor(app, baseDir) {
        this.app = app;
        this.baseDir = baseDir;

        assert(this.app, 'app is required');
        assert(this.baseDir, 'BaseDir is required');
    }

    load() {
        const names = ['config.default'];
        if (this.app.env) names.push(`config.${this.app.env}`)

        const config = {};
        for (const name of names) {
            let filepath = path.join(this.baseDir, name);
            filepath = utils.resolveModule(filepath);
            if (!filepath) continue;

            let ret = utils.loadFile(filepath);
            if (validator.isFunction(ret) && !validator.isClass(ret)) {
                ret = ret(this.app);
            }

            debug('Loaded config from path: %s', filepath);
            _.assign(config, ret);
        }

        debug('App config is %j',config);

        this.app.config = config;
    }

}

module.exports = ConfigLoader;