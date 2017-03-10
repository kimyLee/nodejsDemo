/**
 * Created by duoyi on 2017/3/8.
 */
const plan = require('../../controler/plan')

const get = async(ctx, next) => {
  let result
  await plan.getData().then((ret) => {
    result = ret
  })
  ctx.response.type = 'application/json'
  ctx.response.body = {
    code: 0,
    data: result
  }
}

const set = async(ctx, next) => {
  let params = {
    id: ctx.request.body.id || 0,
    content: ctx.request.body.content,
    note: ctx.request.body.note
  }
  let result = ''
  console.log(params.id, params.content)
  await plan.setData(params).then(() => {
    result = '更新成功'
  })
  ctx.response.type = 'application/json'
  ctx.response.body = {data: result}
}

const del = async(ctx, next) => {
  let id = ctx.request.body.id || null
  let result = ''
  if (id) {
    await plan.delData(id).then(() => {
      result = '删除成功'
    })
  } else {
    result = '请传入参数'
  }
  ctx.response.type = 'application/json'
  ctx.response.body = {data: result}
}
module.exports = {
  get,
  set,
  del
}
