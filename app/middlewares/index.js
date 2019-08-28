'use strict';
const middleware = {};

middleware.notFind = require('./not-find');
middleware.verToken = require('./verToken');
module.exports = middleware;