Smits.Common = {
	nodeIdIncrement : 0,
	activeNode: 0,
	
	/* Rounds float to a defined number of decimal places */
	roundFloat : function(num, digits){
		var i = 0, 
			dec = 1;
		while(i < digits){
			dec *= 10;
			i++;
		}
		return Math.round(num*dec)/dec; 
	},
	
	/* Copies properties from one object to another */
	apply : function(obj, extObj){
		if (obj && typeof extObj == 'object') {
			for (var key in extObj) {
				obj[key] = extObj[key];
			}
		}
		return obj;	
	},
	
	addEventHandler : function(el, eventType, fn, paramsObj){
		try{
			el.addEventListener(
				eventType,
				(function(fn, args){
					return(
						function(e,o) {
							var params = paramsObj;
							params.e = e;
							fn(params);
						}
					);
				}(fn, paramsObj)),
				false
			);
		} catch (err){}
	}


};