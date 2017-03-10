/**
 * Created by duoyi on 2017/3/8.
 */
const testData = require('../../controler/testData')

const loginPage = async(ctx, next) => {
  // 获取处理数据，中间层考虑
  await testData.getData().then((ret) => {
    var a = JSON.stringify(ret)
    ctx.response.body = `<h1>${a}</h1>
     <form action="/signin" method="post">
        <p>Name: <input name="name" value="koa"></p>
          <p>Password: <input name="password" type="password"></p>
          <p><input type="submit" value="Submit"></p>
     </form>`
  })
}

const signIn = async(ctx, next) => {
  var name = ctx.request.body.name || ''
  var password = ctx.request.body.password || ''
  console.log(`signin with name: ${name}, password: ${password}`)
  if (name === 'koa' && password === '12345') {
    ctx.response.body = `<h1>Welcome, ${name}!</h1>`
  } else {
    ctx.response.body = `<h1>Login failed!</h1>
    <p><a href="/">Try again</a></p>`
  }
}

module.exports = {
  loginPage,
  signIn
}
