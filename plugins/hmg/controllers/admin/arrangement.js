
//dependencies
var path = require('path');
var async = require('async');

module.exports = function THEBEST_AdminIndexControllerModule(pb) {

    //pb dependencies
    var util            = pb.util;
    var SecurityService = pb.SecurityService;
    var Index = require('./index.js')(pb);

    function AdminIndexController(){}
    util.inherits(AdminIndexController, Index);


    AdminIndexController.prototype.render = function (cb) {
        var self = this;

        //gather all the data
        this.gatherData(function(err, data) {
            console.log(JSON.stringify(data,null,2));
            if (util.isError(err)) {
                //throw err;
            }
            self.setPageName('Arrangement');

            self.renderNav(['arrangement'],function(err,nav){
                //self.createTable()
                self.ts.registerLocal('navigation', new pb.TemplateValue(nav, false));
                self.ts.load(path.join('admin/arrangement'), function(error, result) {
                    cb({content: result});
                });
            })
        });
    };

    AdminIndexController.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/admin/arrangement",
                content_type: 'text/html',
                access_level: pb.SecurityService.ACCESS_WRITER,
                auth_required: true
            }
        ]

        cb(null, routes);
    }

    //exports
    return AdminIndexController;
};
