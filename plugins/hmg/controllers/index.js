/*
Copyright (C) 2015  PencilBlue, LLC

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

module.exports = function(pb) {

    //pb dependencies
    var util = pb.util;
    var Page = require('./page')(pb);

    function HomePage(){}
    util.inherits(HomePage, Page);

    HomePage.prototype.preRender = function(){
        this.pathVars.customUrl = 'heim'
    }

    HomePage.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/",
                content_type: 'text/html'
            }
        ]

        cb(null, routes);
    }

    //exports
    return HomePage;
};
