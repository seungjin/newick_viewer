Smits.PhyloCanvas.NewickParse = function(){

	var text,
	ch,
	pos,
	mLevel = 0,
	mNewickLen = 0,
	root,
	validate,
		
	object = function (parentNode) {
		var node  = new Smits.PhyloCanvas.Node();
		
		while (ch !== ')' && ch !== ',') {
			if (ch === ':'){
				next();
				node.len = Smits.Common.roundFloat(string(), 4);			// round to 4 decimal places
				if(node.len == 0){
					node.len = 0.0001;
				}
			} else if (ch === "'" || ch === '"'){ 
				node.type = "label";
				node.name = quotedString(ch);
			} else {
				node.type = "label";
				node.name = string();
			}
		}
		node.level = parentNode.level + 1;
		return node;
	},
	
	objectIterate = function(parentNode){
		var node = new Smits.PhyloCanvas.Node();
		if(parentNode){
			node.level = parentNode.level + 1;
		}
		
		while( ch !== ')' ){
			next()
			if( ch === '(' ) {
				node.children.push(objectIterate(node));
			} else {
				node.children.push(object(node));
			}
		}
		
		next();
		if(ch !== ':' && ch !== ')' && ch !== ',' && ch !== ';'){
			node.type = "label";
			node.name = string();
		}
		if(ch === ':'){
			next();
			node.len = Smits.Common.roundFloat(string(), 4);
			if(node.len == 0){
				node.len = 0.0001;
			}
			node.type = "stem";

		}
		return node;		
	},
	
	string = function(){
		var string = '';
		
		while (ch !== ':' && ch !== ')' && ch !== ',' && ch !== ';'){
			string += ch;
			next();
		}
		return string;
	},

	quotedString = function(quoteType){
		var string = '';
		
		while (ch !== quoteType){
			string += ch;
			next();
		}
		return string;
	},	
	
	next = function() {
		ch = text.charAt(pos);
		pos += 1;
		return ch;
	},
	
	recursiveProcessRoot = function(node, parentNode){
		
		if(node.children && node.children.length){
			for( var i = 0; i < node.children.length; i++ ){
				var child = node.children[i];
				child.newickLen = Smits.Common.roundFloat(child.len + node.newickLen, 4);
				if(child.level > mLevel) mLevel = child.level;
				if(child.newickLen > mNewickLen) mNewickLen = child.newickLen;
				if(child.children.length > 0){
					recursiveProcessRoot(child, node); 
				}				
			}
		}
		return node;
	};

	return function(parseText){
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
		
		
		/* CONSTRUCTOR */	
		text = parseText;
		pos = 0;
		
		next();
		root = objectIterate();
		root = recursiveProcessRoot(root);
		
	}

}();

Smits.PhyloCanvas.NewickParse.prototype = {

};