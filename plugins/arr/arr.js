
module.exports = function ArrModule(pb) {

    /**
    * Hmg - A Hmg site theme for PencilBlue
    *
    * @author Blake Callens <blake@pencilblue.org>
    * @copyright 2014 PencilBlue, LLC
    */
    function Hmg(){}

    /**
    * Called when the application is being installed for the first time.
    *
    * @param cb A callback that must be called upon completion.  cb(err, result).
    * The result is ignored
    */
    Hmg.onInstall = function(cb) {
        cb(null, true);
        var self = this;
        var cos = new pb.CustomObjectService();

        cos.loadTypeByName('arrangement', function(err, fant){
            if(!fant){
                var values = {
                    name: 'arrangement',
                    fields: {
                        name: {field_type:'text'},
                        description: {field_type:'wysiwyg'},
                        yolo: {field_type:'text'},
                        dateStart: {field_type:'date'},
                        dateEnd: {field_type:'date'},
                        places: {field_type:'number'},
                        taken: {field_type:'number'},
                        article: {field_type:'peer_object', object_type:'article'}
                    }
                }

                cos.saveType(values, function(err, result){
                    cb(null, true);
                })
            }else{
                cb(null, true)
            }
        })
    };

    /**
    * Called when the application is uninstalling this plugin.  The plugin should
    * make every effort to clean up any plugin-specific DB items or any in function
    * overrides it makes.
    *
    * @param cb A callback that must be called upon completion.  cb(err, result).
    * The result is ignored
    */
    Hmg.onUninstall = function(cb) {
        cb(null, true);
    };

    /**
    * Called when the application is starting up. The function is also called at
    * the end of a successful install. It is guaranteed that all core PB services
    * will be available including access to the core DB.
    *
    * @param cb A callback that must be called upon completion.  cb(err, result).
    * The result is ignored
    */
    Hmg.onStartup = function(cb) {

        //setup for custom fields on page objects (arrangement)
        pb.BaseObjectService.on('article' + '.' + pb.BaseObjectService.FORMAT, function(context, cb) {
            var dto = context.data;
            console.log("######", dto.arrangement);
            dto.arrangement = pb.BaseObjectService.sanitize(dto.arrangement);
            cb(null);
        });

        pb.BaseObjectService.on('article' + '.' + pb.BaseObjectService.MERGE, function(context, cb) {
            var dto = context.data;
            var obj = context.object;

            obj.arrangement = dto.arrangement;

            cb(null);
        });
        pb.BaseObjectService.on('article' + '.' + pb.BaseObjectService.VALIDATE, function(context, cb) {
            var obj = context.data;
            var errors = context.validationErrors;

            if (!pb.ValidationService.isStr(obj.arrangement, false)) {
                errors.push(pb.BaseObjectService.validationFailure('arrangement', 'Arrangement must be a valid URL or media path'));
            }

            cb(null);
        });

        cb(null, true);
    };

    Hmg.onStartupWithContext = function(context, cb){

        var site = pb.SiteService.getCurrentSite(context.site);
        // Add a new top level node
        

        cb(null, true);
    }

    /**
    * Called when the application is gracefully shutting down.  No guarantees are
    * provided for how much time will be provided the plugin to shut down.
    *
    * @param cb A callback that must be called upon completion.  cb(err, result).
    * The result is ignored
    */
    Hmg.onShutdown = function(cb) {
        cb(null, true);
    };

    //exports
    return Hmg;
};
