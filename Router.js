/*
Copyright (C) <2012> <haithem bel haj>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* jshint expr: true */

(function() {

    'use strict';

    window.Router = (function() {
        Router.namedParam = /:\w+/g;

        Router.splatParam = /\*\w+/g;

        function _isPromise(value) {
            if (typeof value.then !== "function") {
                return false;
            }
            var promiseThenSrc = String($.Deferred().then);
            var valueThenSrc = String(value.then);
            return promiseThenSrc === valueThenSrc;
        }
        Router.prototype.trigger = true;

        Router.prototype.before = function() {

        }
        Router.prototype.after = function() {

        }

        function Router(routes, append_slash) {
            var _this = this;
            this._append_slash = (append_slash) ? '(\/|)' : '';
            routes || (routes = {});

            this.routes = routes;

            History.Adapter.bind(window, 'statechange', function() {
                return _this.checkRoutes(History.getState());
            });
        }

        Router.prototype.route = function(route, callback) {
            route = route.replace(Router.namedParam, '([^\/]+)').replace(Router.splatParam, '(.*?)');
            this.routes["^" + route + this._append_slash + "$"] = callback;
            return callback;
        };

        Router.prototype.run = function(url ){
            var _this = this;
        };

        Router.prototype.checkRoutes = function(state) {
            var callback, regex, regexText, url, _ref, $deferred, _this = this;

            if (this.trigger) {
                _ref = _this.routes;

                for (regexText in _ref) {
                    if (_ref.hasOwnProperty(regexText)) {
                        callback = _ref[regexText];
                        regex = new RegExp(regexText);
                        url = state.data.url || state.hash;
                        if (regex.test(url)) {
                            _this.before.apply(window);
                            $deferred = callback.apply(window, regex.exec(url).slice(1));
                            if (_isPromise($deferred)) {
                                $deferred.complete(function() {
                                    _this.after.apply(window)
                                });
                            }
                            else{
                                _this.after.apply(window)
                            }

                        }
                    }
                }
            }

            this.trigger = true;

            return true;
        };

        Router.prototype.navigate = function(url, title, data, trigger, replace) {
            data || (data = {});
            trigger || (trigger = true);

            this.trigger = trigger;

            if (replace) {
                return History.replaceState(data, title, url);
            }

            return History.pushState(data, title, url);
        };

        Router.prototype.start = function(url) {
            var stateObj = {};

            if (url) {
                stateObj = {
                    data: {
                        url: url
                    }
                };
            } else {
                stateObj = History.getState();
            }

            return this.checkRoutes(stateObj);
        };

        Router.prototype.go = function(num) {
            return History.go(num);
        };

        Router.prototype.back = function() {
            return History.back();
        };

        return Router;

    })();

}).call(this);