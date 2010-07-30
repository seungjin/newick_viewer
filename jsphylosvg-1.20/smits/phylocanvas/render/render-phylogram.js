Smits.PhyloCanvas.Render.Phylogram = (function(){

	var svg,
	sParams = Smits.PhyloCanvas.Render.Parameters.Rectangular, 	// Easy Reference
	canvasX, canvasY,
	scaleX, scaleY, maxBranch,
	minHeightBetweenLeaves,
	firstBranch = true,
	absoluteY = 0, maxLabelLength = 0,
	bufferX, bufferY, labelsHold = [];
	
	function textPadding(y){
		return y + Math.round(y / 4);
	};
	function rectLinePathArray(x1, y1, x2, y2){
		return ["M", x1, y1, "L", x2, y1, "L", x2, y2, "L", x1, y2, "Z"];
	};
	
	function recursiveCalculateNodePositions(node, positionX){
		if(node.len){ 
			if(firstBranch){
				firstBranch = false;
			} else {
				if(node.children.length == 0) absoluteY = Smits.Common.roundFloat(absoluteY + scaleY, 4);
			}
		}
		
		if(node.children.length > 0){
			var nodeCoords = [], x1,x2,y1,y2;
			if(node.len){ // draw stem
				x1 = positionX;
				x2 = positionX = Smits.Common.roundFloat(positionX + (scaleX * node.len), 4);
				y1 = absoluteY + (((1 + node.getCountAllChildren()) * scaleY) / 2);
				y2 = y1;

				svg.draw(new Smits.PhyloCanvas.Render.Line(x1, x2, y1, y2));
			}
			
			if(node.name){ // draw bootstrap values
				svg.draw(new Smits.PhyloCanvas.Render.Text(x2 + 5, y2, node.name));
			}
			
			if(node.children && node.children.length){
				for(var i = 0; i < node.children.length; i++){
					var child = node.children[i];
					nodeCoords.push(recursiveCalculateNodePositions(child, positionX));
				}
			}
			
			var flatNodeCoords = []; // establish vertical bounds
			for ( var i = 0; i < nodeCoords.length; i++ ){
				if(nodeCoords[i][0]) flatNodeCoords.push(nodeCoords[i][0]);
				if(nodeCoords[i][1]) flatNodeCoords.push(nodeCoords[i][1]);
			}
			var verticalY1 = Math.min.apply(null, flatNodeCoords );
			var verticalY2 = Math.max.apply(null, flatNodeCoords);
			
			// draw vertical
			// hack: little elbows at ends in order to prevent stair-effects at edges
			svg.draw( 
				new Smits.PhyloCanvas.Render.Path( 
					[
						"M", positionX + 0.0001, verticalY1,
						"L", positionX, verticalY1,
						"L", positionX, verticalY2,
						"L", positionX + 0.0001, verticalY2
					]
				)
			);
			
		} else {
			// label
			x1 = positionX;
			x2 = Smits.Common.roundFloat(positionX + (scaleX * node.len), 2);
			y1 = absoluteY;
			y2 = absoluteY;
				
			// preserve for later processing
			node.y = absoluteY;
			labelsHold.push(node);				
				
			svg.draw(new Smits.PhyloCanvas.Render.Line(x1, x2, y1, y2));
			if(sParams.alignRight){
				svg.draw(
					new Smits.PhyloCanvas.Render.Path(
						["M", x2, y1, "L", maxBranch, y2],
						{ attr : Smits.PhyloCanvas.Render.Style.connectedDash }
					)
				);			
			}
			
			if(node.name){
				var attr = {};
				attr["text-anchor"] = 'start';
				if(node.uri) { attr.href = node.uri };
				if(node.description) {attr.title = node.description };
				
				var draw = svg.draw(
					new Smits.PhyloCanvas.Render.Text(
						sParams.alignRight ? maxBranch + sParams.bufferInnerLabels : x2 + sParams.bufferInnerLabels, y2,
						node.name,
						{
							attr: attr
						}
					)
				);				
				maxLabelLength = Math.max(draw[1], maxLabelLength);
				
				// Rollover, Rollout and Click Events
				if(Smits.PhyloCanvas.Render.Parameters.mouseRollOver){
					Smits.Common.addEventHandler(
						draw[0].node, 
						'mouseover', 
						Smits.PhyloCanvas.Render.Parameters.mouseRollOver, 
						{ svg: svg, node: node, x: x2, y: y2, textEl: draw[0] }
					);
				}
				if(Smits.PhyloCanvas.Render.Parameters.mouseRollOut){
					Smits.Common.addEventHandler(
						draw[0].node, 
						'mouseout', 
						Smits.PhyloCanvas.Render.Parameters.mouseRollOut, 
						{ svg: svg, node: node, x: x2, y: y2, textEl: draw[0] }
					);				
				}
				if(Smits.PhyloCanvas.Render.Parameters.onClickAction){
					Smits.Common.addEventHandler(
						draw[0].node, 
						'mouseout', 
						Smits.PhyloCanvas.Render.Parameters.onClickAction, 
						{ svg: svg, node: node, x: x2, y: y2, textEl: draw[0] }
					);				
				}
			}
		
		}
		
		return [y1, y2];

	};
	
	function renderBinaryChart(x, groupName, params){
		var bufferInner = (params && params.bufferInner ? params.bufferInner : 0) | Smits.PhyloCanvas.Render.Parameters.binaryChartBufferInner,
			bufferSiblings = (params && params.bufferSiblings ? params.bufferSiblings * scaleY : 0) | (Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings < 1 ? scaleY * Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings : Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings),		
			thickness = (params && params.thickness ? params.thickness : 0) | Smits.PhyloCanvas.Render.Parameters.binaryChartThickness,
			beginY;
			
		for(var i = 0; i < labelsHold.length; i++){
			var node = labelsHold[i];
			svg.draw(
				new Smits.PhyloCanvas.Render.Path(
					rectLinePathArray(
						x + bufferInner,
						node.y - (scaleY/2) + (bufferSiblings/2),
						x + bufferInner + thickness, 
						node.y + (scaleY/2) - (bufferSiblings/2)
					),
					{ attr: Smits.PhyloCanvas.Render.Style.getStyle(node.chart[groupName], 'textSecantBg') }
				)
			);			
		}
		return x + bufferInner + thickness;
	};
	
	function renderBarChart(x, groupName, params){
		var allValues = [], maxValue,
			bufferInner = params && params.bufferInner ? params.bufferInner : 0 | Smits.PhyloCanvas.Render.Parameters.barChartBufferInner,
			height = params && params.height ? params.height : 0 | Smits.PhyloCanvas.Render.Parameters.barChartHeight,
			width = params && params.width ? (params.width < 1 ? scaleY * params.width : params.width ) : 0 | (Smits.PhyloCanvas.Render.Parameters.barChartWidth < 1 ? scaleY * Smits.PhyloCanvas.Render.Parameters.barChartWidth : Smits.PhyloCanvas.Render.Parameters.barChartWidth),
			scaleHeight = 0;
		
		// Need to get max value
		for(var i = 0; i < labelsHold.length; i++){
			allValues.push(labelsHold[i].chart[groupName]);
		}
		maxValue = Math.max.apply(null, allValues);
		scaleHeight = Smits.Common.roundFloat(height / maxValue, 4);
		
		for(var i = 0; i < labelsHold.length; i++){
			var node = labelsHold[i];
			svg.draw(
					new Smits.PhyloCanvas.Render.Path(
						rectLinePathArray(
							x + bufferInner,
							node.y - (width/2),
							x + bufferInner + (scaleHeight * node.chart[groupName]), 
							node.y + (width/2)
						),					
						{ attr: Smits.PhyloCanvas.Render.Style.getStyle(node.chart[groupName], 'barChart') }
					)
				);					
		}
		
		return x + bufferInner + height;
	};
	
	return function(sSvg, dataObject){	
		/* Privileged Methods */
		this.getCanvasSize = function(){
			return [canvasX, canvasY];
		};		
		this.getRoot = function(){
			return dataObject.getRoot();
		};
		
		/* CONSTRUCTOR */
		if(dataObject.getValidate()){   // Validate
			svg.draw(0,0, dataObject.getValidate());
		}
		
		svg = sSvg;
		var node = dataObject.getRoot();
		var mNewickLen = dataObject.getNewickLen();
		
		canvasX = svg.canvasSize[0];			// Full Canvas Width
		canvasY = svg.canvasSize[1];			// Full Canvas Height
		
		bufferX = sParams.bufferX;
		bufferY = sParams.bufferY;
		minHeightBetweenLeaves = sParams.minHeightBetweenLeaves;
				
		scaleX = Math.round((canvasX - bufferX) / mNewickLen);
		scaleY = Math.round((canvasY - bufferY) / node.getCountAllChildren());
		if(scaleY < minHeightBetweenLeaves){
			scaleY = minHeightBetweenLeaves;
		}
		maxBranch = Math.round( canvasX - bufferX );	
		
		if(Smits.PhyloCanvas.Render.Parameters.binaryCharts.length || Smits.PhyloCanvas.Render.Parameters.barCharts.length){
			sParams.alignRight = true;
		}
		
		recursiveCalculateNodePositions(node, 0);
		
		
		outerX = maxBranch + maxLabelLength + sParams.bufferInnerLabels;
		// Draw secant highlights
		if(Smits.PhyloCanvas.Render.Parameters.binaryCharts.length){
			var binaryCharts = Smits.PhyloCanvas.Render.Parameters.binaryCharts;
			for(var i in binaryCharts){
				outerX = renderBinaryChart(outerX, binaryCharts[i].chart, binaryCharts[i]);
			}
		}		
		
		// Draw Bar Chart
		if(Smits.PhyloCanvas.Render.Parameters.barCharts.length){
			var barCharts = Smits.PhyloCanvas.Render.Parameters.barCharts;
			for(var i in barCharts){
				outerRadius = renderBarChart(outerX, barCharts[i].chart, barCharts[i]);
			}
		}				

	}
})();

Smits.PhyloCanvas.Render.Phylogram.prototype = {

};