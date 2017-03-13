/**
 * Created by duoyi on 2017/3/8.
 */
const fs = require('fs')
const path = require('path')
const init = async(ctx, next) => {
  fs.readFile(path.resolve(__dirname, '../../WEB/dist/index.html'), 'binary', function (err, file) {
    if (err) {
      ctx.response.end(err)
    } else {
      console.log('hello', file)
      ctx.response.write(file, 'binary')
      ctx.response.end()
    }
  })
}

module.exports = {
  init
}
