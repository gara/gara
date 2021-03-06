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

gara.provide("gara.viewers.ILabelProvider", "gara.viewers.IBaseLabelProvider");

/**
 * @interface ILabelProvider
 * @extends gara.viewers.IBaseLabelProvider
 * @namespace gara.viewers
 * @author Thomas Gossmann
 *
 * @summary
 * Extends IBaseLabelProvider with the methods to provide the text and/or image for the label of a given element.
 *
 * @description
 * Extends <code>IBaseLabelProvider</code> with the methods to provide the text
 * and/or image for the label of a given element. Used by most structured
 * viewers, except table viewers.
*/
gara.Class("gara.viewers.ILabelProvider", function () { return {
	$extends : gara.viewers.IBaseLabelProvider,

	/**
	 * @method
	 * Returns the image for the label of the given element
	 *
	 * @param {Object} element the element for which to provide the label image
	 * @returns the image used to label the element, or <code>null</code> if there is no image for the given object
	 */
	getImage : function(element) {},

	/**
	 * @method
	 * Returns the text for the label of the given element.
	 *
	 * @param {Object} element the element for which to provide the label text
	 * @returns the text string used to label the element, or <code>null</code> if there is no text label for the given object
	 */
	getText : function(element) {}
};});