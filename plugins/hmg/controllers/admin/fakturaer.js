
//dependencies
var path = require('path');
var async = require('async');

module.exports = function fakturaer_AdminIndexControllerModule(pb) {

    //pb dependencies
    var util            = pb.util;
    var SecurityService = pb.SecurityService;
    var Index = require('./index.js')(pb);

    /**
    * Interface for the admin dashboard
    * @class AdminIndexController
    * @constructor
    */
    function AdminIndexController(){}
    util.inherits(AdminIndexController, Index);

    /**
    *
    * @method onSiteValidated
    * @param site
    * @param cb
    *
    */
    AdminIndexController.prototype.render = function (cb) {
        var self = this;

        //gather all the data
        this.gatherData(function(err, data) {
            var service = new pb.CustomObjectService(self.site, true);
            service.loadTypeById('571b6cabd7fba45140ad278d', function(err, custObjType) {
                console.log(JSON.stringify(custObjType,null,2));
                service.findByTypeWithOrdering(custObjType, function(err, customObjects) {

                    var angularObjects = pb.ClientJs.getAngularObjects(
                    {
                        fakturaer: customObjects
                    });

                    if (util.isError(err)) {
                        //throw err;
                    }
                    self.setPageName('Fakturaer');

                    self.renderNav(['fakturaer'],function(err,nav){
                        self.ts.registerLocal('angular_objects', new pb.TemplateValue(angularObjects, false));
                        self.ts.registerLocal('navigation', new pb.TemplateValue(nav, false));
                        self.ts.load(path.join('admin/fakturaer'), function(error, result) {
                            cb({content: result});
                        });
                    })
                })
            });
        });
    };

    /**
    * Gather all necessary data for rendering the dashboard.
    * <ul>
    * <li>Article count</li>
    * <li>Page Count</li>
    * <li>Cluster Status</li>
    * </ul>
    * @method gatherData
    * @param {Function} cb A callback that provides two parameters: cb(Error, Object)
    */
    AdminIndexController.prototype.gatherData = function(cb) {
        var self = this;
        var tasks = {
        };
        async.parallel(tasks, cb);
    };


    AdminIndexController.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/admin/fakturaer",
                content_type: 'text/html'
                // ,
                // access_level: pb.SecurityService.ACCESS_WRITER,
                // auth_required: true
            }
        ]

        cb(null, routes);
    }

    //exports
    return AdminIndexController;
};
