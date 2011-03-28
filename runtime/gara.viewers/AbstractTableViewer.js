gara.provide("gara.viewers.AbstractTableViewer","gara.viewers.ColumnViewer");gara.use("gara.widgets.Item");gara.Class("gara.viewers.AbstractTableViewer",function(){return{$extends:gara.viewers.ColumnViewer,$constructor:function(){this.$super()},createItem:function(b,c){this.updateItem(this.internalCreateNewRowPart(gara.NONE,c).getItem(),b)},doFindInputItem:function(b){var c=this.getRoot();if(c===null){return null}if(c===b){return this.getControl()}return null},doClear:function(b){},doGetColumn:function(){},doGetColumnCount:function(){},doGetItems:function(){},doGetSelection:function(){},doRemoveRange:function(b,c){},doUpdateItem:function(b,c){var d,f,h,a,e,g,i;if(b instanceof gara.widgets.Item){d=b;if(d.isDisposed()){this.unmapElement(c,d);return}f=d.getData();if(f!==null){this.unmapElement(f,d)}d.setData(c);this.mapElement(c,d);columnCount=this.doGetColumnCount();if(columnCount===0){columnCount=1}a=this.getViewerRowFromItem(d);for(e=0;e<columnCount||e===0;e++){g=this.getViewerColumn(e);i=this.updateCell(a,e,c);g.refresh(i)}}},getColumnViewerOwner:function(b){var c=this.doGetColumnCount();if(b<0||(b>0&&b>=c)){return null}if(c===0){return this.getControl()}return this.doGetColumn(b)},getSelectionFromWidget:function(){var b=this.doGetSelection(),c=[],d,f,h;for(f=0;f<b.length;f++){d=b[f];h=d.getData();if(h!==null){c.push(h)}}return c},inputChanged:function(b,c){this.internalRefresh()},internalCreateNewRowPart:function(b,c){},internalRefresh:function(b,c){var d;if(typeof(b)==="undefined"||b===null||b===this.getRoot()){this.internalRefreshAll(c)}else{d=this.findItem(b);if(d!==null){this.updateItem(d,b)}this.getControl().update()}},internalRefreshAll:function(d){var f=[],h=this.getControl().getSelection(),a,e,g,i,j;for(var a=0;a<h.length;++a){f.push(h[a].getData())}g=this.getSortedChildren(this.getRoot());e=this.doGetItems();i=Math.min(g.length,e.length);for(a=0;a<i;++a){j=e[a];if(g[a]===j.getData()){if(d){this.updateItem(j,g[a])}else{this.associate(g[a],j)}}else{this.disassociate(j);this.doClear(a)}}if(i<e.length){for(a=i;a<e.length;++a){this.disassociate(e[a])}this.doRemoveRange(i,e.length-1)}for(a=0;a<i;++a){j=e[a];if(j.getData()===null){this.updateItem(j,g[a])}}for(a=i;a<g.length;++a){this.createItem(g[a],a)}this.getControl().update();h=[];f.forEach(function(b){var c=this.getItemFromElementMap(b);if(c!==null){h.push(c)}},this);this.getControl().setSelection(h)}}});