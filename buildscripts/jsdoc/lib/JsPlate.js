/**
 * @name JsPlate
 * @fileoverview A lightweight template parser and processing engine for JavaScript.
 * @author Michael Mathews, micmath@gmail.com
 * @license LGPL version 2, http://www.gnu.org/licenses/lgpl.html
 */

JsPlate = function(templateFile) {
	this.template = ReadFile(templateFile);
	this.code = "";
	this.parse();
}

JsPlate.prototype.parse = function() {
	this.template = this.template.replace(/\{#[\s\S]+?#\}/gi, "");

	this.code = "var output=``"+this.template;
	this.code = this.code.replace(
		/<for each="(.+?)" in="(.+?)"(?: sortby="(.+?)")?>/g, 
		function (match, eachName, inName, sortby) {
			if (sortby) {
				return "``; var $"+eachName+"_keys = "+sortby+"("+inName+").sort(); for(var $"+eachName+"_key = 0; $"+eachName+"_key < $"+eachName+"_keys.length; $"+eachName+"_key++) { var $"+eachName+" = $"+eachName+"_keys[$"+eachName+"_key]; var "+eachName+" = "+inName+"[$"+eachName+"]; output+=``";
			}
			else {
				return "``; for (var $"+eachName+" in "+inName+") { var "+eachName+" = "+inName+"[$"+eachName+"]; output+=``";
			}
		}
	);	
	this.code = this.code.replace(/<if test="(.+?)">/g, "``; if ($1) { output+=``");
	this.code = this.code.replace(/<\/(if|for)>/g, "``; }; output+=``");
	this.code = this.code.replace(
		/\{\+\s*([\s\S]+?)\s*\+\}/gi,
		function (match, code) {
			code = code.replace(/"/g, "``"); // prevent qoute-escaping of inline code
			code = code.replace(/(\r?\n)/g, " ");
			return "``+"+code+"+``";
		}
	);
	this.code = this.code.replace(
		/\{!\s*([\s\S]+?)\s*!\}/gi,
		function (match, code) {
			code = code.replace(/"/g, "``"); // prevent qoute-escaping of inline code
			code = code.replace(/(\r?\n)/g, " ");
			return "``; "+code+"; output+=``";
		}
	);
	this.code = this.code+"``;";

	this.code = this.code.replace(/(\r?\n)/g, "\\n");
	this.code = this.code.replace(/"/g, "\\\"");
	this.code = this.code.replace(/``/g, "\"");
}

JsPlate.prototype.toCode = function() {
	return this.code;
}

JsPlate.keys = function(obj) {
	var keys = [];
	if (obj.constructor.toString().indexOf("Array") > -1) {
		for (var i = 0; i < obj.length; i++) keys.push(i);
	}
	else {
		for (var i in obj) { keys.push(i); }
	}
	return keys;
};

JsPlate.values = function(obj) {
	var values = [];
	if (obj.constructor.toString().indexOf("Array") > -1) {
		for (var i = 0; i < obj.length; i++) values.push(obj[i]);
	}
	else {
		for (var i in obj) { values.push(obj[i]); }
	}
	return values;
};

JsPlate.prototype.process = function(data) {
	var keys = JsPlate.keys;
	var values = JsPlate.values;
	eval(this.code);
	return output;
	//print(this.code)
}

var ReadFile = function() {
	if (typeof window != "undefined") {
		if (window.ActiveXObject) {  // call ActiveX first in IE7 due to read permissions for local files
			var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		else if (window.XMLHttpRequest) {
			var xmlHttp = new XMLHttpRequest;
		}
		else {
			throw new Error("Unsupported environment.");
		}
		
		return function (url) {
			xmlHttp.open("GET", url, false);
			xmlHttp.send(null);
			return xmlHttp.responseText;
		}
	}
	else if (typeof readFile != "undefined") { // running Rhino?
		return function(path) {
			return readFile(path);
		}
	}
	else {
		throw new Error("Unsupported environment.");
	}
}();