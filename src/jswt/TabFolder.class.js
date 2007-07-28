/*	$Id$

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

/**
 * gara TabFolder Widget
 * 
 * @class TabFolder
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends Control
 */
$class("TabFolder", {
	$extends : Control,

	$constructor : function(parentNode, style) {
		this.$base();

		this._style = style || gara.jswt.TOP;
		this._items = [];
		this._activeItem = null;
		this._parentNode = parentNode;
		this._selectionListener = [];
		this._selection = [];

		this._tabbar = null;
		this._clientArea = null;
		this._className = this._baseClass = "jsWTTabFolder";
	},

	/**
	 * @method
	 * Adds an item to this tabfolder
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TabItem} item the item to be added
	 * @throws {TypeError} if the item is not type of gara.jswt.TabItem
	 * @returns {void}
	 */
	_addItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TabItem)) {
			throw new TypeError("item is not type of gara.jswt.TabItem");
		}

		this._items.push(item);
	},

	/**
	 * @method
	 * Adds a selection listener on the tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this tabfolder
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @returns {void}
	 */
	addSelectionListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		this._selectionListener.push(listener);
	},

	/**
	 * @method
	 * Activates an item and notifies the selection listener
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TabItem} item the item to be activated
	 * @throws {TypeError} if the item is not type of gara.jswt.TabItem
	 * @returns {void}
	 */
	_activateItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TabItem)) {
			throw new TypeError("item is not type of gara.jswt.TabItem");
		}
		
		if (this._activeItem != null) {
			this._activeItem.setActive(false);
		}
		
		this._activeItem = item;
		item._setActive(true);
		
		this._clientArea.innerHTML = item.getContent();
		this.update();

		this._selection = [];
		this._selection.push(item);
		this._notifySelectionListener();
	},

	/**
	 * @method
	 * Returns the client area off that tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @returns {HTMLElement} the client area node
	 */
	getClientArea : function() {
		return this._clientArea;
	},
	
	/**
	 * @method
	 * Gets a specified item with a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the index does not live within this tabfolder
	 * @returns {gara.jswt.TabItem} the item
	 */
	getItem : function(index) {
		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("Your item lives outside of this tabfolder");
		}
	
		return this._items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @returns {int} the amount
	 */
	getItemCount : function() {
		return this._items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.TabItem[]} the array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.TabItem[]} an array with items
	 */
	getSelection : function() {
		return this._selection;
	},
	
	/**
	 * @method
	 * Returns the zero-related index of the selected item or -1 if there is no item selected
	 * 
	 * @author Thomas Gossmann
	 * @returns {int} the index of the selected item
	 */
	getSelectionIndex : function() {
		if (this._selection.length) {
			return this._items.indexOf(this._selection[0]);
		} else {
			return -1;
		}
	},

	/**
	 * @method
	 * Handles events for this tabfolder
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	handleEvent : function(e) {
		var obj = e.target.obj || null;
		switch (e.type) {
			case "mousedown":
				if (!this._hasFocus) {
					this.forceFocus();
				}

				if ($class.instanceOf(obj, gara.jswt.TabItem)) {
					var item = obj;

					this._activateItem(item);
				}
				break;
		}

		if (e.target != this.domref) {
			e.stopPropagation();
		}
	},
	
	/**
	 * @method
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TabItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this tabfolder
	 * @throws {TypeError} if the item is not a TabItem
	 * @returns {int} the index of the specified item
	 */
	indexOf : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TabItem)) {
			throw new TypeError("item not instance of gara.jswt.TabItem");
		}
	
		if (!this._items.contains(item)) {
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
		}

		return this._items.indexOf(item);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	_notifySelectionListener : function() {
		for (var i = 0, len = this._selectionListener.length; i < len; ++i) {
			this._selectionListener[i].widgetSelected(this);
		}
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	registerListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.EventManager.getInstance().addListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the listener to remove from this tabfolder
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @returns {void}
	 */
	removeSelectionListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
	},
	
	/**
	 * @method setSelection
	 * Selects the item at the given zero-related index in the tabfolder.
	 * Sets the tabfolders selection the the given array.
	 * Depends on the parameter
	 * 
	 * @author Thomas Gossmann
	 * @param {mixed} arg the given zero-related index or the given array
	 * @throws {gara.OutOfBoundsException} when there is no item for the given index
	 * @returns {void}
	 */
	setSelection : function(arg) {
		if (typeof(arg) == 'number') {
			if (index >= this._items.length) {
				throw new gara.OutOfBoundsException("Your item lives outside of this tabfolder");
			}
			this._activateItem(this._items[arg]);
		} else if ($class.instanceOf(arg, Array)) {
			if (arg.length) {
				this._activateItem(arg[0]);
			}
		}
	},
	
	toString : function() {
		return "[gara.jswt.TabFolder]";
	},

	/**
	 * @method
	 * updates this tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	update : function() {
		if (this.domref == null) {
			this.domref = document.createElement("div");
			this.domref.obj = this;
			this.domref.control = this;
			base2.DOM.bind(this.domref);

			this._tabbar = document.createElement("ul");
			this._tabbar.obj = this;
			this._tabbar.control = this;

			this._clientArea = document.createElement("div");
			this._clientArea.className = "jsWTTabClientArea"

			if (this._style == gara.jswt.TOP) {
				this.domref.appendChild(this._tabbar);
				this.domref.appendChild(this._clientArea);
				this._tabbar.className = "jsWTTabbar jsWTTabbarTop";
			} else {
				this.domref.appendChild(this._clientArea);
				this.domref.appendChild(this._tabbar);
				this._tabbar.className = "jsWTTabbar jsWTTabbarBottom";
			}

			/* buffer unregistered user-defined listeners */
			var unregisteredListener = {};			
			for (var eventType in this._listener) {
				unregisteredListener[eventType] = this._listener[eventType].concat([]);
			}

			/* List event listener */
			this.addListener("mousedown", this);

			/* register user-defined listeners */
			for (var eventType in unregisteredListener) {
				unregisteredListener[eventType].forEach(function(elem, index, arr) {
					this.registerListener(eventType, elem);
				}, this);
			}

			this._parentNode.appendChild(this.domref);
		}

		this.domref.className = this._className;

		// update items
		this._items.forEach(function(item, index, arr) {
			// create item ...
			if (!item.isCreated()) {
				node = item._create();
				this._tabbar.appendChild(node);
			}

			// ... or update it
			if (item.hasChanged()) {
				item.update();
				item.releaseChange();
			}
		}, this);
	}
});