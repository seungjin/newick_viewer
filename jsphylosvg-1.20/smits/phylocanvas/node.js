Smits.PhyloCanvas.Node = function(){
	
	/**
	* Node Class
	* Allows objects to be traversed across children
	*
	*/
	return function(o, parentInstance){
		// initiate object
		this.id = Smits.Common.nodeIdIncrement += 1;
		this.level = 0;
		this.len = 0;
		this.newickLen = 0;
		this.name = '';
		this.type = '';
		this.chart = {};
		
		if(o) Smits.Common.apply(this, o);
			
		this.children = new Array();
		
		if(parentInstance){
			parentInstance.children.push(this); 
		}
	}
}();


Smits.PhyloCanvas.Node.prototype = {
	
	getCountAllChildren : function(){
		var nodeCount = 0;

		for (var key in this.children) {
			var child = this.children[key];
			if(child.children && child.children.length > 0){
				nodeCount += child.getCountAllChildren();
			} else {
				nodeCount ++;
			}			
		}
		return nodeCount;
	}
	
};