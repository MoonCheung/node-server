/*
 * @Description: mongoose模型
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-04-12 18:17:53
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-02-03 11:52:41
 */

const autoIncrement = require("mongoose-auto-increment");
const envMap = require('../config/env.config');
const mongoose = require("mongoose");
const chalk = require("chalk");
const CONFIG = require("../config");
const success = chalk.bold.blue;
const error = chalk.bold.red;

const db = mongoose.createConnection(`${CONFIG.mongodb.url}`, envMap);

autoIncrement.initialize(db);

db.once("open", () => {
  console.log(success("数据库连接成功!"));
});

db.once("error", () => {
  console.log(error("数据库连接失败!"));
});

module.exports = db;