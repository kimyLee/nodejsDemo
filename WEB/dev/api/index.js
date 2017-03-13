/**
 * Created by kimmy on 2017/3/11.
 */
$(function () {
   window.api = {
     domain: 'http://localhost:3000',
     send: function (type, url, data, cb) {
       $.ajax({
         type: type,
         url: url,
         dataType: 'json',
         data: data
       })
         .done(function (res) {
           cb && cb(res)
         })
         .fail(function () {
           alert('网络错误')
         })
     },
     getName: function (cb) {
       this.send('GET', this.domain+'/getName', {}, cb)
     },
     setName: function (name, cb) {
       this.send('POST', this.domain+'/setName', {name: name}, cb)
     }
   }
})