const Koa = require('koa');


const path = require('path');
const assert = require('assert');

const Controller =require('../../src/core/loader/Controller');
const Router = require('../../src/core/loader/Router');

const app1 = {
    config:{}
}
const baseDir = path.join(__dirname,'../fixtures/app');

const controller = new Controller(app1,baseDir);
const controllers = controller.load()

const router = new Router(app1,baseDir);
router.load();

const app = new Koa();

app.use(router.routes())
app.use(router.allowedMethods({}));

app.listen(3000,()=>console.log('start...'))