const koa = require('koa')
const _ = require('koa-route')
const app = koa()
const cst = require('cst')

// silently fails for unrecognized things like es7 features and flow
const parser = new cst.Parser()

const serialize = (nodes) => nodes.map(node => ({
  value: node.value,
  loc: node.getLoc()
}))

const bodyParser = require('koa-bodyparser')
app.use(bodyParser({
  enableTypes: ['json', 'text']
}))

app.use(_.post('/parse', function * () {
  this.accepts('text')
  try {
    const tree = parser.parse(this.request.body)
    this.body = serialize(tree.selectTokensByType('Identifier'))
  } catch (err) {
    this.status = 400
    this.body = 'yoyoyo'
  }
}))

app.listen(3000)
console.log('listening on port 3000')
