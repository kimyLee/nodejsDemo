/**
 * Created by kimmy on 2017/3/11.
 */

const db = require('./index')
const common = require('../until')
// 中间数据转换器
const getUser = function () {
  return new Promise(function (resolve) {
    db.user.findAll().then((ret) => {
      const res = common.filter(ret)
      resolve(res.length ? res[0] : '')
    })
  })
}
const setName = function (data) {
  return new Promise(function (resolve) {
    db.user.upsert(data).then(() => {
      resolve()
    })
  })
}

module.exports = {
  getUser,
  setName
}
