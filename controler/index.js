/**
 * Created by duoyi on 2017/3/8.
 */
'use strict'

const Sequelize = require('sequelize')
const path = require('path')
const fs = require('fs')
const db = {}

var sequelize = new Sequelize('test', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
})

fs
  .readdirSync(path.resolve(__dirname, '../model'))
  .map(function (file) {
    let model = sequelize.import(path.join(path.resolve(__dirname, '../model'), file))
    db[model.name] = model
  })

module.exports = Object.assign({sequelize: sequelize, Sequelize: Sequelize}, db)
