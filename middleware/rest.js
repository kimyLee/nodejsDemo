/**
 * Created by kimmy on 2017/3/11.
 */
module.exports = {
  APIError: function (code, msg) {
    this.code = code || 'internal:unknown_error'
    this.msg = msg || ''
  },
  restify: () => {
    return async(ctx, next) => {
      ctx.rest = (data) => {
        ctx.response.type = 'application/json'
        ctx.response.body = data
      }
      try {
        await next()
      } catch (e) {
        // 返回错误:
        ctx.response.status = 400
        ctx.response.type = 'application/json'
        ctx.response.body = {
          code: e.code || 'internal:unknown_error',
          msg: e.msg || ''
        }
      }
    }
  }
}
