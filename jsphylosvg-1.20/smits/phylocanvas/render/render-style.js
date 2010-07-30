Smits.PhyloCanvas.Render.Style = {

	/* Default Styles */
	
	line: {
		"stroke": 		'rgb(0,0,0)',
		"stroke-width":	1
	},
	
	text: {
		"font-family":	'Verdana',
		"font-size":	12,
		"text-anchor":	'start'
	},
	
	path: {
		"stroke": 		'rgb(0,0,0)',
		"stroke-width":	1	
	},
	
	connectedDash : {
		"stroke": 			'rgb(200,200,200)',
		"stroke-dasharray":	". "
	},
	
	textSecantBg : {
		"fill": 	'#EEE',
		"stroke":	'#DDD'
	},
	
	highlightedEdgeCircle : {
		"fill": 	'red'
	},
	
	barChart : {
		fill:		'#003300',
		stroke:		'#DDD'
	},
	
	getStyle : function(requestStyle, fallbackStyle){
		if(this[requestStyle]){
			return this[requestStyle];
		} else {
			return this[fallbackStyle];
		}
	
	}



};