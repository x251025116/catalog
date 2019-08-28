'use strict'
const userService = require('../services/users');
var settoken = require('../myUtils/index');

class UsersController {
    async selectUser(req, res, next) {
        const params = req.body;
        const result = await userService.selectUser(params);
        res.send(result);
    }

    async addUser(req, res, next) {
        const result = await userService.addUser({name: "哈哈哈"});
        res.send(result);
    }

    async updateUser(req, res, next) {
        const result = await userService.updateUser(["哈哈"]);
        res.send(result);
    }

    async deleteUser(req, res, next) {
        const result = await userService.deleteUser([2]);
        res.send(result);
    }
}

module.exports = new UsersController();
