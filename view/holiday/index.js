/**
 * Created by kimmy on 2017/3/11.
 */

const common = require('../../until')
const fs = require('fs')
const path = require('path')

const getMsg = async(ctx, next) => {
  const today = common.formatDate(new Date(), 'yyyy/MM/dd')
  let result = `今天是${today}`
  let readFile = new Promise((resolve) => {
    fs.readFile(path.resolve(__dirname, './holiday.json'), (err, data) => {
      if (err) throw err
      const arr = JSON.parse(data)
      if (arr[today]) {
        result = `今天是${today}, 是${arr[today]}`
      }
      resolve()
    })
  })
  await readFile
  ctx.rest({
    code: 0,
    data: result
  })
}

module.exports = {
  getMsg
}
