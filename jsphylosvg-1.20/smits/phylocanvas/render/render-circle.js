Smits.PhyloCanvas.Render.Circle = function(){

	return function(x, y, radius, params){
		/* Defaults */	
		this.type = 'circle';
	
		this.x = x;
		this.y = y;
		this.radius = radius;
		
		if(params) {
			Smits.Common.apply(this, params);
			if(params.attr) this.attr = params.attr;
		}
		
	}
}();