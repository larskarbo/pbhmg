
//dependencies
var path = require('path');
var async = require('async');

var fs = require('fs');


var mysql = require('mysql');
var Sequelize = require('sequelize');



module.exports = function fakturaer_AdminIndexControllerModule(pb) {

    //pb dependencies
    var util            = pb.util;
    var SecurityService = pb.SecurityService;
    var Index = require('../../hmg/controllers/admin/index.js')(pb);

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
        this.getFeedback(function(err, feedback) {
            var angularObjects = pb.ClientJs.getAngularObjects({
                feedback: feedback
            });

            if (util.isError(err)) {
                //throw err;
            }
            self.setPageName('Feedback');

            self.renderNav(['feedback'],function(err,nav){
                self.ts.registerLocal('angular_objects', new pb.TemplateValue(angularObjects, false));
                self.ts.registerLocal('navigation', new pb.TemplateValue(nav, false));
                self.ts.load(path.join('feedback'), function(error, result) {
                    cb({content: result});
                });
            })
        })
    };


    AdminIndexController.prototype.getFeedback = function(cb) {

        var configFile = fs.readFileSync(__dirname + '../../../mysql.json');
        var config = JSON.parse(configFile);
        var credentials = config.mysql;

        var sequelize = new Sequelize(credentials.database, credentials.user, credentials.password, {
            host: credentials.host,
            port: credentials.port,
            dialect: 'mysql',
            define: {
                freezeTableName: true
            }
        });

        var feedbackmodel = sequelize.import('../models/feedback');

        feedbackmodel.findAll().then(function(result){
            console.log(JSON.stringify(result,null,2));

            // result.forEach(function(v,i){
            //     result[i].timestamp = result[i].timestamp.substring(0,10)
            // })

            cb(null, result)
        })

    }


    AdminIndexController.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/feedback",
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
