Smits.PhyloCanvas.Render.Text = function(){

	return function(x, y, text, params){
		/* Defaults */
		this.type = 'text';
		
		this.x = x;
		this.y = y;
		this.text = text;
		
		if(params) {
			Smits.Common.apply(this, params);
			if(params.attr) this.attr = params.attr;
		}
	}
}();