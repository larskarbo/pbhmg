
module.exports = function AjaxLoginControllerModule(pb){

    //dependencies
    var util               = pb.util;
    var FormController     = pb.FormController;
    var FormAuthentication = pb.FormAuthentication;

    function AjaxLoginController() {};
    util.inherits(AjaxLoginController, FormController);

    AjaxLoginController.prototype.onPostParamsRetrieved = function(params, cb){
        var self = this;

        pb.security.authenticateSession(this.session, params, new FormAuthentication(), function(err, user) {
            if(util.isError(err) || user === null)  {
                cb({content: err, code: 400});
                return;
            }

            cb({content: user});
        });
    }

    AjaxLoginController.getRoutes = function(cb) {
        var routes = [
            {
                method: 'post',
                path: "/logg-inn",
                content_type: 'application/json'
            }
        ]

        cb(null, routes);
    }

    return AjaxLoginController;
}
