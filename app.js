'use strict';
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const routers = require('./app/routers/index.js');
const _ = require('lodash');
require('./app/cache/index');
/*process.on('uncaughtException', (err) => {

});*/
app.use(bodyParser.urlencoded({extended:false}));//解析 x-www-form-urlencoded
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));
// 注册路由
routers(app);

app.listen(3001);
