/*	$Id: I18n.class.js 182 2009-08-02 22:34:06Z tgossmann $

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

gara.provide("gara.I18n");

/**
 * @class I18n
 * @author Thomas Gossmann
 * @namespace gara
 */
gara.Class("gara.I18n", {
	$constructor : function() {
		this._map = {
			"gara.ok": "Ok",
			"gara.cancel": "Cancel",
			"gara.yes" : "Yes",
			"gara.no" : "No",
			"gara.retry" : "Retry",
			"gara.abort" : "Abort",
			"gara.ignore" : "Ignore"
		};
	},

	get : function(key) {
		if (this._map.hasOwnProperty(key)) {
			return this._map[key];
		}

		return null;
	},

	set : function(key, value) {
		this._map[key] = value;
	}
});

gara.i18n = new gara.I18n();