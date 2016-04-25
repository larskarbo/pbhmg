
//dependencies
var path = require('path');
var async = require('async');


module.exports = function NewArrModule(pb){

    //PB dependencies
    var util = pb.util;
    var ArticleService = pb.ArticleServiceV2;
    var CustomObjectService = pb.CustomObjectService;
    var Index = require('../../../hmg/controllers/admin/index.js')(pb);

    function NewArr(){};
    util.inherits(NewArr, Index);


    NewArr.prototype.render = function(cb){
        var self = this;
        var vars = this.pathVars;
        this.vars = vars;
        self.setPageName('Legg til arrangement')

        self.gatherData(vars, function(err, data) {
            console.log(data);



            self.renderNav(function(err,nav){
                self.ts.registerLocal('navigation', new pb.TemplateValue(nav, false));

                self.ts.load(path.join('admin','content','arrangements','arr_form'), function(err, template){

                    if (util.isError(err)) {
                        self.reqHandler.serveError(err);
                    }
                    cb({
                        content: template
                    })

                });
            })

        });
    };

    NewArr.prototype.gatherData = function(vars, cb) {
        var self  = this;
        var tasks = {
            templates: function(callback) {
                callback(null, pb.TemplateService.getAvailableContentTemplates(self.site));
            },

            sections: function(callback) {
                var opts = {
                    select: pb.DAO.PROJECT_ALL,
                    where: {
                        type: {$in: ['container', 'section']}
                    },
                    order: {name: pb.DAO.ASC}
                };
                self.siteQueryService.q('section', opts, callback);
            },

            topics: function(callback) {
                var opts = {
                    select: pb.DAO.PROJECT_ALL,
                    where: pb.DAO.ANYWHERE,
                    order: {name: pb.DAO.ASC}
                };
                self.siteQueryService.q('topic', opts, callback);
            },

            media: function(callback) {
                var mservice = new pb.MediaService(null, self.site, true);
                mservice.get(callback);
            },

            article: function(callback) {
                if(!pb.validation.isIdStr(vars.id, true)) {
                    return callback(null, {});
                }

                //TODO call article service
                self.siteQueryService.loadById(vars.id, 'article', callback);
            }
        };
        async.parallelLimit(tasks, 2, cb);
    };

    NewArr.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/admin/arrangement",
                content_type: 'text/html'
            }
        ]

        cb(null, routes);
    }

    return NewArr;
}
