
//dependencies
var path = require('path');
var async = require('async');

module.exports = function THEBEST_AdminIndexControllerModule(pb) {

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
            console.log(JSON.stringify(data,null,2));
            if (util.isError(err)) {
                //throw err;
            }
            self.setPageName(self.localizationService.get('PAGES'));

            self.renderNav(['sider'],function(err,nav){
                //self.createTable()
                self.ts.registerLocal('navigation', new pb.TemplateValue(nav, false));
                self.ts.registerLocal('pagesList', new pb.TemplateValue(nav, false));
                self.ts.load(path.join('admin/sider'), function(error, result) {
                    cb({content: result});
                });
            })
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
        var pageService = new pb.PageService()
        var tasks = {
            pagesList: function(callback) {
                pageService.getAll(callback);
            }
        };
        async.parallel(tasks, cb);
    };


    AdminIndexController.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/admin/sider",
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
