/*	$Id: Tree.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.Tree", "gara.jswt.widgets.Composite");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
//gara.use("gara.jswt.widgets.TreeItem");

/**
 * gara Tree Widget
 *
 * @class Tree
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Composite
 */
gara.Class("gara.jswt.widgets.Tree", function() { return {
	$extends : gara.jswt.widgets.Composite,

	/**
	 * @field
	 * Contains the activeItem
	 *
	 * @private
	 * @type {gara.jswt.widgets.TreeItem}
	 */
	activeItem : null,

	/**
	 * @field
	 * Contains the items
	 *
	 * @private
	 * @type {gara.jswt.widgets.TreeItem[]}
	 */
	items : [],

	/**
	 * @field
	 * Contains the root items
	 *
	 * @private
	 * @type {gara.jswt.widgets.TreeItem[]}
	 */
	rootItems : [],

	/**
	 * Contains the current selection.
	 *
	 * @private
	 * @type {gara.jswt.widgets.ListItem}
	 */
	selection : [],

	/**
	 * A collection of listeners that will be notified, when the selection
	 * of the <code>List</code> changes.
	 *
	 * @private
	 * @type {gara.jswt.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * @field
	 * Holds the show lines state
	 *
	 * @private
	 * @type {boolean}
	 */
	showLines : true,

	/**
	 * Contains the item that was active when shift was pressed.
	 *
	 * @private
	 * @type {gara.jswt.widgets.ListItem}
	 */
	shiftItem : null,

	$constructor : function (parent, style) {
		this.items = [];
		this.rootItems = [];

		this.showLines = true;
		this.activeItem = null;
		this.shiftItem = null;

		this.selection = [];
		this.selectionListeners = [];

		this.$super(parent, style || gara.jswt.JSWT.SINGLE);
		this.addFocusListener(this);
	},

	/**
	 * @method
	 * Activates an item
	 *
	 * @private
	 * @param {gara.jswt.widgets.TreeItem} item the new item to be activated
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	activateItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		// set a previous active item inactive
		if (this.activeItem !== null && !this.activeItem.isDisposed()) {
			this.activeItem.setActive(false);
		}

		this.activeItem = item;
		this.activeItem.setActive(true);

		// ARIA reference to the active item
		this.handle.setAttribute("aria-activedescendant", this.activeItem.getId());
	},

	/**
	 * @method
	 * Adds an item to the tree. This is automatically done by instantiating a new item.
	 *
	 * @private
	 * @param {gara.jswt.widgets.TreeItem} item the new item to be added
	 * @throws {TypeError}
	 * @return void
	 */
	addItem : function (item, index) {
		var parentItem, previousItem, nextItemIndex, append;
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		parentItem = item.getParentItem();
		getDescendents = function (item) {
			var childs = 0;
			if (item.getItemCount() > 0) {
				item.getItems().forEach(function (child) {
					if (child.getItemCount() > 0) {
						childs += getDescendents(child);
					}
					childs++;
				}, this);
			}
			return childs;
		};

		// root item
		if (parentItem === null) {
			append = typeof(index) === "undefined";

			previousItem = this.rootItems[index];
			if (previousItem) {
				nextItemIndex = getDescendents(previousItem) + 1;
				this.items.insertAt(nextItemIndex, item);
				this.rootItems.insertAt(index, item);
			} else {
				append = true;
			}

			if (append) {
				this.items.push(item);
				this.rootItems.push(item);
			}

		}
		// childs
		else {
			index = this.items.indexOf(parentItem)
				+ getDescendents(parentItem);

			this.items.insertAt(index, item);
		}

		return this.handle;
	},

	/**
	 * @method
	 * Adds a selection listener on the tree
	 *
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this tree
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.push(listener);
		}
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	createWidget : function () {
		this.createHandle("ul");
		this.handle.setAttribute("role", "tree");
		this.handle.setAttribute("aria-multiselectable", (this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI ? true : false);
		this.handle.setAttribute("aria-activedescendant", this.getId());

		// css
		this.addClass("jsWTTree");
		this.setClass("jsWTTreeFullSelection", (this.style & gara.jswt.JSWT.FULL_SELECTION) === gara.jswt.JSWT.FULL_SELECTION);
		this.setClass("jsWTTreeCheckbox", (this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK);
		this.setClass("jsWTTreeLines", this.showLines);
		this.setClass("jsWTTreeNoLines", !this.showLines);

		// listeners
		this.addListener("mousedown", this);
		if ((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
			this.addListener("mouseup", this);
		}
	},

	/**
	 * @method
	 * Deselects a specific item
	 *
	 * @private
	 * @param {gara.jswt.widgets.TreeItem} item the item to deselect
	 * @return {void}
	 */
	deselect : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		if (this.selection.contains(item)/* && item.getParent() === this*/) {
			item.setSelected(false);
			this.selection.remove(item);
			this.shiftItem = item;
			this.notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Deselects all items in the <code>Tree</code>
	 *
	 * @return {void}
	 */
	deselectAll : function () {
		this.checkWidget();
		while (this.selection.length) {
			this.selection.pop().setSelected(false);
		}
		this.notifySelectionListener();
	},

	dispose : function () {
		this.deselectAll();
		this.$super();

		this.rootItems.forEach(function (item, index, arr) {
			item.dispose();
		}, this);

		if (this.parentNode !== null) {
			this.parentNode.removeChild(this.handle);
		}
		delete this.handle;
	},

	focusGained : function () {
		if (this.activeItem === null && this.items.length) {
			this.activateItem(this.items[0]);
		}
	},

	getColumnCount : function () {
		return 0;
	},

	/**
	 * @method
	 * Returns a specifiy item with a zero-related index
	 *
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @return {gara.jswt.widgets.TreeItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.rootItems.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.rootItems[index];
	},

	/**
	 * @method
	 * Returns the amount of items that are direct items of the tree
	 *
	 * @return {int} the amount
	 */
	getItemCount : function () {
		return this.rootItems.length;
	},

	/**
	 * @method
	 * Returns the height of an item
	 *
	 * @private
	 * @param {gara.jswt.widgets.TreeItem}
	 * @return {int}
	 */
	getItemHeight : function (item) {
		return item.handle.offsetHeight
				+ gara.getNumStyle(item.handle, "margin-top")
				+ gara.getNumStyle(item.handle, "margin-bottom")
				- (item.childContainer.offsetHeight
					+ gara.getNumStyle(item.childContainer, "margin-top")
					+ gara.getNumStyle(item.childContainer, "margin-bottom"));
	},

	/**
	 * @method
	 * Returns an array with direct items of the tree
	 *
	 * @return {gara.jswt.widgets.TreeItem[]} an array with the items
	 */
	getItems : function () {
		return this.rootItems;
	},

	/**
	 * @method
	 * Returns whether the lines of the tree are visible or not.
	 *
	 * @return {boolean} true if the lines are visible and false if they are not
	 */
	getLinesVisible : function () {
		return this.showLines;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the <code>Tree</code>.
	 *
	 * @return {gara.jswt.widgets.TreeItem[]}an array with items
	 */
	getSelection : function () {
		return this.selection;
	},

	/**
	 * @method
	 * Returns the amount of the selected items in the <code>Tree</code>.
	 *
	 * @return {int} the amount
	 */
	getSelectionCount : function () {
		return this.selection.length;
	},

	/**
	 * @method
	 * Returns the top item of the <code>Tree</code>.
	 */
	getTopItem : function () {
		if (!this.items.length) {
			return null;
		}

		var scrollTop = this.scrolledHandle().scrollTop;
		var h = 0;
		for (var i = 0; i < this.items.length; i++) {
			h += this.getItemHeight(this.items[i]);
			if (h > scrollTop) {
				return this.items[i];
			}
		}
	},

	/**
	 * @method
	 * Event Handler for the <code>Tree</code>.
	 *
	 * @private
	 * @param {Event} W3C-event
	 * @return {void}
	 */
	handleEvent : function (e) {
		var widget;
		this.checkWidget();

		// special events for the list
		widget = e.target.widget || null;
		e.item = widget && widget instanceof gara.jswt.widgets.TreeItem ? widget : this.activeItem;
		e.widget = this;
		this.event = e;

		this.handleMouseEvents(e);
		if (this.menu !== null && this.menu.isVisible()) {
			this.menu.handleEvent(e);
		} else {
			this.handleKeyEvents(e);
			this.handleMenu(e);
		}

		this.$super(e);

		if (e.item !== null) {
			e.item.handleEvent(e);
		}

		e.stopPropagation();
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	handleMouseEvents : function (e) {
		var item = e.item;
		switch (e.type) {
		case "mousedown":
			if (item !== null) {
				if (e.ctrlKey && !e.shiftKey) {
					if (this.selection.contains(item)) {
						this.deselect(item);
					} else {
						this.selectAdd(item, true);
					}
				} else if (!e.ctrlKey && e.shiftKey) {
					this.selectShift(item, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.selectShift(item, true);
				} else {
					this.selectAdd(item, false);
				}
				this.activateItem(item);
			}
			break;
		}
	},

	handleKeyEvents : function (e) {
		switch (e.type) {
		case "keyup":
		case "keydown":
		case "keypress":
			if (e.type === "keydown") {
				this.handleKeyNavigation(e);
			}

			// prevent default when scrolling keys are used
			this.preventScrolling(e);
			break;
		}
	},

	/**
	 * @method
	 * Key Event Handler for the Tree
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} W3C-Event
	 * @return {void}
	 */
	handleKeyNavigation : function (e) {
		var prev, siblings, parentWidget, sibOffset, prevSibling, h, i, viewport,
			itemAddition, next, activeIndex, scrollRange, min, buffer, getLastItem, countItems;

		getLastItem = function (item) {
			if (item.getExpanded() && item.getItemCount() > 0) {
				return getLastItem(item.getItems()[item.getItemCount() - 1]);
			} else {
				return item;
			}
		};

		countItems = function(item) {
			var items = 0, i,
				childs = item.getItems();

			for (i = 0; i < childs.length; ++i) {
				items++;
				if (childs[i].getItemCount() > 0) {
					items += countItems(childs[i]);
				}
			}

			return items;
		};

		switch (e.keyCode) {

		// up
		case gara.jswt.JSWT.ARROW_UP:

			// determine previous item
			if (this.activeItem === this.items[0]) {
				// item is root;
				prev = false;
			} else {
				parentWidget = this.activeItem.getParentItem();
				if (parentWidget === null) {
					siblings = this.rootItems;
				} else {
					siblings = parentWidget.getItems();
				}
				sibOffset = siblings.indexOf(this.activeItem);

				// prev item is parent
				if (sibOffset === 0) {
					prev = parentWidget;
				} else {
					prevSibling = siblings[sibOffset - 1];
					prev = getLastItem(prevSibling);
				}
			}

			if (prev) {
				// update scrolling
				h = 0;
				activeIndex = this.items.indexOf(this.activeItem);
				for (i = 0; i < (activeIndex - 1); i++) {
					h += this.getItemHeight(this.items[i]);
				}
				viewport = this.handle.clientHeight + this.handle.scrollTop
					- gara.getNumStyle(this.handle, "padding-top")
					- gara.getNumStyle(this.handle, "padding-bottom");
				itemAddition = this.getItemHeight(prev);

				this.handle.scrollTop = h < this.handle.scrollTop ? h : (viewport < h ? h - viewport + itemAddition : this.handle.scrollTop);

				// handle select
				if (!e.ctrlKey && !e.shiftKey) {
					this.activateItem(prev);
					this.selectAdd(prev, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.activateItem(prev);
					this.selectShift(prev, true);
				} else if (e.shiftKey) {
					this.activateItem(prev);
					this.selectShift(prev, false);
				} else if (e.ctrlKey) {
					this.activateItem(prev);
				}
			}
			break;

		// down
		case gara.jswt.JSWT.ARROW_DOWN:

			// determine next item
			// item is last;
			if (this.activeItem === this.items[this.items.length - 1]) {
				next = false;
			} else {
				parentWidget = this.activeItem.getParentItem();
				if (parentWidget === null) {
					siblings = this.rootItems;
				} else {
					siblings = parentWidget.getItems();
				}
				sibOffset = siblings.indexOf(this.activeItem);

				if (this.activeItem.getItemCount() > 0 && this.activeItem.getExpanded()) {
					next = this.activeItem.getItems()[0];
				} else if (this.activeItem.getItemCount() > 0 && !this.activeItem.getExpanded()) {
					next = this.items[this.items.indexOf(this.activeItem) + countItems(this.activeItem) + 1];
				} else {
					next = this.items[this.items.indexOf(this.activeItem) + 1];
				}
			}

			if (next) {
				// update scrolling
				h = 0;
				activeIndex = this.items.indexOf(this.activeItem);
				for (i = 0; i <= (activeIndex + 1); i++) {
					h+= this.getItemHeight(this.items[i]);
				}
				min = h - this.getItemHeight(next);
				viewport = this.handle.clientHeight + this.handle.scrollTop
					- gara.getNumStyle(this.handle, "padding-top")
					- gara.getNumStyle(this.handle, "padding-bottom");
				scrollRange = h - this.handle.clientHeight
					+ gara.getNumStyle(this.handle, "padding-top")
					+ gara.getNumStyle(this.handle, "padding-bottom");

				this.handle.scrollTop = h > viewport ? (scrollRange) : (this.handle.scrollTop > min ? min : this.handle.scrollTop);


				// handle select
				if (!e.ctrlKey && !e.shiftKey) {
					this.activateItem(next);
					this.selectAdd(next, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.activateItem(next);
					this.selectShift(next, true);
				} else if (e.shiftKey) {
					this.activateItem(next);
					this.selectShift(next, false);
				} else if (e.ctrlKey) {
					this.activateItem(next);
				}
			}
			break;

		// left - collapse tree
		case gara.jswt.JSWT.ARROW_LEFT:
			buffer = this.activeItem;
			this.activeItem.setExpanded(false);
			this.activateItem(buffer);
			break;

		// right - expand tree
		case gara.jswt.JSWT.ARROW_RIGHT:
			this.activeItem.setExpanded(true);
			break;

		// space
		case gara.jswt.JSWT.SPACE:
			this.activeItem.setChecked(!this.activeItem.getChecked());
			if (this.selection.contains(this.activeItem) && e.ctrlKey) {
				this.deselect(this.activeItem);
			} else {
				this.selectAdd(this.activeItem, true);
			}
			break;

		// home
		case gara.jswt.JSWT.HOME:
			this.handle.scrollTop = 0;

			if (!e.ctrlKey && !e.shiftKey) {
				this.activateItem(this.items[0]);
				this.selectAdd(this.items[0], false);
			} else if (e.shiftKey) {
				this.activateItem(this.items[0]);
				this.selectShift(this.items[0], false);
			} else if (e.ctrlKey) {
				this.activateItem(this.items[0]);
			}
			break;

		// end
		case gara.jswt.JSWT.END:
			this.handle.scrollTop = this.handle.scrollHeight - this.handle.clientHeight;

			if (!e.ctrlKey && !e.shiftKey) {
				this.activateItem(this.items[this.items.length-1]);
				this.selectAdd(this.items[this.items.length-1], false);
			} else if (e.shiftKey) {
				this.activateItem(this.items[this.items.length-1]);
				this.selectShift(this.items[this.items.length-1], false);
			} else if (e.ctrlKey) {
				this.activateItem(this.items[this.items.length-1]);
			}
			break;
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 *
	 * @param {gara.jswt.widgets.TreeItem} item the item for the index
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {int} the index of the specified item or -1 if it does not exist
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		return this.rootItems.indexOf(item);
	},

	/**
	 * @method
	 * Notifies all selection listeners about the selection change
	 *
	 * @private
	 * @return {void}
	 */
	notifySelectionListener : function () {
		this.selectionListeners.forEach(function (listener) {
			if (listener.widgetSelected) {
				listener.widgetSelected(this.event);
			}
		}, this);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	removeItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		this.items.remove(item);
		this.rootItems.remove(item);
	},

	/**
	 * @method
	 * Removes all items from the tree
	 *
	 * @return {void}
	 */
	removeAll : function () {
		this.checkWidget();
		this.items = [];
		this.rootItems = [];
	},

	/**
	 * @method
	 * Removes a selection listener from this tree
	 *
	 * @param {gara.jswt.widgets.SelectionListener} listener the listener to be removed from this tree
	 * @throws {TypeError} if the listener is not a SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function (listener) {
		this.selectionListeners.remove(listener);
	},

	/**
	 * @method
	 * Selects a specific item
	 *
	 * @private
	 * @param {gara.jswt.widgets.TreeItem} item the item to select
	 * @param {boolean} _add true for adding to the current selection, false will select only this item
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {void}
	 */
	selectAdd : function (item, add) {
		var i;
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		if (!add || (this.style & gara.jswt.JSWT.MULTI) !== gara.jswt.JSWT.MULTI) {
			while (this.selection.length) {
				i = this.selection.pop();
				i.setSelected(false);
			}
		}

		if (!this.selection.contains(item)) {
			item.setSelected(true);
			this.selection.push(item);
			this.shiftItem = item;
			this.notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Select all items in the list
	 *
	 * @return {void}
	 */
	selectAll : function () {
		this.checkWidget();
		if ((this.style & gara.jswt.JSWT.SINGLE) !== gara.jswt.JSWT.SINGLE) {
			this.items.forEach(function (item){
				if (!this.selection.contains(item)) {
					this.selection.push(item);
					item.setSelected(true);
				}
			}, this);
			this.notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Selects a Range of items. From shiftItem to the passed item.
	 *
	 * @private
	 * @return {void}
	 */
	selectShift : function (item, add) {
		var i, indexShift, indexItem, from, to;
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		if (!add) {
			while (this.selection.length) {
				i = this.selection.pop();
				i.setSelected(false);
			}
		}

		if ((this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
			indexShift = this.items.indexOf(this.shiftItem);
			indexItem = this.items.indexOf(item);
			from = indexShift > indexItem ? indexItem : indexShift;
			to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
				this.selection.push(this.items[i]);
				this.items[i].setSelected(true);
			}

			this.notifySelectionListener();
		} else {
			this.selectAdd(item);
		}
	},

	/**
	 * @method
	 * Sets lines visible or invisible.
	 *
	 * @param {boolean} show true if the lines should be visible or false for invisibility
	 * @return {void}
	 */
	setLinesVisible : function (show) {
		this.showLines = show;
		this.setClass("jsWTTreeLines", this.showLines);
		return this;
	},

	/**
	 * @method
	 * Sets the selection of the <code>Tree</code>
	 *
	 * @param {gara.jswt.widgets.TreeItem[]|gara.jswt.widgets.TreeItem} items the array with the <code>TreeItem</code> items
	 * @return {void}
	 */
	setSelection : function (items) {
		var item;
		this.checkWidget();

		while (this.selection.length) {
			item = this.selection.pop();
			if (!item.isDisposed()) {
				item.setSelected(false);
			}
		}

		if (items instanceof Array) {
			if (items.length > 1 && (this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
				items.forEach(function (item) {
					if (!this.selection.contains(item)) {
						item.setSelected(true);
						this.selection.push(item);
					}
				}, this);
				this.notifySelectionListener();
			} else if (items.length) {
				this.selectAdd(items[items.length - 1], true);
			}
		} else if (gara.instanceOf(items, gara.jswt.widgets.ListItem)) {
			this.selectAdd(this.indexOf(items), true);
		}
		return this;
	},

	setTopItem : function (item) {
		var index, h, i;
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		index = this.items.indexOf(item);
		h = 0;
		for (i = 0; i < index; i++) {
			h += this.getItemHeight(this.items[i]);
		}

		this.scrolledHandle().scrollTop = h;
		return this;
	},

//	setWidth : function (width) {
//		console.log("Tree.setWidth (padding-left)" + gara.Utils.getStyle(this.handle, "padding-left"));
//		console.log("Tree.setWidth (padding-right)" + gara.Utils.getStyle(this.handle, "padding-right"));
//		console.log("Tree.setWidth (border-left-width)" + gara.Utils.getStyle(this.handle, "border-left-width"));
//		console.log("Tree.setWidth (border-right-width)" + gara.Utils.getStyle(this.handle, "border-right-width"));
//		this.$super(width);
//		console.log("Tree.setWidth: " + width);
//		return this;
//	},

	showItem : function (item) {
		var index, h, i, newScrollTop;
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		if (this.getVerticalScrollbar()) {
			index = this.items.indexOf(item);
			h = 0;
			for (i = 0; i <= index; i++) {
				h += this.getItemHeight(this.items[i]);
			}

			if ((this.scrolledHandle().scrollTop + this.scrolledHandle().clientHeight) < h
					|| this.scrolledHandle().scrollTop > h) {
				newScrollTop = h - Math.round(this.getItemHeight(this.items[index]) / 2) - Math.round(this.scrolledHandle().clientHeight / 2);
				this.scrolledHandle().scrollTop = newScrollTop;
			}
		}
	},

	showSelection : function () {
		if (this.selection.length) {
			this.showItem(this.selection[0]);
		}
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * Updates the <code>Tree</code>, remeasures the <code>Tree</code>. Removing
	 * disposed items, updates the others.
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function () {
		var i = 0, item,
			len = this.rootItems.length;

		this.checkWidget();

		// measurements
		this.handle.style.width = this.width !== null ? (this.width - gara.getNumStyle(this.handle, "padding-left") - gara.getNumStyle(this.handle, "padding-right") - gara.getNumStyle(this.handle, "border-left-width") - gara.getNumStyle(this.handle, "border-right-width")) + "px" : "auto";
		this.handle.style.height = this.height !== null ? (this.height - gara.getNumStyle(this.handle, "padding-top") - gara.getNumStyle(this.handle, "padding-bottom") - gara.getNumStyle(this.handle, "border-top-width") - gara.getNumStyle(this.handle, "border-bottom-width")) + "px" : "auto";

		// update items
		while (i < len) {
			item = this.rootItems[i];
			if (item.isDisposed()) {
				this.removeItem(item);
				len--;
			} else {
				item.update();
				i++;
			}
		}
	}
};});