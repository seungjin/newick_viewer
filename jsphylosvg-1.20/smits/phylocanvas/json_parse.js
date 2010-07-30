Smits.PhyloCanvas.JsonParse = function(){

	var mLevel = 0,
	mNewickLen = 0,
	root,
	validate,
		
	recursiveParse = function(clade, parentNode){
		var node = new Smits.PhyloCanvas.Node();
		if(parentNode){
			node.level = parentNode.level + 1;
		}
		
		if(clade.clade && clade.clade.length){
			for(var i = 0; i < clade.clade.length; i++){
				var thisClade = clade.clade[i];
				node.children.push(recursiveParse(thisClade, node));
			}
		}
		if(clade.branch_length){	// Branches can be attributes or own element
			if(typeof clade.branch_length === 'object'){
				clade.branch_length = clade.branch_length[0].Text;
			}

			node.len = Smits.Common.roundFloat(clade.branch_length, 4);			// round to 4 decimal places
			if(node.len == 0){
				node.len = 0.0001;
			}			
		}
		if(clade.name){
			node.type = 'label';
			node.name = clade.name[0].Text;
		} 

		/* Collect further info that might be used as a label */
		if (clade.sequence && clade.sequence[0] && clade.sequence[0].name && clade.sequence[0].name[0] && clade.sequence[0].name[0].Text){
			node.sequenceName = clade.sequence[0].name[0].Text;
		}
		if (clade.taxonomy && clade.taxonomy[0]){
			if(clade.taxonomy[0].scientific_name && clade.taxonomy[0].scientific_name[0] && clade.taxonomy[0].scientific_name[0].Text){
				node.taxonomyScientificName = clade.taxonomy[0].scientific_name[0].Text;
			}
			if (clade.taxonomy[0].common_name  && clade.taxonomy[0].common_name[0] && clade.taxonomy[0].common_name[0].Text){
				node.taxonomyCommonName = clade.taxonomy[0].common_name[0].Text;
			}
		}
		if (clade.sequence && clade.sequence[0] && clade.sequence[0].accession && clade.sequence[0].accession[0] && clade.sequence[0].accession[0].Text){
			node.sequenceAccession = clade.sequence[0].accession[0].Text;
		}
		if (clade.point ){
			node.LatLong = [clade.point[0].lat[0].Text, clade.point[0]['long'][0].Text];
		}		

		
		/* Prioritization of Label */
		if(!node.name){
			if(node.sequenceName){
				node.name = node.sequenceName;
			} else if (node.taxonomyScientificName){
				node.name = node.taxonomyScientificName;
			} else if (node.taxonomyCommonName){
				node.name = node.taxonomyCommonName;
			} else if (node.sequenceAccession){
				node.name = node.sequenceAccession;
			}
			if(node.name){	// if name is now set, type is 'label'
				node.type = 'label'; 
			}
		}
		
		if(clade.annotation){
			if(clade.annotation[0] && clade.annotation[0].desc && clade.annotation[0].desc[0] && clade.annotation[0].desc[0].Text){
				node.description = clade.annotation[0].desc[0].Text;
			}
			if(clade.annotation[0] && clade.annotation[0].uri && clade.annotation[0].uri[0] && clade.annotation[0].uri[0].Text){
				node.uri = clade.annotation[0].uri[0].Text;
			}
		}
		if(clade.chart){
			if(clade.chart[0]){
				for(var i in clade.chart[0]){
					if(i != 'Text' && i != '_children'){
					node.chart[i] = clade.chart[0][i][0].Text;
					}
				}
			}
			
		}
		
		// Validation
		if(node && node.level > 1){
			if(!node.len){
				validate = 'Error. Please include Branch Lengths - we only draw rooted phylogenetic trees.';
			}
		}
			
		return node;
	}
	
	recursiveProcessRoot = function(node, parentNode){
		if(node.children && node.children.length){
			for( var i = 0; i < node.children.length; i++){
				var child = node.children[i];
				child.newickLen = Math.round( (child.len + node.newickLen) *10000)/10000;
				if(child.level > mLevel) mLevel = child.level;
				if(child.newickLen > mNewickLen) mNewickLen = child.newickLen;
				if(child.children.length > 0){
					recursiveProcessRoot(child, node); 
				}				
			}
		}
		return node;
	};
	recursiveProcessParameters = function(parametersEl, treeType){
		for (var i in parametersEl){
			if(i != '_children' && i != 'Text'){
				if(i == 'rectangular' || i == 'circular'){
					recursiveProcessParameters(parametersEl[i][0], i);
				} else {
					if(!Smits.PhyloCanvas.Render.Parameters[i]) {  Smits.PhyloCanvas.Render.Parameters[i] = {}; };
					Smits.PhyloCanvas.Render.Parameters.set(i, parametersEl[i][0].Text, treeType);
				}
			}
		}
		return;
	};

	return function(jsonString){
		/* Privileged Methods */
		this.getRoot = function(){
			return root;
		};
		this.getLevels = function(){
			return mLevel;
		};
		this.getNewickLen = function(){
			return mNewickLen;
		};		
		this.getValidate = function(){
			return validate;
		};
		
		
		j = jsonString;
		/* CONSTRUCTOR */	
		if(jsonString.phylogeny && jsonString.phylogeny[0] && jsonString.phylogeny[0].clade){
			root = recursiveParse(jsonString.phylogeny[0].clade[0]);
		}
		
		
		if(jsonString.phylogeny && jsonString.phylogeny[0] && jsonString.phylogeny[0].render && jsonString.phylogeny[0].render[0]){
			var render = jsonString.phylogeny[0].render[0];
			
			// Custom Styles
			if(render && render.styles){
				var styles = render.styles[0];
				for (var i in styles){
					if(i != '_children' && i != 'Text'){
						if(!Smits.PhyloCanvas.Render.Style[i]) {  Smits.PhyloCanvas.Render.Style[i] = {}; };
						for(var j in styles[i][0]){
							if(j != '_attributes'){
								Smits.PhyloCanvas.Render.Style[i][j.replace('_', '-')] = styles[i][0][j];		// This is quite painful, as xml does not allow dashes
							}
						}
						
						
					}
				}
			}
			
			// Custom Parameters
			if(render && render.parameters){
				recursiveProcessParameters(render.parameters[0]);
			}			
			
			// Charts
			if(render && render.charts){
				var charts = render.charts[0];
				for (var i in charts){
					if(i != '_children' && i != 'Text'){
						for(var j in charts[i]){
							if(charts[i][j].type == "binary"){
								charts[i][j].chart = i;
								Smits.PhyloCanvas.Render.Parameters.binaryCharts.push(charts[i][j]);
							} else if (charts[i][j].type == "bar"){
								charts[i][j].chart = i;
								Smits.PhyloCanvas.Render.Parameters.barCharts.push(charts[i][j]);
							}
						}
					}
				}
			}			
			
		}
		
		root = recursiveProcessRoot(root);

	}

}();

Smits.PhyloCanvas.JsonParse.prototype = {

};