const jwt = require('jsonwebtoken');
const secret = 'aaa'; //撒盐：加密的时候混淆

//jwt生成token
const token = jwt.sign({
    name: 123
}, secret, {
    expiresIn: 30 //秒到期时间
});


console.log(token);
//解密token
setTimeout(() => {
    jwt.verify(token, secret, function (err, decoded) {
        if (!err) {
            console.log(decoded.name);  //会输出123，如果过了60秒，则有错误。
        }else {
            console.log(err)
        }
    });
}, 1500)
