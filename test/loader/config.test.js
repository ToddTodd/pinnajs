'use strict';
const path = require('path');
const assert = require('assert');
const ConfigLoader = require('../../src/core/loader/ConfigLoader');

describe('test load config', () => {
    let app = {
        appName: 'testApp',
    };

    it('test load default config .js', () => {
        const baseDir = path.join(__dirname, '../fixtures/config/config.default');
        const configLoader = new ConfigLoader(app, baseDir);

        configLoader.loadConfig();
        assert(app.config.bar.a === 'a1');
        assert(app.config.name === 'testApp');
    })

    it('test load default config .json', () => {
        const baseDir = path.join(__dirname, '../fixtures/config/config.default.json');
        const configLoader = new ConfigLoader(app, baseDir);

        configLoader.loadConfig();
        assert(app.config.bar.a === 'a1');
    })

    it('test load env config', () => {
        app.env = 'dev';
        const baseDir = path.join(__dirname, '../fixtures/config/config.env');
        const configLoader = new ConfigLoader(app, baseDir);

        configLoader.loadConfig();
        assert(app.config.name === 'testApp');
        assert(app.config.bar.a === 'a2');
        assert(app.config.bar.bar1.bar2 === 'bar2');
    })

    it('test load mixin config', () => {
        app.env = 'dev';
        const baseDir = path.join(__dirname, '../fixtures/config/config.mixin');
        const configLoader = new ConfigLoader(app, baseDir);

        configLoader.loadConfig();
        assert(app.config.foo1 === 'foo1');
        assert(app.config.bar.bar1.bar2 === 'bar2');
    })

})