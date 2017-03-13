/**
 * Created by duoyi on 2017/3/8.
 */
const plan = require('./view/plan')
const user = require('./view/userInfo')
const holiday = require('./view/holiday')

module.exports = (router) => {
  // 日程
  router.get('/getPlan', plan.get)
  router.post('/setPlan', plan.set)
  router.post('/delPlan', plan.del)
  // 用户名
  router.get('/getName', user.get)
  router.post('/setName', user.set)
  // 放假日期
  router.get('/getHoliday', holiday.getMsg)
}
