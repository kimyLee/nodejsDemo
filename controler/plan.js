
const db = require('./index')
// 中间数据转换器
const getData = function () {
  return new Promise(function (resolve) {
    db.plan.findAll().then((ret) => {
      resolve(ret.map(function (e) {
        return e.get({plain: true})
      }))
    })
  })
}
const setData = function (data) {
  return new Promise(function (resolve) {
    db.plan.upsert(data).then(() => {
      resolve()
    })
  })
}
const delData = function (id) {
  return new Promise(function (resolve) {
    db.plan.destroy({where: {id: id}}).then(() => {
      resolve()
    })
  })
}

module.exports = {
  getData,
  setData,
  delData
}
