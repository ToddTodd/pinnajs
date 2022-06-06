'use strict';
const assert = require('assert');
const _ = require('lodash');

const KoaRouter = require('@koa/router');

/**
 * route.js为默认路由文件，先加载
 * 解析controller,如果有相同的path，不注册
 */
class RouterLoader extends KoaRouter {
    constructor(app, baseDir, controllers) {
        super();

        this.app = app;
        this.baseDir = baseDir;

        this.controllers = controllers || [];
        assert(this.app, 'app is required');
    }



    loadRouter() {

        // console.log(this.app)
        // const controllerRouter = this.resolveRouterFromController();
        // console.log(controllerRouter)

        // this.get(`/api/admin/v1/Test/:id`, (ctx) => {
        //     ctx.body = '测试覆盖'
        // });


        // Object.keys(this.controllers).map(m => {
        //     for (const controller of this.controllers[m]) {
        //         const { filepath, module, propertyName, exports, className, Controller } = controller;

        //         const prefix = this.app.config.routerPrefix ? this.app.config.routerPrefix[module] : `api/${module}/v1`;


        //         Object.keys(exports).forEach(key => {

        //             switch (key) {
        //                 case 'create':
        //                     this.post(`/${prefix}/${className}`, exports[key]);
        //                     break;
        //                 case 'update':
        //                     this.put(`/${prefix}/${className}/:id`, exports[key]);
        //                     break;
        //                 case 'show':
        //                     const a = _.find(this.stack, (o)=>{
        //                         return o.match(`/${prefix}/${className}/:id`)
        //                     });
        //                     if(!a){
        //                         this.get(`/${prefix}/${className}/:id`, exports[key]);
        //                     }
        //                     break;
        //                 case 'list':
        //                     this.get(`/${prefix}/${className}`, async (ctx, next) => {
        //                         ctx.body = 'hello';
        //                         await next();
        //                         console.log('333333333')

        //                     });
        //                     break;
        //                 case 'delete':
        //                     this.delete(`${className}`, exports[key]);
        //                     break;
        //                 default:
        //             }
        //         });


        //     }
        // });

        // console.log('-----------------');
        // console.log(this.stack)

    }

    resolveRouterFromController() {
        const items = {};

        Object.keys(this.controllers).map(m => {
            for (const controller of this.controllers[m]) {
                const { filepath, module, propertyName, exports, className, Controller } = controller;

                const prefix = this.app.config.routerPrefix ? this.app.config.routerPrefix[module] : `api/${module}/v1`;

                items[m] = { type: 'Controller' };
                Object.keys(exports).forEach(key => {
                    switch (key) {
                        case 'create':
                            items[m]['create'] = { method: 'POST', endpoint: `/${prefix}/${className}`, fn: exports[key], filepath, propertyName };
                            break;
                        case 'update':
                            items[m]['update'] = { method: 'PUT', endpoint: `/${prefix}/${className}/:id`, fn: exports[key], filepath, propertyName };
                            break;
                        case 'show':
                            items[m]['show'] = { method: 'GET', endpoint: `/${prefix}/${className}/:id`, fn: exports[key], filepath, propertyName };
                            break;
                        case 'list':
                            items[m]['show'] = { method: 'GET', endpoint: `/${prefix}/${className}`, fn: exports[key], filepath, propertyName };
                            break;
                        case 'delete':
                            items[m]['show'] = { method: 'DELETE', endpoint: `/${prefix}/${className}/:id`, fn: exports[key], filepath, propertyName };
                            break;
                        default:
                    }
                });
            }
        });
        return items;
    }

    loadRouterFromFile() {
        const modules = fs.readdirSync(this.baseDir);
        for (const module of modules) {
            const routePath = path.join(this.baseDir, module, 'route.js');
            let exports = utils.loadFile(routePath);
        }
    }
}

module.exports = RouterLoader;