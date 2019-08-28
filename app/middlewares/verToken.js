const filterUrl = ['/login/verLogin', '/favicon.ico','/upload'];

module.exports = (req, res, next) => {
    let rb = req.body, url = req.url;
    if (filterUrl.includes(url)) {//包含过滤的url路径
        next();
        return;
    }
    //不包含过滤的url路径
    if (!global.cacheUsers[rb.token]) {//token错误
        res.send('token错误');
    } else {//token正确;
        let tokenInfo = global.cacheUsers[rb.token];
        if (Date.now() - tokenInfo.freshTime > tokenInfo.failTime) { //token过期
            delete global.cacheUsers[rb.token];
            res.send('token过期')
        } else {
            tokenInfo.freshTime = Date.now();
            next()
        }
    }

};



