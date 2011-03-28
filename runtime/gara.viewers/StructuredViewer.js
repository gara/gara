gara.provide("gara.viewers.StructuredViewer","gara.viewers.ContentViewer");gara.use("gara.viewers.ViewerFilter");gara.use("gara.viewers.ViewerSorter");gara.use("gara.viewers.SelectionChangedEvent");gara.use("gara.widgets.Widget");gara.Class("gara.viewers.StructuredViewer",function(){return{$extends:gara.viewers.ContentViewer,map:[],items:[],sorter:null,filters:[],elementMap:null,selectionListener:null,$constructor:function(){var b=this;this.map=[];this.items=[];this.sorter=null;this.filters=[];this.elementMap=null;this.selectionListener={widgetSelected:function(a){b.handleSelect(a)}}},addFilter:function(a){if(!(a instanceof gara.viewers.ViewerFilter)){throw new TypeError("filter not instance of gara.viewers.ViewerFilter");}if(!this.filters.contains(a)){this.filters.push(a)}this.refresh()},associate:function(a,b){var c=b.getData();if(c!==a){if(c!==null){this.disassociate(b)}b.setData(a)}this.mapElement(a,b)},disassociate:function(a){var b=a.getData();this.unmapElement(b,a);a.setData(null)},doUpdateItem:function(a,b){},doFindInputItem:function(a){},findItem:function(a){var b=this.findItems(a);return b.length===0?null:b[0]},findItems:function(a){if(!Object.prototype.hasOwnProperty(a,"__garaUID")){return[]}var b=this.doFindInputItem(a);if(b!==null){return[b]}if(this.usingElementMap()){var c=null;if(Object.prototype.hasOwnProperty(a,"__garaUID")&&Object.prototype.hasOwnProperty(this.elementMap,a.__garaUID)){c=this.elementMap[a.__garaUID]}if(c===null){return[]}else if(c instanceof gara.widgets.Widget){return[c]}else{return c}}return[]},getRawChildren:function(a){var b=null,c;if(a!==null){c=this.getContentProvider();if(c!==null&&c.getElements){b=c.getElements(a)}}return(b!==null&&Array.isArray(b))?b:[]},getItemFromElementMap:function(a){var b;if(a===null){return null}if(typeof(a)==="object"&&Object.prototype.hasOwnProperty(a,"__garaUID")){b=a.__garaUID}else{b=a}if(this.elementMap.hasOwnProperty(b)){return this.elementMap[b]}return null},getFilteredChildren:function(b){var c=this.getRawChildren(b);this.filters.forEach(function(a){c=a.filter(this,b,c)},this);return c},getSelection:function(){var a=this.getControl();if(a===null||a.isDisposed()){return[]}return this.getSelectionFromWidget()},getSelectionFromWidget:function(){},getSortedChildren:function(a){var b=this.getFilteredChildren(a);if(this.sorter!==null){b=this.sorter.sort(this,b)}return b},getSorter:function(){return this.sorter},getRoot:function(){return this.input},hookControl:function(b){var c=this;b.addSelectionListener({widgetSelected:function(a){c.handleSelect(a)}})},handleSelect:function(a){control=this.getControl();if(control!==null&&!control.isDisposed()){this.updateSelection(this.getSelection())}},internalRefresh:function(a,b){},mapElement:function(a,b){var c=gara.generateUID();if(this.elementMap===null){this.elementMap={}}if(typeof(a)==="object"){if(!a.hasOwnProperty("__garaUID")){a._garaUID=c}else{c=a._garaUID}}else{c=a}this.elementMap[c]=b},refresh:function(a,b){var c,d;if(typeof(a)==="boolean"){d=a}else if(typeof(a)==="object"){c=a}if(typeof(b)==="boolean"){d=b}this.internalRefresh(c,d)},setFilters:function(b){if(b.length===0){this.filters=[]}else{b.forEach(function(a){this.addFilter(a)},this)}},setInput:function(a){this.unmapAllElements();this.$super(a)},setSorter:function(a){if(a!==null&&!(a instanceof gara.viewers.ViewerSorter)){throw new TypeError("sorter not instance of gara.viewers.ViewerSorter");}this.sorter=a;this.refresh()},unmapAllElements:function(){this.elementMap={}},unmapElement:function(a,b){var c;if(this.elementMap===null||a===null||!(typeof(a)==="object"&&a.hasOwnProperty("__garaUID"))){return}if(typeof(a)==="object"&&a.hasOwnProperty("__garaUID")){c=a._garaUID}else{c=a}if($class.instanceOf(b,Array)){this.elementMap[c]=b}else{delete this.elementMap[c]}},updateItem:function(a,b){this.doUpdateItem(a,b)},usingElementMap:function(){return this.elementMap!==null},updateSelection:function(a){var b=new gara.viewers.SelectionChangedEvent(this,a);this.fireSelectionChanged(b)}}});