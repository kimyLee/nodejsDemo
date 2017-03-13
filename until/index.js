/**
 * Created by kimmy on 2017/3/11.
 */
module.exports = {
  // 数据库获取数据过滤
  filter (arr) {
    return arr.map(function (e) {
      return e.get({plain: true})
    })
  },
  // 日期格式化
  formatDate (target, fmt) {
    const o = {
      'M+': target.getMonth() + 1,
      'd+': target.getDate(),
      'h+': target.getHours(),
      'm+': target.getMinutes(),
      's+': target.getSeconds(),
      'q+': Math.floor((target.getMonth() + 3) / 3),
      'S': target.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (target.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}
