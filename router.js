/**
 * Created by duoyi on 2017/3/8.
 */
const plan = require('./view/plan')

module.exports = (router) => {
  router.get('/getPlan', plan.get)
  router.post('/setPlan', plan.set)
  router.post('/delPlan', plan.del)
}
