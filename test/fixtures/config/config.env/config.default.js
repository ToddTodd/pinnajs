'use strict'
module.exports = (app)=>{
   
    return {
        name: app.appName,
        foo:'a',
        bar:{
            a:'a1',
            b:'b1'
        }
    }
}