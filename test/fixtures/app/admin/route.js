'use strict';

module.exports = (router, Controller) => {
    router.prefix = '/api/admin/v1';
    // router.get('/test',Controller.TestAdmin.list);
    router.resources(Controller.TestAdmin);
}