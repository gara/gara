gara.provide("gara.widgets.Widget");gara.use("gara.widgets.Display");gara.use("gara.widgets.WidgetException");gara.Class("gara.widgets.Widget",{classes:[],data:{},dataMap:{},display:null,disposeListeners:[],event:null,handle:null,id:"",listeners:{},parent:null,parentNode:null,style:0,$constructor:function(a,b){this.id="";this.classes=["gara"];this.handle=null;this.parentNode=null;this.parent=a;this.style=b||gara.DEFAULT;this.disposed=false;this.display=a&&a.getDisplay?a.getDisplay():gara.widgets.Display.getDefault();this.event=null;this.listeners={};this.disposeListeners=[];this.data={};this.dataMap={}},addClass:function(a){if(!this.classes.contains(a)){this.classes.push(a);if(this.handle!==null){this.handle.className=this.classes.join(" ")}}return this},addClasses:function(b){b.forEach(function(a){this.addClass(a)},this);return this},addDisposeListener:function(a){if(!this.disposeListeners.contains(a)){this.disposeListeners.push(a)}return this},addListener:function(a,b){if(!Object.prototype.hasOwnProperty.call(this.listeners,a)){this.listeners[a]=[]}if(!this.listeners[a].contains(b)){this.listeners[a].push(b);this.bindListener(a,b)}return this},bindListener:function(a,b){},checkBits:gara.$static(function(){var a=0,b,c=arguments[0];for(b=1;b<arguments.length;b++){a|=arguments[b]}if(arguments.length>1){if((c&a)===0){c|=arguments[1]}for(b=1;b<arguments.length;b++){if((c&arguments[b])!==0){c=(c&~a)|arguments[b]}}}return c}),checkWidget:function(){if(this.isDisposed()){throw new gara.widgets.WidgetException(gara.ERROR_WIDGET_DISPOSED);}},dispose:function(){if(this.disposed){return}this.release()},destroyWidget:function(){this.handle=null;this.classes=null;this.parent=null;this.display=null;this.parentNode=null;this.listeners=null;this.disposeListeners=null;this.data=null;this.dataMap=null},getData:function(a){if(typeof(a)==="undefined"){return this.data}else{if(Object.prototype.hasOwnProperty.call(this.dataMap,a)){return this.dataMap[a]}}return null},getDisplay:function(){return this.display},getId:function(){if(this.id===""){this.id=gara.generateUID()}return this.id},getParent:function(){return this.parent},getStyle:function(){return this.style},hasClass:function(a){return this.classes.contains(a)},isDisposed:function(){return this.disposed},removeClass:function(a){this.classes.remove(a);if(this.handle!==null){this.handle.className=this.classes.join(" ")}return this},removeDisposeListener:function(a){this.disposeListeners.remove(a);return this},removeListener:function(a,b){if(Object.prototype.hasOwnProperty.call(this.listeners,a)&&this.listeners[a].contains(b)){this.listeners[a].remove(b);this.unbindListener(a,b)}return this},release:function(){this.disposed=true;for(var d in this.listener){this.listener[d].forEach(function(a,b,c){this.removeListener(d,a)},this)}this.disposeListeners.forEach(function(a){if(a.widgetDisposed){a.widgetDisposed(this)}},this);this.releaseChildren();this.destroyWidget()},releaseChildren:function(){},setClass:function(a,b){if(!b){this.removeClass(a)}else{this.addClass(a)}return this},setData:function(a,b){if(typeof b==="undefined"){this.data=a}else{this.dataMap[a]=b}return this},setId:function(a){this.id=a;return this},toggleClass:function(a){if(this.classes.contains(a)){this.classes.remove(a)}else{this.classes.push(a)}if(this.handle!==null){this.handle.className=this.classes.join(" ")}},unbindListener:function(a,b){}});