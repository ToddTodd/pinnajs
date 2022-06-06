'use strict';

const isClass = require('is-class');

const isFunction = arg => 'function' === typeof arg;
const isAsyncFunction = arg => obj && obj.constructor && 'AsyncFunction' === obj.constructor.name;

module.exports = {
    isFunction,
    isAsyncFunction,
    isClass
}

