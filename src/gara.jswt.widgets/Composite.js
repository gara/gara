/*	$Id $

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://gara.creative2.net

		This library is free software;  you  can  redistribute  it  and/or
		modify  it  under  the  terms  of  the   GNU Lesser General Public
		License  as  published  by  the  Free Software Foundation;  either
		version 2.1 of the License, or (at your option) any later version.

		This library is distributed in  the hope  that it  will be useful,
		but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
		Lesser General Public License for more details.

	===========================================================================
*/

gara.provide("gara.jswt.widgets.Composite");

gara.use("gara.jswt.widgets.Control");

gara.require("gara.jswt.widgets.Scrollable");

/**
 * @class Composite
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Scrollable
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.Composite", {
	$extends : gara.jswt.widgets.Scrollable,

	/**
	 * @constructor
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);
		this._isComposite = false;
	},

	dispose : function() {
		this.$base();

		if (this._parentNode != null && this._isComposite) {
			this._parentNode.removeChild(this.handle);
		}

		delete this.handle;
	},

	_createWidget : function(element, preventAppending) {
		if (typeof(element) == "undefined") {
			this.addClass("jsWTComposite");
			this.$base("div");
			this.handle.tabIndex = -1;
			this._isComposite = true;
		} else {
			this.$base(element, preventAppending);
		}
	},

	getChildren : function() {
		var controls = [];
		if (this.handle) {
			var childs = this.getClientArea().childNodes;
			for (var i = 0, len = childs.length; i < len; i++) {
				var child = childs[i];
				if (child.widget && gara.instanceOf(child.widget, gara.jswt.widgets.Control)) {
					controls.push(child.widget);
				}
			}
		}
		return controls;
	},

	handleEvent : function(e) {
		this.$base(e);
	},

	_registerListener : function() {},
	_unregisterListener : function() {},

	update : function() {}
});