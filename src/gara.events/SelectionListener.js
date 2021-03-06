/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.events.SelectionListener");

/**
 * @interface gara.events.SelectionListener
 * @name gara.events.SelectionListener
 * @class
 * 
 * TODO: Remove class in favor of interface
 */
gara.Class("gara.events.SelectionListener", /** @lends gara.events.SelectionListener# */ {
	
	/**
	 * Sent when the receiver gets selected. 
	 *
	 * @param {Event} e an event containing information about the selection
	 * @returns {void}
	 */
	widgetSelected : function (e) {}
});