'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    loadFile(filepath) {
        try {
            const ext = path.extname(filepath);
            if (!['.js', '.json'].includes(ext) && ext) {
                return fs.readFileSync(filepath);
            }

            const fileObj = require(filepath);
            if (!fileObj) return fileObj;

            return fileObj;
        } catch (error) {
            error.message = `[pinna-core] failed to load ${filepath}, error: ${error.message}`;
            throw error;
        }
    },

    resolveModule(filepath) {
        let modulePath = null;
        try {
            modulePath = require.resolve(filepath);
        } catch (error) {
            console.log(error)
            return null;
        }
        return modulePath;
    },
    async callFn(fn, args, ctx) {
        args = args || [];
        if (!is.function(fn)) return;
        if (is.generatorFunction(fn)) fn = co.wrap(fn);
        return ctx ? fn.call(ctx, ...args) : fn(...args);
    },
}

