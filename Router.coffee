###
Copyright (C) <2012> <haithem bel haj>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###
class window.Router

	@namedParam: /:\w+/g
	@splatParam: /\*\w+/g
	trigger: true

	constructor: (@routes = {})->
		History.Adapter.bind window, 'statechange', ()=>
			@checkRoutes History.getState()

	route: (route, callback)->
		route = route.replace(Router.namedParam, '([^\/]+)')
					 .replace(Router.splatParam, '(.*?)')
		@routes["^#{route}$"] = callback

	checkRoutes: (state)->
		if @trigger
			for regexText, callback of @routes
				regex = new RegExp regexText
				url = state.data.url or state.hash
				if  regex.test url
					callback.apply(window, regex.exec(url).slice(1))
		@trigger = true

	navigate : (url, trigger=true, replace=false, name=null)->
		@trigger = trigger
		if replace 
			History.replaceState {'url' : url}, name, url
		else
			History.pushState {'url' : url}, name, url

	go: (num)->
		History.go num

	back : ()->
		History.back()


