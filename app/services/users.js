'use strict'
/*
class UserService {
    async addUser(data) {
        return 'success'
    }
}

module.exports = new UserService()*/
let Service = require('./index')

class UserService extends Service {
    /*selectUser(data) { //不用连接池的方式;
        this.connMysql();
        return new Promise((resolve, reject) => {
            this.conn.query('select * from student', [], (err, res) => {
                this.endMysql();
                err ? resolve(err) : resolve(res)
            })
        })
    };*/
    selectUser(params) {
        return new Promise((resolve, reject) => {
            this.query('select * from role', params, (err, res) => {
                err ? resolve(err) : resolve(res)
            })
        })
    };

    addUser(params) {
        return new Promise((resolve, reject) => {
            var sql = ''
            this.query('insert into role set ?', params, (err, res) => {
                err ? resolve(err) : resolve(res)
            });
        });
    };

    updateUser(params) {
        return new Promise((resolve, reject) => {
            this.query('update role set name = ? where id = 2', params, (err, res) => {
                err ? resolve(err) : resolve(res)
            });
        });
    };

    deleteUser(params) {
        return new Promise((resolve, reject) => {
            this.query('delete from role where id = ?', params, (err, res) => {
                err ? resolve(err) : resolve(res)
            });
        });
    };
    login(params){
        return new Promise((resolve, reject) => {
            this.query('select * from user where username=? and password=?', params, (err, res) => {
                err ? resolve(err) : resolve(res)
            });
        })
    }

}

module.exports = new UserService()