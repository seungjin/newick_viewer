Smits.PhyloCanvas.Render.SVG = function(){
	var divId,
		canvasSize;
		
	return function(sDivId, canvasWidth, canvasHeight){
	
	
	
	
	
		/* CONSTRUCTOR */
		divId = sDivId;
		this.canvasSize = [canvasWidth, canvasHeight];
		
		this.svg = Raphael(sDivId, this.canvasSize[0], this.canvasSize[1]);
		
	}
	
}();

Smits.PhyloCanvas.Render.SVG.prototype = {

	render : function(){
		var instructs = this.phylogramObject.getDrawInstructs();
		
		for (var i = 0; i < instructs.length; i++) {
		   if(instructs[i].type == 'line'){
				var line = this.svg.path(["M", instructs[i].x1, instructs[i].y1, "L", instructs[i].x2, instructs[i].y2]).attr(Smits.PhyloCanvas.Render.Style.line);
			} else if(instructs[i].type == 'path'){
				var path = this.svg.path(instructs[i].path).attr(instructs[i].attr);			
			} else if(instructs[i].type == 'circle'){
				var path = this.svg.circle(instructs[i].x, instructs[i].y, instructs[i].radius).attr({
					"stroke": 'red'
				});
			} else {
				var text = this.svg.text(instructs[i].x, instructs[i].y, instructs[i].text).attr(Smits.PhyloCanvas.Render.Style.text);
				if(instructs[i].attr){
					text.attr(instructs[i].attr);
				}
				if(instructs[i].rotate){
					text.rotate(instructs[i].rotate);
				}
				
				var bbox = text.getBBox();
				var hyp = Math.sqrt( (bbox.height * bbox.height) + (bbox.width * bbox.width) );	// get hypotenuse
				
			} 
		}
	},
	
	draw : function(instruct){
		var obj, 
			param;
			
	   if(instruct.type == 'line'){
			obj = this.svg.path(["M", instruct.x1, instruct.y1, "L", instruct.x2, instruct.y2]).attr(Smits.PhyloCanvas.Render.Style.line);
		} else if(instruct.type == 'path'){
			obj = this.svg.path(instruct.path).attr(instruct.attr);			
		} else if(instruct.type == 'circle'){
			obj = this.svg.circle(instruct.x, instruct.y, instruct.radius).attr({
				"stroke": 'red'
			});
		} else if(instruct.type == 'text'){
			obj = this.svg.text(instruct.x, instruct.y, instruct.text).attr(Smits.PhyloCanvas.Render.Style.text);
			if(instruct.attr){
				obj.attr(instruct.attr);
			}
			if(instruct.rotate){
				obj.rotate(instruct.rotate);
			}
			
			var bbox = obj.getBBox();
			param = Math.sqrt( (bbox.height * bbox.height) + (bbox.width * bbox.width) );	// get hypotenuse
		} 
			
		return [obj, param];
	}

};