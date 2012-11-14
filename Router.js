
/*
Copyright (C) <2012> <haithem bel haj>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {

  window.Router = (function() {

    Router.namedParam = /:\w+/g;

    Router.splatParam = /\*\w+/g;

    Router.prototype.trigger = true;

    function Router(routes) {
      var _this = this;
      this.routes = routes != null ? routes : {};
      History.Adapter.bind(window, 'statechange', function() {
        return _this.checkRoutes(History.getState());
      });
    }

    Router.prototype.route = function(route, callback) {
      route = route.replace(Router.namedParam, '([^\/]+)').replace(Router.splatParam, '(.*?)');
      return this.routes["^" + route + "$"] = callback;
    };

    Router.prototype.checkRoutes = function(state) {
      var callback, regex, regexText, url, _ref;
      if (this.trigger) {
        _ref = this.routes;
        for (regexText in _ref) {
          callback = _ref[regexText];
          regex = new RegExp(regexText);
          url = state.data.url || state.hash;
          if (regex.test(url)) callback.apply(window, regex.exec(url).slice(1));
        }
      }
      return this.trigger = true;
    };

    Router.prototype.navigate = function(url, trigger, replace, name) {
      if (trigger == null) trigger = true;
      if (replace == null) replace = false;
      if (name == null) name = null;
      this.trigger = trigger;
      if (replace) {
        return History.replaceState({
          'url': url
        }, null, url);
      } else {
        return History.pushState({
          'url': url
        }, null, url);
      }
    };
    
    Router.prototype.start = function(url) {
      var stateObj = {};
      if (url != null) stateObj = {data: {url: url}};
      else stateObj = History.getState();
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
