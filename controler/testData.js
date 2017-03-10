/**
 * Created by duoyi on 2017/3/8.
 */
// const mysql = require('mysql')
const db = require('./index')

const getData = function () {
  return new Promise(function (resolve) {
    db.role.findAll().then((ret) => {
      resolve(ret.map(function (e) {
        return e.get({plain: true})
      }))
    })
  })
}

module.exports = {
  getData
}
