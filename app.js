const Koa = require('koa')
const app = new Koa()
const onerror = require('koa-onerror')
const cors = require('@koa/cors')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
//导入config配置
const CONFIG = require('./config')
//导入api接口
const api = require('./routes/api')

//测试mongoose数据库插入是否成功
// const category = require('./models/category')

// console.log(new category({
//   categoryname: '生活日记',
//   categorydesc: '感想一些生活以及旅行',
//   cdate: 1557567614068,
// }))

onerror(app);


app.keys = ['some secret'];
app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge
}, app))

app.use(logger())
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
  onerror: function (err, ctx) {
    ctx.throw('body解析错误:', err);
  }
}));
app.use(json())
//CORS跨域请求配置
app.use(cors());
//router
app.use(api.routes(), api.allowedMethods());

if (!module.parent) {
  app.listen(CONFIG.port, console.log(`server is running at http://localhost:${CONFIG.port}`))
}