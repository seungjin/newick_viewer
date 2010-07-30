Smits.PhyloCanvas.Render.Path = function(){
	var attr = Smits.PhyloCanvas.Render.Style.path;
	
	return function(path, params){
		/* Defaults */
		this.type = 'path';
		
		this.path = path;
		if(params) {
			Smits.Common.apply(this, params);
			if(params.attr) this.attr = params.attr;
		}
		
	}
}();