
//dependencies
var path = require('path');
var async = require('async');

module.exports = function THEBEST_AdminIndexControllerModule(pb) {

    //pb dependencies
    var util            = pb.util;
    var SecurityService = pb.SecurityService;

    /**
    * Interface for the admin dashboard
    * @class AdminIndexController
    * @constructor
    */
    function AdminIndexController(){}
    util.inherits(AdminIndexController, pb.BaseAdminController);

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
            if (util.isError(err)) {
                //throw err;
            }
            self.setPageName(self.localizationService.get('DASHBOARD'));
            self.renderNav(['dashboard'], function(err,nav){
                self.ts.registerLocal('navigation', new pb.TemplateValue(nav, false));
                self.ts.registerLocal('user', self.session.authentication.user.first_name + ' ' + self.session.authentication.user.last_name);
                self.ts.load(path.join('admin/indexX'), function(error, result) {
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
        var tasks = {

            //article count
            articleCount: function(callback) {
                self.siteQueryService.count('article', pb.DAO.ANYWHERE, callback);
            },

            //page count
            pageCount: function(callback) {
                self.siteQueryService.count('page', pb.DAO.ANYWHERE, callback);
            },

            //cluster status
            clusterStatus: function(callback) {
                var service = pb.ServerRegistration.getInstance();
                service.getClusterStatus(function(err, cluster) {
                    callback(err, cluster);
                });
            }
        };
        async.parallel(tasks, cb);
    };

    AdminIndexController.prototype.renderNav = function(active, cb){
        var self = this;

		// <li class="col-sm-2">
		// 	<a href="config">
		// 		<i class="fa fa-calendar"></i>
		// 		Kalender
		// 	</a>
		// </li>

        var source = pb.AdminNavigation.get(self.session, active, self.localizationService, self.site);
        var nav = "";
        // var isAdmin = self.session.authentication.admin_level;

        for (var i = 0; i < source.length; i++) {
            var element = source[i];
            if(false || /*self.session.authentication.user.first_name != 'Test' &&*/ !element.easyAdmin){
                continue;
            }

            if(element.id == 'epost'){
                var target = '_blank';
            }else{
                var target = '';
            }

            if(element.active == 'active'){
                var liClass = ' class="active"'
            }else{
                var liClass = '';
            }

            nav += '<li' + liClass + '>';
            nav += '<a href="'+element.href+'" target="' + target + '">';
            nav += '<i class="fa fa-' + element.icon + '"></i> ';
            nav += element.title;
            nav += '</a>';

            if(typeof element.children != 'undefined'){
                nav += '<ul>';
                    for (var p = 0; p < element.children.length; p++){
                        var e = element.children[p];

                        nav += '<li>';
                        nav += '<a href="'+e.href+'">';
                        nav += e.title;
                        nav += '</a></li>';
                    }
                nav += '</ul>';
            }

            nav += '</li>';
        }

        cb(null, nav);
    }

    AdminIndexController.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/adminx",
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
