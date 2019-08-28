const Service = require('./index');

class LoginService extends Service {
    login(params) {
        return new Promise((resolve, reject) => {
            var sql = "select * from user where username=? and password=?"
            this.query(sql, params, (err, res) => {
                err ? resolve(err) : resolve(res);
            });
        });
    }
}

module.exports = new LoginService();