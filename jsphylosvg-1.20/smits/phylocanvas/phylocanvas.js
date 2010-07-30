Smits.PhyloCanvas = function(){
	var phylogram,
		divId,
		newickObject,
		svg;

	return function(inputFormat, sDivId, canvasWidth, canvasHeight, type){
		/* Privileged Methods */
		this.getNewickObject = function(){
			return newickObject;
		};
		this.clear = function(){
		
		};
		this.scale = function(multiplier){
			svg.svg.scale(multiplier);
		};
		this.getSvg = function(){
			return svg;
		};
		this.getPhylogram = function(){
			return phylogram;
		};
	
		/* CONSTRUCTOR */

		// Process dataset -- assume newick format, else needs to provide format
		if(typeof inputFormat === "object"){
			if(inputFormat.xml){
				if(!inputFormat.fileSource){
					var xj = XMLObjectifier.textToXML(inputFormat.xml); 			// assume we need to clean it up
				} else {
					var xj = inputFormat.xml;
				}
				xj = XMLObjectifier.xmlToJSON(xj);
				dataObject = new Smits.PhyloCanvas.JsonParse(xj)
			} else if(inputFormat.json){
				dataObject = new Smits.PhyloCanvas.JsonParse(inputFormat.json);
			} else {
				alert('Please set the format of input data');
			}
		} else {
			dataObject = new Smits.PhyloCanvas.NewickParse(inputFormat);
		}

		divId = sDivId;
		svg = new Smits.PhyloCanvas.Render.SVG( divId, canvasWidth, canvasHeight );
		
			/* FACTORY */
		if(type == "circular"){
			phylogram = new Smits.PhyloCanvas.Render.CircularPhylogram(
				svg, 
				dataObject
			);		
		} else {
			phylogram = new Smits.PhyloCanvas.Render.Phylogram(
				svg,
				dataObject
			);			
		}		
		
	}
	
}();

Smits.PhyloCanvas.prototype = {
};