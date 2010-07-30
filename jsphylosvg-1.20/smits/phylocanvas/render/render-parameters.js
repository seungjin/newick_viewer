Smits.PhyloCanvas.Render.Parameters = {

	/* DEFAULT PARAMETERS */
	jsOverride: 0,				// If set, js will override chart's file setting
	
	/** Phylogram parameters are separated because they behave very differently **/
	
	/* Rectangular Phylogram */
	Rectangular : {
		bufferX			: 200, 			// Reduces the available canvas space for tree branches, allowing
										// for more space for the textual/charting components
		bufferY			: 40,
		bufferInnerLabels : 10, 		// Pixels
		bufferOuterLabels : 5, 			// Pixels
		minHeightBetweenLeaves : 10,  	// Should probably set pretty low, as clipping may occur if it needs to be implemented		
		
		alignRight		: false
	},
	
	/* Circular Phylogram */
	Circular : {
		bufferRadius 		: 0.33,		// Margins of Tree Circle
										// If > 1, it is in pixels
										// If < 1, it is a percentage of the full canvas size		
		bufferAngle 		: 20,		// controls split size in circle		
		initStartAngle 		: 160,		
		innerCircleRadius 	: 0,
		minHeightBetweenLeaves : 5,

		/* Labels */
		bufferInnerLabels : 2, 			// Pixels
		bufferOuterLabels : 5 			// Pixels
	},
	
	/* Charts */
	binaryCharts : [],
	barCharts : [],

		/* Binary Defaults */
		binaryChartBufferInner : 5, 
		binaryChartBufferSiblings : 0.01,
		binaryChartThickness : 15,
		binaryChartDisjointed : false,
			
		/* Bar Defaults */
		barChartBufferInner : 3,
		barChartHeight : 50,
		barChartWidth : 0.5,	// If > 1, it is in pixels
								// If < 1, it is a percentage of the node width 
						
		/* 
			Rollover Events 
				At minimum, the params object has the following properties:
					.svg
					.node
					.x
					.y
					.textEl
		*/
		mouseRollOver : function(params) {
			if(params.node.edgeCircleHighlight){
				params.node.edgeCircleHighlight.show();
			} else {
				var circleObject = params.svg.draw(
					new Smits.PhyloCanvas.Render.Circle(
						params.x, params.y, 5,
						{ attr: Smits.PhyloCanvas.Render.Style.highlightedEdgeCircle }
					)
				);
				params.node.edgeCircleHighlight = circleObject[0];
			}					
			params.textEl.attr({ fill: 'red' });
		},
		mouseRollOut : function(params) {
			params.node.edgeCircleHighlight.hide();
			params.textEl.attr({ fill: '#000' });
		},

	set : function(param, value, treeType){
		if(!this.jsOverride){
			if(treeType){
				if(treeType == 'circular'){				
					this['Circular'][param] = parseFloat(value);
				} else if (treeType == 'rectangular'){
					this['Rectangular'][param] = parseFloat(value);
				}
			} else {
				this[param] = parseFloat(value);
			}
		}
	}
};