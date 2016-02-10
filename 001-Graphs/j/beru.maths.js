Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

var filterArray = function( w, a){
	if(w==""){
		return a;
	}else{
		if(getType(a)=="array"){
			if( getType(w)!= "string" ) w = w.toString();
			var na = [];
			for (var i = 0; i < a.length; i++) {
				if( ifVectorContainWord2( w , a[i] ) ){  // o ifVectorContainWord2
					na.push( a[i] );
				}
			}
			return na;
		}else{
			return console.log('Argument 2 is not an Array.');
		}
	}
}

var ifVectorContainWord0 = function( wA ,wB){
	if(wA=="" || wB=="" || !wA || !wB){
		return false;
	}else{
		if( getType(wA)!= "string" ) wA = wA.toString();
		if( getType(wB)!= "string" ) wB = wB.toString();
		var a =  wA.length;		//word search
	    var b = wB.length;		//word Vector
	    var d = b-a;
	    if(wA.toLowerCase()==wB.toLowerCase()){
	    	return true;
	    }else{
	        return false;
	    }
	}    
}


var ifVectorContainWord1 = function( wA ,wB){
	if(wA=="" || wB=="" || !wA || !wB){
		return false;
	}else{
		if( getType(wA)!= "string" ) wA = wA.toString();
		if( getType(wB)!= "string" ) wB = wB.toString();
	    var a =  wA.length;		//word search
	    var b = wB.length;		//word Vector
	    var c = "";
	    if(a<=b){
	        for (var i = 0; i < a; ++i){
	            c += wB[i].charAt(0);
	        }
	        if(c.toUpperCase() ===  wA.toUpperCase()){
	            if( wA=="") return false;
	            else return true;
	        }else{
	            return false;
	        }
	    }else{
	        return false;
	    }
	}
}

var ifVectorContainWord2 = function( wA ,wB){
	if(wA=="" || wB=="" || !wA || !wB){
		return false;
	}else{
		if( getType(wA)!= "string" ) wA = wA.toString();
		if( getType(wB)!= "string" ) wB = wB.toString();
		var a =  wA.length;		//word search
	    var b = wB.length;		//word Vector
	    var d = b-a;
	    if(a<=b){
	        for(var i=0;i<=d;i++){
				var c = "";
				for(var j=0;j<wA.length;j++){
					c+=wB.charAt(j+i);
				}
				if(wA.toUpperCase()==c.toUpperCase()){
					return true;
				}
			}
			return false;
	    }else{
	        return false;
	    }
	}    
}

var valueInVector = function( value, vector){
	if(value=="" || vector=="" || !value || !vector){
		return false;
	}else{
		if( getType(value)!= "number" ) value = parseInt(value);
	    for (var i = 0; i < vector.length; i++) {
	    	if(value == vector[i]) return true;
	    }
	    return false;
	}    
}

var isWordinInput = function(id){
	if(document.getElementById(id).value == "") return false;
	else return true;
}

var addFilterToInput = function(id,vector){
	var input = document.getElementById(id);
	if(input.nodeName=="INPUT"){
		if(input){
			input.addEventListener("focus", onfocus);
			input.addEventListener("blur", onblur);
			input.addEventListener("keyup", onkeyup);
			input.addEventListener("keypress", onkeypress);

			input.onfocus = function(event){
				createList(id, input.value, vector);
			}

			input.onblur = function(event){
				deleteList();
			}

			input.onkeyup = function(event){
				if(event.keyCode==13) this.blur();
				createList(id, input.value, vector);
			}

			input.onkeypress = function(event){
				deleteList();
			}

			function createList( id, val, vector){
				list = filterArray( val, vector );
				var t = document.getElementById(id).getBoundingClientRect().top + document.getElementById(id).getBoundingClientRect().height + document.body.scrollTop;
				var l = document.getElementById(id).getBoundingClientRect().left + document.body.scrollLeft;
				var w = document.getElementById(id).getBoundingClientRect().width;
				var h = document.getElementById(id).getBoundingClientRect().height;
				var UL = document.createElement('UL');
				UL.setAttribute("id", id.concat("-List") );
				UL.setAttribute("class", "classUL-".concat(id) );
				for (var i = 0; i < list.length; i++) {
					var LI = document.createElement('LI');
				    LI.setAttribute("id", ID.concat("-",list[i]) );
				    LI.setAttribute("class", "classLI-".concat(id) );
				    LI.setAttribute("style", "position:absolute;");
				    LI.setAttribute("width", w.concat("px") );
				    LI.setAttribute("height", h.concat("px") );
				    LI.style.top = t+"px";
				    LI.style.left = l+"px";
				    LI.appendChild( document.createTextNode( list[i] ) );
					UL.appendChild(LI);
				}
				insertElementAfter(UL, input);
			}

			function deleteList( id){
			    document.getElementById( id.concat("-List") ).remove();
			}
		}
	}else{
		console.log("This is not a INPUT.");
	}
}

var getType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

var insertElementAfter = function( insertElement,element ){
	if(!insertElement || !element) return;
	for(var i=0;i<element.parentElement.childNodes.length;i++){
   		if( element.parentElement.childNodes[i]==element) element.parentElement.insertBefore(insertElement, element.parentElement.childNodes[i+1]); 
	}
}

function getArrayCompared( v1, v2, condition){
	var newArray = [];
	var equals = [];
	if(getType(v1)=="array" && getType(v2)=="array"){
		if(v1.length>v2.length){
			for (var i = 0; i < v1.length; i++) {
				equals.push( false );
				for (var j = 0; j < v2.length; j++) {
					if(v1[i]==v2[j]) equals[i]=true;
				}
			}
			for (var i = 0; i < equals.length; i++) {
				if(condition && equals[i]) newArray.push(v1[i]);
				if(!condition && !equals[i]) newArray.push(v1[i]);
			}
			return newArray;
		}else{
			for (var i = 0; i < v2.length; i++) {
				equals.push( false );
				for (var j = 0; j < v1.length; j++) {
					if(v2[i]==v1[j]) equals[i]=true;
				}
			}
			for (var i = 0; i < equals.length; i++) {
				if(condition && equals[i]) newArray.push(v2[i]);
				if(!condition && !equals[i]) newArray.push(v2[i]);
			}
			return newArray;
		}
	}else{
		return console.log('Use arrays please, thanks bitch.');
	}
}
