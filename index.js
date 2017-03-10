/**
 * Created by duoyi on 2017/3/8.
 */
const Koa = require('koa')
// 处理URL
const router = require('koa-router')()

// api编写
const START = require('./router')
// 处理返回参数体
const bodyParser = require('koa-bodyparser')

const app = new Koa()
app.use(bodyParser())

START(router)

app.use(router.routes())
app.listen(3000)

console.log('app started at port 3000...')
