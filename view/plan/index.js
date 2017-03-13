/**
 * Created by duoyi on 2017/3/8.
 */
const plan = require('../../controler/plan')
const APIError = require('../../middleware/rest').APIError

const get = async(ctx, next) => {
  let result
  await plan.getData().then((ret) => {
    result = ret
  })
  ctx.rest(result)
}

const set = async(ctx, next) => {
  let params = {
    id: ctx.request.body.id || 0,
    content: ctx.request.body.content,
    note: ctx.request.body.note
  }
  let result = ''
  if ((!params.content) || (!params.note)) {
    throw new APIError('params:params_not_found', '请传入参数')
  } else {
    await plan.setData(params).then(() => {
      result = '更新成功'
    })
    ctx.rest({
      code: 0,
      data: result
    })
  }
}

const del = async(ctx, next) => {
  let id = ctx.request.body.id || null
  let result = ''
  if (id) {
    await plan.delData(id).then(() => {
      result = '删除成功'
    })
  } else {
    throw new APIError('params:params_not_found', '请传入参数')
  }
  ctx.rest(result)
}
module.exports = {
  get,
  set,
  del
}
