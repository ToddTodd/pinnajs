const BaseController = require('../../../../../index').BaseController;

class A extends BaseController{

    async list(){
        console.log('11111111111111')
        console.log(this.ctx)
        this.ctx.body='11111111'
        console.log('222222222222')
    }

}

module.exports = A;

