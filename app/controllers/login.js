const token = require('../myUtils/index');
const LoginService = require('../services/login');

class LoginController {
    async verLogin(req, res, next) {
        let rb = req.body;

        let params = [rb.username, rb.password];
        let result = await LoginService.login(params);
        if (!result.length) {
            res.send({status: false, msg: "用户名或密码错误"});
            return
        }
        result = result[0];
        let username = result.username;
        if (LoginController.isLogin(username)) {//已登录
            if (LoginController.isTokenFail(username)) {//登录过期
                let copyResult = LoginController.copyObj(result);
                LoginController.doLogin(res, copyResult);
            } else {//登录未过期;
                res.send('已经登录');
            }
        } else {//未登录
            let copyResult = LoginController.copyObj(result);
            LoginController.doLogin(res, copyResult);
        }


    }

    async exit(req, res, next) {
        let rb = req.body;
        if (!global.cacheUsers[rb.token]) {
            res.send('请传入正确的token!')
        } else {
            delete global.cacheUsers[rb.token];
            res.send('退出成功')
        }
    }

    static doLogin(res, result) {
        let token_ = token.setToken();
        global.cacheUsers[token_] = result;
        global.cacheUsers[token_].failTime = token.failTime();
        global.cacheUsers[token_].freshTime = token.freshTime();
        result.token = token_;
        res.send(result)
    }

    static isTokenFail(username) {
        for (let i in global.cacheUsers) {
            if (global.cacheUsers[i].username == username) {
                let tokenInfo = global.cacheUsers[i];
                if (Date.now() - tokenInfo.freshTime > tokenInfo.failTime) { //token过期
                    delete global.cacheUsers[i];
                    return true
                } else {//token未过期
                    return false
                }
            }
        }
    }

    static isLogin(username) {
        for (let i in global.cacheUsers) {
            if (global.cacheUsers[i].username == username) {
                return true
            }
        }
        return false;
    }

    static copyObj(obj) {
        let str = JSON.stringify(obj);
        let strToObj = JSON.parse(str);
        return strToObj;
    }
}

module.exports = new LoginController();