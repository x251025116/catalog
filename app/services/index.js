/*
'use strict'
const Services = {}

Services.users = require('./users')

module.exports = Services*/

const mysql = require('mysql');

let opt = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'test',
    multipleStatements: true,
};

let pool = mysql.createPool(opt);
/*class Services {
    constructor() {
        this.mysql = mysql;
        this.opt = opt;
        this.conn;
    };

    connMysql() {
        this.conn = mysql.createConnection(opt);
        this.conn.connect(err => {
            err ? console.log(err) : console.log('数据库链接成功');
        });
    }

    endMysql() {
        this.conn.end(err => {
            err ? console.log(err) : console.log('数据库释放成功');
        });
    }
}*/

class Services {
    query(sql, params, callback) {
        pool.getConnection((err, conn) => {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, params, (err, data, fields) => {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(err, data, fields);
                })
            }
        })
    }
}

module.exports = Services;