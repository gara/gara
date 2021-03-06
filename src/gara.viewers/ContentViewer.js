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

gara.provide("gara.viewers.ContentViewer", "gara.viewers.Viewer");

//gara.use("gara.viewers.IContentProvider");
//gara.use("gara.viewers.IBaseLabelProvider");

/**
 * @class ContentViewer
 * @extends gara.viewers.Viewer
 * @author Thomas Gossmann
 * @namespace gara.viewers
 */
gara.Class("gara.viewers.ContentViewer", function () { return {
	$extends : gara.viewers.Viewer,

	/**
	 * @field
	 *
	 * @private
	 * @type {Object}
	 */
	input : null,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.viewers.IContentProvider}
	 */
	contentProvider : null,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.viewers.IBaseLabelProvider}
	 */
	labelProvider : null,

	/**
	 * @constructor
	 */
	$constructor : function () {
		this.input = null;
		this.contentProvider = null;
		this.labelProvider = null;
	},

	getContentProvider : function () {
		return this.contentProvider;
	},

	getInput : function () {
		return this.input;
	},

	getLabelProvider : function () {
		return this.labelProvider;
	},

	/**
	 * @method
	 *
	 * @abstract
	 */
	inputChanged : function () {},

	/**
	 * @method
	 *
	 * @param {gara.viewers.IContentProvider} contentProvider
	 */
	setContentProvider : function (contentProvider) {
		this.contentProvider = contentProvider;
	},

	setInput : function (input) {
		var oldInput = this.getInput();
		if (this.contentProvider.inputChanged) {
			this.contentProvider.inputChanged(this, oldInput, input);
		}
		this.input = input;
		this.inputChanged(this.input, oldInput);
	},

	/**
	 * @method
	 *
	 * @param {gara.viewers.IBaseLabelProvider} labelProvider
	 */
	setLabelProvider : function (labelProvider) {
		this.labelProvider = labelProvider;
	}
};});