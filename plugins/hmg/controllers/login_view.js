
//dependencies
var path = require('path');


module.exports = function moduleManYoloCakethiswordmeansnothing(pb){

    //PB dependencies
    var util           = pb.util;
    var PluginService  = pb.PluginService;
    var TopMenuService = pb.TopMenuService;

    function SuperController(){};
    util.inherits(SuperController, pb.BaseController);


    SuperController.prototype.renderNow = function(cb){
        var self = this;

        self.setPageName('Logg inn')

        self.ts.load(path.join('admin','login'), function(err, template){

            if (util.isError(err)) {
                //when an error occurs it is possible to hand back off to the
                //RequestHandler to serve the error.
                self.reqHandler.serveError(err);
            }

            cb({
                content: template
            })

        })
    }

    SuperController.prototype.redirectToHomePage = function(cb) {
        this.redirect('/', cb);
    };

    SuperController.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/admin/login",
                content_type: 'text/html',
                handler: "renderNow"
            },
            {
                method: 'get',
                path: '/yo/redirect/home',
                handler: 'redirectToHomePage'
            }
        ]

        cb(null, routes);
    }

    return SuperController;
}
