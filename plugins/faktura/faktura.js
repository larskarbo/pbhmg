
module.exports = function ArrModule(pb) {


    var util = pb.util;
    /**
    * Faktura - A Faktura site theme for PencilBlue
    *
    * @author Blake Callens <blake@pencilblue.org>
    * @copyright 2014 PencilBlue, LLC
    */
    function Faktura(){}

    /**
    * Called when the application is being installed for the first time.
    *
    * @param cb A callback that must be called upon completion.  cb(err, result).
    * The result is ignored
    */
    Faktura.onInstall = function(cb) {
        var self = this;
        var cos = new pb.CustomObjectService();
        console.log("installing this");
        cos.loadTypeByName('faktura', function(err, fant){
            if (util.isError(err) || fant) {
                return cb(err, !util.isError(err));
            }

            var values = {
                name: 'faktura',
                fields: {
                    id:{
                        field_type:'number',

                    },
                    name:{
                        field_type:'text',
                        required: true
                    },
                    title:{
                        field_type: 'text',
                        required: true
                    },
                    description:{
                        field_type: 'text',
                        required: true
                    },
                    date:{
                        field_type: 'date',
                        required: true
                    },
                    tripDate:{
                        field_type: 'date',
                        required: true
                    },
                    amount:{
                        field_type: 'number',
                        required: true
                    },
                    paid:{
                        field_type: 'boolean'
                    },
                    chargeId:{
                        field_type: 'text'
                    },
                    deleted:{
                        field_type: 'boolean'
                    }
                }
            }

            cos.saveType(values, function(err, result){
                console.log(err, result);
                cb(err, !util.isError(err));
            })

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
    Faktura.onUninstall = function(cb) {
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
    Faktura.onStartup = function(cb) {

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

    Faktura.onStartupWithContext = function(context, cb){

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
    Faktura.onShutdown = function(cb) {
        cb(null, true);
    };

    //exports
    return Faktura;
};
