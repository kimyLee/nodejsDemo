/**
 * Created by duoyi on 2017/3/8.
 */

const test = async(ctx, next) => {
  console.log(ctx, ctx.request.url)
  ctx.status = 200
  ctx.body = {
    success: true,
    data: {
      hello: 'word'
    }
  }
  await next()
}

module.exports = {
  test
}
