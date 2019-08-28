'use strict'

const middleware = require('../middlewares')
const users = require('./users');
const score = require('./score');
const login = require('./login');
const upload = require('./upload')
module.exports = function (app) {
    /* app.use('/score', score);
     app.use('/users', users);*/
    /*app.use('/users/selectUser',(req, res, next) => {
        vertoken.verToken(req.body.token);
        next();
    });*/
    app.use(middleware.verToken);//验证token
    app.use('/login', login);
    app.use('/score', score);
    app.use('/users', users);
    app.use('/upload', upload);

    app.use(middleware.notFind);
}

