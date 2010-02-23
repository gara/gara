/*	$Id: Menu.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.Menu");

gara.use("gara.EventManager");
gara.use("gara.OutOfBoundsException");

gara.use("gara.jswt.events.MenuListener");

gara.use("gara.jswt.widgets.MenuItem");
gara.use("gara.jswt.widgets.Control");

gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Composite");

/**
 * @summary gara Menu Widget
 *
 * @description long description for the Menu Widget...
 *
 * @class Menu
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Widget
 */
gara.Class("gara.jswt.widgets.Menu", {
	$extends : gara.jswt.widgets.Composite,

	$constructor : function(parent, style) {
		// style
		if (gara.instanceOf(parent, gara.jswt.widgets.MenuItem)
				&& (parent.getStyle() & gara.jswt.JSWT.CASCADE) != gara.jswt.JSWT.CASCADE) {
			throw new Exception("parent has no gara.jswt.JSWT.CASCADE style!");
		}

		if (gara.instanceOf(parent, gara.jswt.widgets.Control)) {
			style |= gara.jswt.JSWT.POP_UP;
		}

		if (gara.instanceOf(parent, gara.jswt.widgets.MenuItem)) {
			style |= gara.jswt.JSWT.DROP_DOWN;
		}

		// private members
		this._items = [];
		this._menuListener = [];
		this._activeItem = null;

		// location
		this._x = 0;
		this._y = 0;

		// flags
		this._enabled = false;
		this._visible = (style & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR; // bar = true
		this._menuBarDropDownShown = false;

		this.$base(parent, style || gara.jswt.JSWT.BAR);
	},

	_activateItem : function(item) {
		if (this._activeItem == item) {
			return;
		}

		if (this._activeItem != null) {
			this._activeItem._setActive(false);
			if (this._activeItem.getMenu() != null) {
				this._activeItem.getMenu().setVisible(false);
			}
		}

		this._activeItem = item;
		this._activeItem._setActive(true);

		var menu = this._activeItem.getMenu();
		if (this._menuBarDropDownShown && menu != null) {
			menu.setVisible(true);
		}
	},

	_addItem : function(item, index) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.MenuItem)) {
			throw new TypeError("item is not instance of gara.jswt.widgets.MenuItem");
		}

		if (typeof (index) != "undefined") {
			this._items.insertAt(index, item);
		} else {
			this._items.push(item);
		}
	},

	addMenuListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.MenuListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.MenuListener");
		}

		if (!this._menuListener.contains(listener)) {
			this._menuListener.push(listener);
		}
	},

	_createWidget : function() {
		this.$base("ul", true);

		this.handle.style.display = this._visible ? "block" : "none";
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "menu");

		// css
		this.addClass("jsWTMenu");

		// listener
		if (!gara.instanceOf(this._parent, gara.jswt.widgets.MenuItem)) {
			this.addListener("mouseover", this);
		}
		if ((this._style & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR) {
			this.addListener("mouseout", this);
		}
		this.addListener("click", this);

		if ((this._style & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR) {
			this.addClass("jsWTMenuBar");
			this._parentNode = this._parent;
			this.handle.setAttribute("role", "menubar");
			this.handle.tabIndex = 0;

			if (gara.instanceOf(this._parent, gara.jswt.widgets.Composite)) {
				this._parentNode = this._parent.handle;
			}
		}

		if ((this._style & gara.jswt.JSWT.POP_UP) == gara.jswt.JSWT.POP_UP) {
			this.addClass("jsWTMenuPopUp");
			this.handle.style.position = "absolute";
			this.handle.style.top = this._y + "px";
			this.handle.style.left = this._x + "px";
			this._parentNode = document.getElementsByTagName("body")[0];
		}

		if ((this._style & gara.jswt.JSWT.DROP_DOWN) == gara.jswt.JSWT.DROP_DOWN) {
			console.log("Menu.createWidget(drop-down);");
			this.addClass("jsWTMenuDropDown");
			this.handle.style.position = "absolute";
			this._parentNode = this._parent.handle;
			console.log(this._parentNode + " - " + this._parent);
		}

		this._parentNode.appendChild(this.handle);
	},

	dispose : function() {
		this.$base();

		this._items.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}
		delete this.handle;
	},

	forceFocus : function(e) {
		if (this._items.length && this._activeItem == null) {
			this._activateItem(this._items[0]);
		}

		this.$base(e);
	},

	getItem : function(index) {
		this.checkWidget();
		if (index > this._items.length || index < 0) {
			throw new gara.OutOfBoundsException("Menu doesn't have that much items");
		}

		return this._items[index];
	},

	getItemCount : function() {
		return this._items.length;
	},

	getItems : function() {
		return this._items;
	},

	getParent : function() {
		return this._parent;
	},

	getParentItem : function() {
		return this._parent;
	},

	getVisible : function() {
		return this._visible;
	},

	handleEvent : function(e) {
		this.checkWidget();
		e.widget = this;
		switch (e.type) {
			case "mousedown":
				if ((e.target.widget ? e.target.widget != this : true)
						&& (this.getStyle() & gara.jswt.JSWT.POP_UP) == gara.jswt.JSWT.POP_UP
						&& !gara.instanceOf(e.target.widget, gara.jswt.widgets.MenuItem)) {
					this.setVisible(false);
				}
//				else if (e.target.widget
//						&& gara.instanceOf(e.target.widget, gara.jswt.widgets.MenuItem)
//						&& e.target.widget.getMenu() != null) {
//					e.target.widget.getMenu().setVisible(!e.target.widget.getMenu().getVisible());
//				}
				break;

			case "mouseover":
				if (e.target.widget
						&& gara.instanceOf(e.target.widget, gara.jswt.widgets.MenuItem)
						&& (e.target.widget.getStyle() & gara.jswt.JSWT.SEPARATOR) != gara.jswt.JSWT.SEPARATOR) {
					var item = e.target.widget;
					if (item.getParent() == this && item.getEnabled()) {
						this._activateItem(e.target.widget);
						if (this._activeItem.getMenu() != null
								&& ((this._style & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR ? this._hasFocus : true)) {
							this._activeItem.getMenu().setVisible(true);
						}
					} else if (this._activeItem
							&& this._activeItem.getMenu() != null
							&& this._activeItem.getMenu().getVisible()) {
						this._activeItem.getMenu().handleEvent(e);
					}
				}
				else if (e.target.widget && e.target.widget == this && this._activeItem != null) {
					this._activeItem._setActive(false);
					this._activeItem = null;
				}
				break;

			case "mouseout":
				if (e.target.widget && (e.target.widget == this || e.target.widget.getParent() == this)
						&& !this._hasFocus
						&& this._activeItem != null) {
					this._activeItem._setActive(false);
					this._activeItem = null;
				}
				break;

			case "keydown":
				if (this._activeItem
						&& this._activeItem.getMenu() != null
						&& this._activeItem.getMenu().getVisible()) {
					this._activeItem.getMenu().handleEvent(e);
				} else {
					if (e.keyCode == gara.jswt.JSWT.ENTER) {
						invokeItem(this._activeItem);
					}
					this._handleKeyNavigation(e);
					this._preventScrolling(e);
				}
				break;

			case "click":
				if (this._activeItem) {
					invokeItem(this._activeItem);
				}
				break;
		}
		e.stopPropagation();

		function invokeItem(item) {
			item.setSelection((item.getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO ? true : !item.getSelection());

			// setting child menus invisible
			var parent = item;
			while (parent.getParent() != null
					&& (
						(gara.instanceOf(parent.getParent(), gara.jswt.widgets.Menu)
							&& (parent.getParent().getStyle() & gara.jswt.JSWT.BAR) != gara.jswt.JSWT.BAR)
						|| gara.instanceOf(parent.getParent(), gara.jswt.widgets.MenuItem)
					)) {
				parent = parent.getParent();

				if (gara.instanceOf(parent, gara.jswt.widgets.Menu)) {
					parent.setVisible(false);
				}
			}

			if (parent.getParent() != null
					&& gara.instanceOf(parent.getParent(), gara.jswt.widgets.Menu)
					&& (parent.getParent().getStyle() & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR) {
				parent.getParent()._hideMenuBarDropDown();
			}

			// blurring menubar
			if (item.getParent() != null
					&& (item.getParent().getStyle() & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR
					&& item.getParent() == this
					&& this._hasFocus) {
				item.getParent().handle.blur();
			}
		}
	},

	_handleKeyNavigation : function(e) {
		// MenuBar Navigation
		if ((this._style & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR) {

			switch (e.keyCode) {

				// left
				case gara.jswt.JSWT.ARROW_LEFT:
					goPrev.call(this);
					break;

				// right
				case gara.jswt.JSWT.ARROW_RIGHT:
					goNext.call(this);
					break;

				// down
				case gara.jswt.JSWT.ARROW_DOWN:
					if (this._activeItem && this._activeItem.getMenu() != null) {
						var menu = this._activeItem.getMenu();
						this._menuBarDropDownShown = true;
						menu.setVisible(true);
					}
					break;
			}
		}

		// Others
		else {
			switch (e.keyCode) {

				// up
				case gara.jswt.JSWT.ARROW_UP:
					goPrev.call(this);
					break;

				// down
				case gara.jswt.JSWT.ARROW_DOWN:
					goNext.call(this);
					break;

				// esc
				case gara.jswt.JSWT.ESC:
					this.setVisible(false);

					if (hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR) {
						this.getParent().getParent()._hideMenuBarDropDown();
					}
					break;

				// left
				case gara.jswt.JSWT.ARROW_LEFT:
					if (hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR) {
						this.getParent().getParent()._handleKeyNavigation(e);
					} else if (hasParentMenu.call(this)
							&& (this.getParent().getParent().getStyle() & gara.jswt.JSWT.BAR) != gara.jswt.JSWT.BAR) {
						this.setVisible(false);
					}
					break;

				// right
				case gara.jswt.JSWT.ARROW_RIGHT:
					if (this._activeItem.getMenu() != null) {
						this._activeItem.getMenu().setVisible(true);
					} else if(hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.jswt.JSWT.BAR) == gara.jswt.JSWT.BAR) {
						this.getParent().getParent()._handleKeyNavigation(e);
					}
					break;
			}
		}

		function goPrev() {
			var prevIndex = this.indexOf(this._activeItem) - 1;

			while (prevIndex >= 0 && (
					!this._items[prevIndex].getEnabled()
					|| !this._items[prevIndex].getVisible()
					|| (this._items[prevIndex].getStyle() & gara.jswt.JSWT.SEPARATOR) == gara.jswt.JSWT.SEPARATOR)) {
				prevIndex--;
			}

			if (prevIndex >= 0) {
				this._activateItem(this._items[prevIndex]);
			}
		}

		function goNext() {
			var nextIndex = this.indexOf(this._activeItem) + 1;

			while (nextIndex < this._items.length && (
					!this._items[nextIndex].getEnabled()
					|| !this._items[nextIndex].getVisible()
					|| (this._items[nextIndex].getStyle() & gara.jswt.JSWT.SEPARATOR) == gara.jswt.JSWT.SEPARATOR)) {
				nextIndex++;
			}

			if (nextIndex < this._items.length) {
				this._activateItem(this._items[nextIndex]);
			}
		}

		function hasParentMenu() {
			return this.getParent() != null
				&& this.getParent().getParent() != null
				&& gara.instanceOf(this.getParent().getParent(), gara.jswt.widgets.Menu);
		}
	},

	_hideMenuBarDropDown : function() {
		this._menuBarDropDownShown = false;
	},

	indexOf : function(item) {
		this.checkWidget();
		if (!gara.instanceOf(item, gara.jswt.widgets.MenuItem)) {
			throw new TypeError("item is not instance of gara.jswt.widgets.MenuItem");
		}

		return this._items.indexOf(item);
	},

	isVisible : function() {
		return this._visible;
	},

	looseFocus : function(e) {
		if (this._activeItem) {
			if (this._activeItem.getMenu() != null && this._activeItem.getMenu().getVisible()) {
				this._activeItem.getMenu().setVisible(false);
			}
			this._activeItem._setActive(false);
			this._activeItem = null;
		}

		this.$base(e);
	},

	/**
	 * @method Register listeners for this widget. Implementation for
	 *         gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.addListener(this.handle, eventType, listener);
		}
	},

	removeMenuListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.MenuListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.MenuListener");
		}

		if (this._menuListener.contains(listener)) {
			this._menuListener.remove(listener);
		}
	},

	setLocation : function(x, y) {
		this._x = x;
		this._y = y;
		if (this.handle) {
			this.handle.style.top = this._y + "px";
			this.handle.style.left = this._x + "px";
		}

		return this;
	},

	setVisible : function(visible, event) {
		this.checkWidget();
		this._visible = visible;
		if (this.handle) {
			this.handle.style.display = this._visible ? "block" : "none";
		}

		if (visible) {
			if ((this._style & gara.jswt.JSWT.BAR) != gara.jswt.JSWT.BAR) {
				if (this._items.length) {
					this._activateItem(this._items[0]);
				}
			}

			if ((this._style & gara.jswt.JSWT.POP_UP) == gara.jswt.JSWT.POP_UP) {
				gara.EventManager.addListener(document, "mousedown", this);
				if (gara.instanceOf(this._parent, gara.jswt.widgets.Control)) {
					this._parent.addListener("mousedown", this);
				}
			}

			this._menuListener.forEach(function(listener, index, arr) {
				listener.menuShown(this);
			}, this);
		} else {
			if ((this._style & gara.jswt.JSWT.POP_UP) == gara.jswt.JSWT.POP_UP) {
				gara.EventManager.removeListener(document, "mousedown", this);
				if (gara.instanceOf(this._parent, gara.jswt.widgets.Control)) {
					this._parent.removeListener("mousedown", this);
				}
			}

			this._items.forEach(function(item) {
				if (item.getMenu() != null) {
					item.getMenu().setVisible(false);
				}
			}, this);

			this._menuListener.forEach(function(listener, index, arr) {
				listener.menuHidden(this);
			}, this);
		}

		return this;
	},

	/**
	 * @method Unregister listeners for this widget. Implementation for
	 *         gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.removeListener(this.handle, eventType, listener);
		}
	},

	update : function() {
		this.checkWidget();

		if (!this.handle) {
			this._create();
		}

		// update items
		this._items.forEach(function(item) {
			item.update();
		}, this);
	}
});