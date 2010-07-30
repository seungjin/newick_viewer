Smits.PhyloCanvas.Render.CircularPhylogram = (function(){

	var svg,
		sParams = Smits.PhyloCanvas.Render.Parameters.Circular, 	// Easy Reference
		canvasX, canvasY, canvasMinEdge,
		scaleRadius, scaleAngle,
		minHeightBetweenLeaves,
		innerCircleRadius,
		firstBranch = true,
		absoluteY = 0, cx, cy, maxBranch, 
		labelsHold = [],
		bufferRadius, bufferAngle, outerRadius,
		maxLabelLength = 0,
		initStartAngle,
		rad = (Math.PI / 180);

	function secPosition(r, deg){
		deg += initStartAngle;
		return [ 
			Smits.Common.roundFloat(cx + r * Math.sin(deg * rad), 4), 
			Smits.Common.roundFloat(cy + r * Math.cos(deg * rad), 4)
		]; // x,y
	};
	function secant(r, startAngle, endAngle, params){
		var startPos = secPosition(r, startAngle);
		var endPos = secPosition(r, endAngle);
		var arr = [],
			n, inv = 0;
		
		if(Math.abs(normalizeAngle(endAngle-startAngle)) > 180) {
			n = 1;
		} else {
			n = -1;
		}
		
		// Parameter changes
		if(params && params.invertSecant){
			n *= -1;
			inv = 1;
		}
		if(params && params.noMove){
		} else {
			arr.push('M');
		}
		
		arr.push(startPos[0], startPos[1], "A", r, r, 0, n < 1 ? 0 : 1, inv, endPos[0], endPos[1]);
		return arr;
	};
	function secLinePath(deg, x1, x2, params){
		var arr = [];
		var startPos = secPosition(x1, deg);
		var endPos = secPosition(x2, deg);
		
		if(params && params.noMove){
		} else {
			arr.push('M');
		}
		arr.push(startPos[0], startPos[1], "L", endPos[0], endPos[1]);
		return arr;
	};
	function normalizeAngle(ang){
		while(ang > 360 || ang < 0){
			if(ang > 360){
				ang -= 360;
			} else if (ang < 0){
				ang += 360;
			}
		}
		return ang;
	};
	function sector(r1, r2, y1, y2){
		var arr = array_merge( "M",
			secant(
				r1, 
				y1,
				y2, 
				{ noMove: 1, invertSecant: 0}
			), "L",
			secant(
				r2, 
				y2, 
				y1, 
				{ noMove: 1, invertSecant: 1}
			),
			'Z'
		);	
		return arr;
	}
	
	function recursiveCalculateNodePositions(node, positionX){
		positionX = positionX;

		if(node.len){ // If first branch, pad only margin
			if(firstBranch){
				absoluteY = bufferAngle | 1;		// Has to be at least 1
				firstBranch = false;
			} else {
				if(node.children.length == 0) absoluteY = Smits.Common.roundFloat(absoluteY + scaleAngle, 4);
			}
		}
		
		if(node.children.length > 0){
			var nodeCoords = [], x1,x2,y1,y2;
			x1 = positionX;
			x2 = positionX += Smits.Common.roundFloat(scaleRadius * node.len, 4);
				
		
			if(node.name){ // draw bootstrap values
				
			}
			
			if(node.children && node.children.length){
				for(var i = 0; i < node.children.length; i++){
					var child = node.children[i];
					var y = recursiveCalculateNodePositions(child, positionX);
					if(y > 0) nodeCoords.push(y);					
				}
			}
			
			var minAngle = Smits.Common.roundFloat(Math.min.apply(null, nodeCoords ), 4);
			var maxAngle = Smits.Common.roundFloat(Math.max.apply(null, nodeCoords ), 4);
			
			// hack: little elbows at ends in order to prevent stair-effects at edges
			svg.draw(
				new Smits.PhyloCanvas.Render.Path(
					array_merge(
						"M", secPosition(positionX + 0.01, minAngle), 
						"L", secant(positionX, minAngle, maxAngle, {noMove: true}),
						"L", secPosition(positionX + 0.01, maxAngle)
					)
				)
			);
			
			if(node.len){ // draw stem
				y1 = Smits.Common.roundFloat( minAngle + (maxAngle-minAngle)/2, 4 );
				svg.draw(new Smits.PhyloCanvas.Render.Path(secLinePath(y1, x1, x2)));
			}			
			
		} else {			
			// LABEL
			
			// preserve for later processing
			node.y = absoluteY;
			labelsHold.push(node);
			
			x1 = positionX;
			x2 = positionX =  Smits.Common.roundFloat(positionX + (scaleRadius * node.len));
			y1 = absoluteY;
				
			svg.draw(new Smits.PhyloCanvas.Render.Path(secLinePath(y1, x1, x2)));
			svg.draw(
				new Smits.PhyloCanvas.Render.Path(
					secLinePath(y1, x2, maxBranch), 
					{ attr : Smits.PhyloCanvas.Render.Style.connectedDash }
				)
			);
			
			
			
			if(node.name){
				var pos = secPosition(maxBranch + sParams.bufferInnerLabels, y1);
				var rotateAngle = normalizeAngle( 90 + 1 - y1 - initStartAngle );
				
				if(rotateAngle > 90 && rotateAngle < 270){
					rotateAngle += 180;
					alignment = "end";
				} else {
					alignment = "start";
				}
				
				var attr = {};
				attr["text-anchor"] = alignment;
				if(node.uri) { attr.href = node.uri };
				if(node.description) {attr.title = node.description };
				
				var draw = svg.draw(
					new Smits.PhyloCanvas.Render.Text(
						pos[0], pos[1], 
						node.name,
						{
							attr: attr,
							rotate: [rotateAngle, pos[0], pos[1]]
						}
					)
				);
				
				// Rollover, Rollout and Click Events
				var pos = secPosition(x2, y1);
				if(Smits.PhyloCanvas.Render.Parameters.mouseRollOver){
					Smits.Common.addEventHandler(
						draw[0].node, 
						'mouseover', 
						Smits.PhyloCanvas.Render.Parameters.mouseRollOver, 
						{ svg: svg, node: node, x: pos[0], y: pos[1], textEl: draw[0] }
					);
				}
				if(Smits.PhyloCanvas.Render.Parameters.mouseRollOut){
					Smits.Common.addEventHandler(
						draw[0].node, 
						'mouseout', 
						Smits.PhyloCanvas.Render.Parameters.mouseRollOut, 
						{ svg: svg, node: node, x: pos[0], y: pos[1], textEl: draw[0] }
					);				
				}
				if(Smits.PhyloCanvas.Render.Parameters.onClickAction){
					Smits.Common.addEventHandler(
						draw[0].node, 
						'click', 
						Smits.PhyloCanvas.Render.Parameters.onClickAction, 
						{ svg: svg, node: node, x: pos[0], y: pos[1], textEl: draw[0] }
					);							
				}
				
				maxLabelLength = Math.max(draw[1], maxLabelLength);
			}
		}
		return y1;
	};

	
	function array_merge(arr) {
		var merged = arr;
		for (var i = 1; i < arguments.length; i++) {
			merged = merged.concat(arguments[i]);
		}
		return merged;
	};
	
	function renderBackground(){
		var arr = [];
		
		
		var arr = sector(
			maxBranch, 
			maxBranch + maxLabelLength + sParams.bufferOuterLabels, 
			(bufferAngle | 1) + (scaleAngle/2), 
			360  + (scaleAngle/2) + 0.999
		);
		
		var bgObj = svg.draw(
			new Smits.PhyloCanvas.Render.Path(
				arr, 
				{ attr: Smits.PhyloCanvas.Render.Style.textSecantBg }
			)
		);
		
		bgObj[0].toBack(); 		// Put it behind the labels
		
		return maxBranch + maxLabelLength + sParams.bufferOuterLabels;
	};
	
	function renderBinaryChart(outerRadius, groupName, params){
		var bufferInner = (params && params.bufferInner ? params.bufferInner : 0) | Smits.PhyloCanvas.Render.Parameters.binaryChartBufferInner,
			bufferSiblings = (params && params.bufferSiblings ? params.bufferSiblings * scaleAngle : 0) | (Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings < 1 ? scaleAngle * Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings : Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings),
			thickness = (params && params.thickness ? params.thickness : 0) | Smits.PhyloCanvas.Render.Parameters.binaryChartThickness,
			disjointed = (params && params.disjointed ? params.disjointed : false) | Smits.PhyloCanvas.Render.Parameters.binaryChartDisjointed,
			isFirst = true,
			beginY;
			
		for(var i = 0; i < labelsHold.length; i++){
			var node = labelsHold[i];
			if( !labelsHold[i+1] || node.chart[groupName] !== labelsHold[i+1].chart[groupName] || disjointed){
				svg.draw(
					new Smits.PhyloCanvas.Render.Path(
						sector( 
							outerRadius + bufferInner,  
							outerRadius + bufferInner + thickness, 
							(beginY ? beginY : node.y) - (scaleAngle/2) + (isFirst && !disjointed ? 0 : (bufferSiblings/2)), 
							node.y + (scaleAngle/2) - (i == labelsHold.length-1 && !disjointed ? 0 : (bufferSiblings/2))
						),
						{ attr: Smits.PhyloCanvas.Render.Style.getStyle(node.chart[groupName], 'textSecantBg') }
					)
				);			
				beginY = 0;
				isFirst = false;
			} else {
				if(!beginY){ beginY = node.y; }
			}
			isFirst = false;
		}
		return outerRadius + bufferInner + thickness;
	};
	
	function renderBarChart(outerRadius, groupName, params){
		var allValues = [], maxValue,
			bufferInner = params && params.bufferInner ? params.bufferInner : 0 | Smits.PhyloCanvas.Render.Parameters.barChartBufferInner,
			height = params && params.height ? params.height : 0 | Smits.PhyloCanvas.Render.Parameters.barChartHeight,
			width = params && params.width ? (params.width < 1 ? scaleAngle * params.width : params.width ) : 0 | (Smits.PhyloCanvas.Render.Parameters.barChartWidth < 1 ? scaleAngle * Smits.PhyloCanvas.Render.Parameters.barChartWidth : Smits.PhyloCanvas.Render.Parameters.barChartWidth),
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
						sector( 
							outerRadius + bufferInner,  
							outerRadius + bufferInner + (scaleHeight * node.chart[groupName]), 
							node.y - (width/2), 
							node.y + (width/2)
						),
						{ attr: Smits.PhyloCanvas.Render.Style.getStyle(node.chart[groupName], 'barChart') }
					)
				);					
		}
		
		return outerRadius + bufferInner + height;
	};
	
	return function(sSvg, dataObject, bufferRadius){
		/* Privileged Methods */
		this.getCanvasSize = function(){
			return [canvasX, canvasY];
		};
		this.getRoot = function(){
			return dataObject.getRoot();
		};
	
		/* CONSTRUCTOR */
		// Validation
		if(dataObject.getValidate()){   
			sSvg.draw({type: 'text', x: 0, y: sSvg.canvasSize[1] / 3, text: dataObject.getValidate() });
			return
		}				
		
		// Properties Setup
		svg 			= sSvg;
		var node 		= dataObject.getRoot();
		var mNewickLen 	= dataObject.getNewickLen();
		canvasX 		= svg.canvasSize[0];															// Full Canvas Width
		canvasY 		= svg.canvasSize[1];															// Full Canvas Height
		cx 				= canvasX / 2;																	// Set Center Position
		cy 				= canvasY / 2;
		canvasMinEdge 	= Math.min.apply(null, [canvasX,canvasY]);
		
		bufferRadius		= (sParams.bufferRadius > 1) ? sParams.bufferRadius : Smits.Common.roundFloat(canvasMinEdge * sParams.bufferRadius, 4);
		bufferAngle 		= sParams.bufferAngle;							// controls split size in circle		
		innerCircleRadius	= sParams.innerCircleRadius;
		minHeightBetweenLeaves	= sParams.minHeightBetweenLeaves;
		initStartAngle		= sParams.initStartAngle;						// Angle at which the entire tree is rotated
		
		maxBranch			= Math.round( (canvasMinEdge - bufferRadius - innerCircleRadius) / 2);		// maximum branch length
		scaleRadius			= (maxBranch - innerCircleRadius) / mNewickLen;								// scale multiplier to use
		scaleAngle 			= Smits.Common.roundFloat( (360 - bufferAngle) / node.getCountAllChildren(), 4 );		

		// Draw Nodes and Labels
		recursiveCalculateNodePositions(node, innerCircleRadius);

		// Draw Background behind labels
		outerRadius = renderBackground();
		
		// Draw secant highlights
		if(Smits.PhyloCanvas.Render.Parameters.binaryCharts.length){
			var binaryCharts = Smits.PhyloCanvas.Render.Parameters.binaryCharts;
			for(var i in binaryCharts){
				outerRadius = renderBinaryChart(outerRadius, binaryCharts[i].chart, binaryCharts[i]);
			}
		}

		// Draw Bar Chart
		if(Smits.PhyloCanvas.Render.Parameters.barCharts.length){
			var barCharts = Smits.PhyloCanvas.Render.Parameters.barCharts;
			for(var i in barCharts){
				outerRadius = renderBarChart(outerRadius, barCharts[i].chart, barCharts[i]);
			}
		}		
	}
})();

Smits.PhyloCanvas.Render.CircularPhylogram.prototype = {

};