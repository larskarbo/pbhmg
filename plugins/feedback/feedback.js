
module.exports = function FeedbackModule(pb) {

    /**
    * Feedback - A Feedback site theme for PencilBlue
    *
    * @author Blake Callens <blake@pencilblue.org>
    * @copyright 2014 PencilBlue, LLC
    */
    function Feedback(){}

    /**
    * Called when the application is being installed for the first time.
    *
    * @param cb A callback that must be called upon completion.  cb(err, result).
    * The result is ignored
    */
    Feedback.onInstall = function(cb) {
        cb(null, true);
    };

    /**
    * Called when the application is uninstalling this plugin.  The plugin should
    * make every effort to clean up any plugin-specific DB items or any in function
    * overrides it makes.
    *
    * @param cb A callback that must be called upon completion.  cb(err, result).
    * The result is ignored
    */
    Feedback.onUninstall = function(cb) {
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
    Feedback.onStartupWithContext = function(context, cb) {

        var navItems = [
            {
                id: "feedback",
                title: "Feedback",
                icon: "dot-circle-o",
                href: "/feedback"
            }
        ]

        var site = pb.SiteService.getCurrentSite(context.site);
        // Add a new top level node

        function addNavElement(element){
            element.easyAdmin = true;
            pb.AdminNavigation.addToSite(element, site);
        }

        navItems.forEach(addNavElement);


        cb(null, true);
    };

    /**
    * Called when the application is gracefully shutting down.  No guarantees are
    * provided for how much time will be provided the plugin to shut down.
    *
    * @param cb A callback that must be called upon completion.  cb(err, result).
    * The result is ignored
    */
    Feedback.onShutdown = function(cb) {
        cb(null, true);
    };

    //exports
    return Feedback;
};
