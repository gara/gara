gara.provide("gara.jswt.widgets.Control");gara.use("gara.jswt.JSWT");gara.use("gara.jswt.widgets.FocusManager");gara.parent("gara.jswt.widgets.Widget",function(){gara.Class("gara.jswt.widgets.Control",{$extends:gara.jswt.widgets.Widget,hasFocus:false,menu:null,enabled:true,mouseX:0,mouseY:0,width:0,height:0,focusListeners:[],mouseListeners:[],keyListeners:[],$constructor:function(a,b){this.$super(a,b);this.focusListeners=[];this.mouseListeners=[];this.keyListeners=[];this.width=null;this.height=null;this.hasFocus=false;this.menu=null;this.enabled=true;this.mouseX=0;this.mouseY=0;this.createWidget();gara.jswt.widgets.FocusManager.addWidget(this)},addFocusListener:function(a){if(!this.focusListeners.contains(a)){this.focusListeners.push(a)}return this},addKeyListener:(function(){var b=false;return function(a){if(!this.keyListeners.contains(a)){this.keyListeners.push(a)}if(!b){this.addListener("keydown",this);this.addListener("keyup",this);b=true}return this}})(),addMouseListener:(function(){var b=false;return function(a){if(!this.mouseListeners.contains(a)){this.mouseListeners.push(a)}if(!b){this.addListener("mousedown",this);this.addListener("mouseup",this);this.addListener("dblclick",this);b=true}return this}})(),createWidget:function(){alert("Control.createWidget() invoked on Control "+this+". Method not implemented")},createHandle:function(d,e){var c;this.handle=document.createElement(d);this.handle.id=this.getId();this.handle.widget=this;this.handle.control=this;this.handle.tabIndex=this.enabled?0:-1;this.handle.className=this.classes.join(" ");for(c in this.listeners){this.listeners[c].forEach(function(a,b,f){this.bindListener(c,a)},this)}if(!e){if(this.parent!==null&&this.parent instanceof gara.jswt.widgets.Composite){this.parentNode=this.parent.getClientArea()}else{this.parentNode=this.parent}if(this.parentNode!==null){this.parentNode.appendChild(this.handle)}}},dispose:function(){this.$super();gara.jswt.widgets.FocusManager.removeWidget(this);this.focusListeners=[];this.keyListeners=[];this.mouseListeners=[]},focusGained:function(b){this.hasFocus=true;b.widget=this;b.control=this;this.focusListeners.forEach(function(a){if(a.focusGained){a.focusGained(b)}},this)},focusLost:function(b){this.hasFocus=false;b.widget=this;b.control=this;this.focusListeners.forEach(function(a){if(a.focusLost){a.focusLost(b)}},this)},forceFocus:function(){this.handle.focus()},getEnabled:function(){return this.enabled},getHeight:function(){return this.height},getWidth:function(){return this.width},handleEvent:function(b){switch(b.type){case"keydown":this.keyListeners.forEach(function(a){if(a.keyPressed){a.keyPressed(b)}},this);break;case"keyup":this.keyListeners.forEach(function(a){if(a.keyReleased){a.keyReleased(b)}},this);break;case"dblclick":this.mouseListeners.forEach(function(a){if(a.mouseDoubleClick){a.mouseDoubleClick(b)}},this);break;case"mousedown":this.mouseListeners.forEach(function(a){if(a.mouseDown){a.mouseDown(b)}},this);break;case"mouseup":this.mouseListeners.forEach(function(a){if(a.mouseUp){a.mouseUp(b)}},this);break;case"mousemove":this.mouseX=(b.pageX||b.clientX+document.documentElement.scrollLeft)+1;this.mouseY=(b.pageY||b.clientY+document.documentElement.scrollTop)+1;break}},handleMenu:function(a){switch(a.type){case"keydown":if(this.menu!==null&&a.shiftKey&&a.keyCode===gara.jswt.JSWT.F10){this.menu.update();this.menu.setLocation(this.mouseX,this.mouseY);this.menu.setVisible(true,a);a.preventDefault()}break;case"contextmenu":if(this.menu!==null){this.menu.update();this.menu.setLocation(this.mouseX,this.mouseY);this.menu.setVisible(true,a);a.preventDefault()}break;case"mousedown":if(window.opera&&(a.altKey||a.ctrlKey)&&this.menu!==null){this.menu.update();this.menu.setLocation(this.mouseX,this.mouseY);this.menu.setVisible(true,a)}break}},isFocusControl:function(){return this.hasFocus},looseFocus:function(){this.handle.blur()},preventScrolling:function(a){if(a.keyCode===gara.jswt.JSWT.ARROW_UP||a.keyCode===gara.jswt.JSWT.ARROW_DOWN||a.keyCode===gara.jswt.JSWT.ARROW_LEFT||a.keyCode===gara.jswt.JSWT.ARROW_RIGHT||a.keyCode===gara.jswt.JSWT.PAGE_UP||a.keyCode===gara.jswt.JSWT.PAGE_DOWN||a.keyCode===gara.jswt.JSWT.HOME||a.keyCode===gara.jswt.JSWT.END||a.keyCode===gara.jswt.JSWT.SPACE){a.preventDefault()}},removeFocusListener:function(a){this.focusListeners.remove(a)},removeKeyListener:function(a){this.keyListeners.remove(a)},removeMouseListener:function(a){this.mouseListeners.remove(a)},setEnabled:function(a){this.enabled=a;this.handle.setAttribute("aria-disabled",!this.enabled);this.handle.tabIndex=this.enabled?0:-1;return this},setHeight:function(a){this.height=a;this.handle.style.height=this.height!==null?(this.height-gara.getNumStyle(this.handle,"padding-top")-gara.getNumStyle(this.handle,"padding-bottom")-gara.getNumStyle(this.handle,"border-top-width")-gara.getNumStyle(this.handle,"border-bottom-width"))+"px":"auto";return this},setMenu:function(a){if(a!==null&&!(a instanceof gara.jswt.widgets.Menu)){throw new TypeError("menu is not a gara.jswt.widgets.Menu");}if(this.menu&&a===null){this.removeListener("contextmenu",this);this.removeListener("mousedown",this);gara.EventManager.removeListener(document,"mousemove",this);this.handle.setAttribute("aria-haspopup",false);this.handle.removeAttribute("aria-owns")}else{this.addListener("contextmenu",this);this.addListener("mousedown",this);gara.EventManager.addListener(document,"mousemove",this);this.handle.setAttribute("aria-haspopup",true);this.handle.setAttribute("aria-owns",a.getId())}this.menu=a;return this},setWidth:function(a){this.width=a;this.handle.style.width=this.width!==null?(this.width-gara.getNumStyle(this.handle,"padding-left")-gara.getNumStyle(this.handle,"padding-right")-gara.getNumStyle(this.handle,"border-left-width")-gara.getNumStyle(this.handle,"border-right-width"))+"px":"auto";return this},topHandle:function(){return this.handle},update:function(){alert("Control.update() invoked on "+this+". Method not implemented")}})});