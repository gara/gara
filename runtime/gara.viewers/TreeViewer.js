gara.provide("gara.viewers.TreeViewer","gara.viewers.AbstractTreeViewer");gara.use("gara.viewers.TreeViewerRow");gara.use("gara.widgets.Tree");gara.use("gara.widgets.TreeItem");gara.Class("gara.viewers.TreeViewer",function(){return{$extends:gara.viewers.AbstractTreeViewer,$constructor:function(a,b){this.$super();if(a instanceof gara.widgets.Tree){this.tree=a}else{this.tree=new gara.widgets.Tree(a,b)}this.hookControl(this.tree);this.cachedRow=null},createNewRowPart:function(a,b,c){if(a===null){if(c>=0){return this.getViewerRowFromItem(new gara.widgets.TreeItem(this.tree,b,c))}return this.getViewerRowFromItem(new gara.widgets.TreeItem(this.tree,b))}if(c>=0){return this.getViewerRowFromItem(new gara.widgets.TreeItem(a.getItem(),gara.NONE,c))}return this.getViewerRowFromItem(new gara.widgets.TreeItem(a.getItem(),gara.NONE))},getColumnViewerOwner:function(a){if(a<0||(a>0&&a>=this.tree.getColumnCount())){return null}if(this.tree.getColumnCount()===0){return this.tree}return this.tree.getColumn(a)},doGetColumnCount:function(){return this.tree.getColumnCount()},doGetSelection:function(){return this.tree.getSelection()},getChildren:function(a){if(a instanceof gara.widgets.TreeItem||a instanceof gara.widgets.Tree){return a.getItems().concat([])}return null},getControl:function(){return this.tree},getExpanded:function(a){return a.getExpanded()},getViewerRowFromItem:function(a){if(this.cachedRow===null){this.cachedRow=new gara.viewers.TreeViewerRow(a)}else{this.cachedRow.setItem(a)}return this.cachedRow},getTree:function(){return this.tree},newItem:function(a,b,c){var d;if(a instanceof gara.widgets.TreeItem){d=this.createNewRowPart(this.getViewerRowFromItem(a),b,c).getItem()}else{d=this.createNewRowPart(null,b,c).getItem()}return d},setExpanded:function(a,b){a.setExpanded(b)},treeRemoveAll:function(){this.tree.removeAll()}}});