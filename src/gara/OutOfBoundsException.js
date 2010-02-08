/*	$Id: OutOfBoundsException.class.js 63 2007-07-20 15:36:50Z tgossmann $

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

gara.provide("gara.OutOfBoundsException");

/**
 * @class OutOfBoundsException
 * @description
 * i'm thrown when somethings going out of bounds
 * @author Thomas Gossmann
 * @extends Exception
 * @namespace gara
 */
gara.Class("gara.OutOfBoundsException", {
	$extends : Exception,

	$constructor: function(message) {
		this.message = String(message);
		this.name = gara.typeOf(this);
	}
});