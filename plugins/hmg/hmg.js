
module.exports = function HmgModule(pb) {

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
    Hmg.onStartupWithContext = function(context, cb) {

        var navItems = [
            {
                id: "dashboard",
                title: "Oversikt",
                icon: "dot-circle-o",
                href: "/admin"
            },
            {
                id: "sider",
                title: "Sider",
                icon: "file-text-o",
                href: "/admin/sider"
            },
            {
                id: "arrangement",
                title: "Arrangement",
                icon: "users",
                href: "/admin/arrangement",
                access: pb.SecurityService.ACCESS_USER,
                children: []
            },
            {
                id: "kalender",
                title: "Kalender",
                icon: "calendar",
                href: "/admin/kalender"
            },
            {
                id: "fakturaer",
                title: "Fakturaer",
                icon: "credit-card",
                href: "/admin/fakturaer"
            },
            {
                id: "epost",
                title: "E-post",
                icon: "envelope",
                href: "https://zoho.com/mail/login.html"
            },
            {
                id: "logg-ut",
                title: "Logg ut",
                icon: "sign-out",
                href: "/admin/logout"
            }
        ]

        var site = pb.SiteService.getCurrentSite(context.site);
        // Add a new top level node

        function addNavElement(element){
            element.easyAdmin = true;
            pb.AdminNavigation.addToSite(element, site);
        }

        navItems.forEach(addNavElement);


        pb.AdminSubnavService.registerFor('plugin_settings', function(navKey, localization, data) {
            if(data.plugin.uid === 'Hmg') {
                return [
                    {
                        name: 'home_page_settings',
                        title: 'Home page settings',
                        icon: 'home',
                        href: '/admin/plugins/Hmg/settings/home_page'
                    }
                ];
            }
            return [];
        });

        //setup for custom fields on page objects (hero_image)
        pb.BaseObjectService.on('page' + '.' + pb.BaseObjectService.FORMAT, function(context, cb) {
            var dto = context.data;
            dto.hero_image = pb.BaseObjectService.sanitize(dto.hero_image);

            cb(null);
        });
        pb.BaseObjectService.on('page' + '.' + pb.BaseObjectService.MERGE, function(context, cb) {
            var dto = context.data;
            var obj = context.object;

            obj.hero_image = dto.hero_image;

            cb(null);
        });
        pb.BaseObjectService.on('page' + '.' + pb.BaseObjectService.VALIDATE, function(context, cb) {
            var obj = context.data;
            var errors = context.validationErrors;

            if (!pb.ValidationService.isUrl(obj.hero_image, false)) {
                errors.push(pb.BaseObjectService.validationFailure('hero_image', 'Hero image must be a valid URL or media path'));
            }

            cb(null);
        });

        cb(null, true);
    };

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
