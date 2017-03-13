/**
 * Created by duoyi on 2017/3/8.
 */
const user = require('../../controler/user')
const APIError = require('../../middleware/rest').APIError

const get = async(ctx, next) => {
  let data = {}
  await user.getUser().then((ret) => {
    data = ret
  })
  ctx.rest(data)
}

const set = async(ctx, next) => {
  let result = ''
  let params = {
    id: 1,
    name: ctx.request.body.name
  }
  if (!params.name) {
    throw new APIError('params:not_found', '请传入姓名')
  } else {
    await user.setName(params).then(() => {
      result = '更新成功'
    })
    ctx.rest(result)
  }
}

module.exports = {
  get,
  set
}
