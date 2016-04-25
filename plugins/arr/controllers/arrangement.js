
//dependencies
var path = require('path');
var async = require('async');


module.exports = function ArrangementControllerModule(pb){

    //PB dependencies
    var util = pb.util;
    var ArticleService = pb.ArticleServiceV2;
    var Index = require('../../hmg/controllers/index.js')(pb);

    function ArrangementController(){};
    util.inherits(ArrangementController, Index);


    ArrangementController.prototype.render = function(cb){
        var self = this;

        var contentService = new pb.ContentService({site: self.site, onlyThisSite: true});
        contentService.getSettings(function(err, contentSettings) {
            self.gatherData(function(err, data) {
                self.getArrangements(function(err, arrangements){
                    console.log(arrangements);
                    self.setPageName('Arrangement')
                    self.ts.registerLocal('navigation', new pb.TemplateValue(data.nav.navigation, false));

                    self.ts.registerLocal('articles', function(flag, cb) {
                        var tasks = util.getTasks(arrangements, function(content, i) {
                            return function(callback) {
                                if (i >= contentSettings.articles_per_page) {//TODO, limit articles in query, not through hackery
                                    callback(null, '');
                                    return;
                                }
                                self.renderContent(content[i], contentSettings, data.nav.themeSettings, i, callback);
                            };
                        });
                        async.parallel(tasks, function(err, result) {
                            cb(err, new pb.TemplateValue(result.join(''), false));
                        });
                    });

                    self.ts.load('arrangement', function(err, template){

                        if (util.isError(err)) {
                            //when an error occurs it is possible to hand back off to the
                            //RequestHandler to serve the error.
                            self.reqHandler.serveError(err);
                        }

                        cb({
                            content: template
                        })

                    })
                })
            });
        })
    }

    ArrangementController.prototype.getArrangements = function(cb){
        var topic = '57138638e9d3215e7f742077'; // topic='arr'
        var articleService = new ArticleService();
        articleService.getAll({
            where: {
                //focus_keyword: 'arrangement'
                meta_keywords: {$in: ['570f5e0278af7e8f1d763e8f']}
            }
        },cb)
    }
    ArrangementController.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/arrangement",
                content_type: 'text/html'
            }
        ]

        cb(null, routes);
    }

    return ArrangementController;
}
