Smits.PhyloCanvas.Render.Line = function(){

	return function(x1, x2, y1, y2, params){
		/* Defaults */	
		this.type = 'line';
	
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		
		if(params) {
			Smits.Common.apply(this, params);
			if(params.attr) this.attr = params.attr;
		}
		
	}
}();