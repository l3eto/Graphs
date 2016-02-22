//starts EVERYTHING. Main entrance point
var G;
console.log('loading...');
window.onload = function () {

    //create duo canvases
    var D = new SoloCanvas('Edges','Vertex');
}

var mainFunction = function(soloCanvas){
    //Create class Game 
    G = new Graph({
    	vertices	: '{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}',
    	edges		: '{{1,2,1}, {2,3,1}, {3,4,1}, {5,6,1}, {6,7,1}, {7,8,1}, {9,10,1}, {10,11,1} ,{11,12,1}, {13,14,1}, {14,15,1}, {15,16,1}, {1,5,1}, {5,9,1}, {9,13,1}, {2,6,1}, {6,10,1}, {10,14,1}, {3,7,1}, {7,11,1}, {11,15,1}, {4,8,1}, {8,12,1}, {12,16,1}}',
    	canvas 		: soloCanvas,
    	directed 	: false
    });
    console.log('loaded!');
}







/**
 * Class Graph
 *
 * @author Juan Acuña - Beru
 * @update 04/02/2016
 */

var Graph = function( params ){
	//values for handle canvas
	this._activeMenu = false;
	this._parent = window;
	this._soloCanvas = null;
	this._ctx = null;
	this._width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	this._height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	this._radius = null;
	this._animation = null;
	this._mousex = null;
	this._mousey = null;
	this._mouseDown = false;
	this._onlyOnce = true;
	this._leftClick = 1;
	this._saveImage = null;
	this._menuFunctions = [ [ function(){this.saveImage(); this.removeContextMenu();} , 'Save graph as image'], [ function(){ this.getMinRouteTo(); this.removeContextMenu();} , 'Find min route'] ];
	this._vertexActive = null;
	this._firstVertex = null;
	this._getSecondVertex = false;

	//Directed
	this._directed = params.directed;

	//Draw
	this._canvas = params.canvas;

	//Nodes
	this._nodeString = params.vertices;
	this._nodes = [];
	this._nodesParse = /\w+\s*(?:(?:\;(?:\s*\w+\s*)?)+)?/gmi;
	this.createNodes();

	//Relationships
	this._relationshipString = params.edges;
	this._relationships = [];
	this._relationshipsParse = /\w+\s*(?:(?:\,(?:\s*\w+\s*)?)+)?/gmi;
	this.createRelationShips();

	//when all created
	this._graph = this;
	//this.createRoutes();
	this.addEventMouse();
	if(this._canvas) this.addSoloCanvas();
}

Graph.prototype.setNodes = function( V ){
	this._nodeString = V;
	this.createNodes();
	this.createRelationShips();
}

Graph.prototype.getNodes = function(){
	return this._nodes;
}

Graph.prototype.setRelationship = function( E ){
	this._relationshipString = E;
	this.createRelationShips();
}

Graph.prototype.getNode = function( nodeName ){
	for (var i = 0; i < this._nodes.length; i++) {
		if(this._nodes[i].getName() == nodeName) return this._nodes[i];
	}
	return null;
}

Graph.prototype.getRelationShip = function( relationshipName ){
	for (var i = 0; i < this._relationships.length; i++) {
		if(this._relationships[i].getName() == relationshipName) return this._relationships[i];
	}
	return null;
}

Graph.prototype.createNodes	= function(){
	this._nodes = [];
	for (var i = 0; i < this._nodeString.match( this._nodesParse ).length; i++) {
		this._nodes.push( new Vertex( {graph: this, name: this._nodeString.match( this._nodesParse )[i] } ) );
	}
	console.log('Vertex Created');
}

Graph.prototype.createRelationShips	= function(){
	this._relationships = [];
	for (var i = 0; i < this._relationshipString.match( this._relationshipsParse ).length; i++) {
		this._relationships.push( new Edge( {graph: this, name: this._relationshipString.match( this._relationshipsParse )[i]} ) );
	}
	console.log('Edges Created');
}

Graph.prototype.createRoutes = function(){
	for (var i = 0; i < this._nodes.length; i++) {
		this._nodes[i].getNewRoutes();
	}
	console.log('Routes Created');
	this.setRoutes();
}

Graph.prototype.setRoutes = function(){
	for (var i = 0; i < this._nodes.length; i++) {
		this._nodes[i].setRoutes();
	}
	console.log('Setting Routes');
}

Graph.prototype.toString = function(){
	return 'Graph';
}

Graph.prototype.pauseDraw = function(){
    cancelAnimationFrame( this._animation );
}

Graph.prototype.playDraw = function(){
    this._animation = requestAnimFrame( this.startDraw.bind(this) );
}

Graph.prototype.startDraw = function(){
    this._animation = requestAnimFrame( this.startDraw.bind(this) );
    this.drawRelationships();
    this.drawNodes();
}

Graph.prototype.addSoloCanvas = function(){
	this._soloCanvas = this._canvas;
	this._ctx = this._canvas._ctx1;
	this.setPositions();
	this.playDraw();
}

Graph.prototype.setPositions = function(){
	var filas = Math.floor( Math.sqrt(this._nodes.length) );
	var columnas = Math.round( this._nodes.length/filas );
	var k = 0;
	for (var i = 0; i < filas; i++) {
		for (var j = 0; j < columnas; j++) {
			if(this._nodes[k]) this._nodes[k].setPositions( (this._width/(columnas+1))*(j+1) , (this._height/(filas+1))*(i+1) );
			k++;
		}
	}
	if(this._width>this._height){
		for (var i = 0; i < this._nodes.length; i++) {
			this._nodes[i].setRadius( this._height/(filas+1)/2 );
		}
	}else{
		for (var i = 0; i < this._nodes.length; i++) {
			this._nodes[i].seRadius( this._width/(columnas+1)/2 );
		}
	}
}

Graph.prototype.changeContext = function(n) {
    this._soloCanvas.changeContext(n);
    this._ctx = this._soloCanvas._ctx1;
}

Graph.prototype.drawRelationships = function(){
	this.changeContext(0);
	this._ctx.clearRect( 0, 0, this._width, this._height);
	for (var i = 0; i < this._relationships.length; i++) {
		this._relationships[i].draw();
		if(this._relationships[i]._active){
			this._relationships[i]._nodeA._active = true;
			this._relationships[i]._nodeB._active = true;
		}
	}
}

Graph.prototype.drawNodes = function(){
	this.changeContext(1);
	this._ctx.clearRect( 0, 0, this._width, this._height);
	for (var i = 0; i < this._nodes.length; i++) {
		if( this._firstVertex == this._nodes[i] && this._getSecondVertex ){
			this._nodes[i].setColorActiveRoute();
		}else{
			this._nodes[i].draw();
		}
	}
}

Graph.prototype.addEventMouse = function(){
	this._parent.addEventListener('mousemove', this.onMouseMove.bind(this) );
	this._parent.addEventListener('mousedown', this.onMouseDown.bind(this) );
	this._parent.addEventListener('mouseup', this.onMouseUp.bind(this) );
	this._parent.addEventListener('resize', this.onResize.bind(this) );
	this._parent.addEventListener('click', this.onMouseClick.bind(this) );
	this._parent.document.oncontextmenu = function(){return false;};
	this._parent.addEventListener('contextmenu', this.contextMenu.bind(this) );
}

Graph.prototype.contextMenu = function(e){
	if( this._activeMenu ){ this.removeContextMenu(); };
	this._vertexActive = this.getNodeActive(e);
  	this._activeMenu = true;
  	this._contextMenu = document.createElement('div');
  	this._contextMenu.className = "contextualMenu";
  	this._contextMenu.style.cursor = 'pointer';
  	for(var i=0;i<this._menuFunctions.length;i++){
		if( i == 0 ) this.addOption( this._menuFunctions[i], this._contextMenu);
		if( this._vertexActive && i == 1 ) this.addOption( this._menuFunctions[i], this._contextMenu);
	}
  	document.body.appendChild(this._contextMenu);
  	this._contextMenu.style.top = this._mousey + "px";
  	this._contextMenu.style.left = this._mousex + "px";
  	this._ctx.canvas.addEventListener('click', this.removeContextMenu.bind(this) , false);
}

Graph.prototype.getMinRouteTo = function(){
	this._firstVertex = this._vertexActive;
	this._firstVertex.getNewRoutes();
	this._firstVertex.setRoutes();
	this._secondVertex = null;
	this._getFirstVertex = true;
	this._getSecondVertex = false;
}

Graph.prototype.onMouseClick = function(e){
	if( this._getFirstVertex ){
		this._getFirstVertex = false;
		this._getSecondVertex = true;
	}else{
		if( this._getSecondVertex ){
			if( this.getNodeActive(e) ){
				this.getNodeActive(e).getNewRoutes();
				this.getNodeActive(e).setRoutes();
				console.log( this._firstVertex );
				console.log( this.getNodeActive(e) );
				console.log( this._firstVertex.getRouteMin( this.getNodeActive(e) )[0]._routeString );
				this._getSecondVertex = false;
			}
		}
	}
}

Graph.prototype.addOption = function( option, contextMenu ){
	var div = document.createElement('div');
  	div.className = "contextualMenuOption";
  	var span = document.createElement('span');
  	span.appendChild(document.createTextNode(option[1]));
  	div.appendChild(span);
  	contextMenu.appendChild(div);
  	div.addEventListener('click', option[0].bind(this) , false);
}

Graph.prototype.removeContextMenu = function(){
	if(this._activeMenu){
    	document.body.removeChild( this._contextMenu );
    	this._activeMenu = false;
    	this.playDraw();
    	this.clearActive();
    	this._vertexActive = null;
    }
}

Graph.prototype.clearActive = function(){
	for (var i = 0; i < this._nodes.length; i++) {
		this._nodes[i]._active = false;
		this._nodes[i]._mouseOver = false;
	}
}

Graph.prototype.onResize = function(e){
	this._width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	this._height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	this._soloCanvas.updateSize();
	this.setPositions();
}

Graph.prototype.onMouseMove = function(e){
	var rect = this._parent.document.body.getBoundingClientRect();
	this._mousex = e.clientX - rect.left;
	this._mousey = e.clientY - rect.top;
	this._graph._parent.document.body.style.cursor = 'initial';
	for (var i = 0; i < this._nodes.length; i++) {
		if(this._nodes[i]._mouseOver) this._parent.document.body.style.cursor = 'pointer';
	}
}

Graph.prototype.onMouseDown = function(e){
	if(e.which==this._leftClick){
		this._mouseDown = true;
	}
}

Graph.prototype.onMouseUp = function(e){
	if(e.which==this._leftClick){
		this._mouseDown = false;
		this._onlyOnce = true;
		for (var i = 0; i < this._nodes.length; i++) {
			this._nodes[i]._movingVertex = false;
		}
	}
}

Graph.prototype.getNodeActive = function(e){
	for (var i = 0; i < this._nodes.length; i++) {
		var active = this._nodes[i].isActive( e.clientX - this._parent.document.body.getBoundingClientRect().left , e.clientY - this._parent.document.body.getBoundingClientRect().top );
		if( active ) return active;
	}
	return null;
}

Graph.prototype.saveImage = function(){
	if( confirm("Download Graph.png") ){
		this._saveImage = null;
		this._saveImage = document.createElement('CANVAS');
		this._saveImage.id = 'save';
		this._saveImage.width=this._width;
		this._saveImage.height=this._height;
		var context = this._saveImage.getContext('2d');
		for (var i = 0; i < this._soloCanvas._canvasNames.length; i++) {
			context.drawImage(document.getElementById( this._soloCanvas._canvasNames[i] ),0,0);
		}
		var b = this._saveImage.toDataURL('png');
	    var a  = document.createElement('a');
	    a.href = b;
	    a.download = 'Graph.png';
	    a.click();
	}	
} 




















/**
 * Class Vertex
 *
 * @author Juan Acuña - Beru
 * @update 04/02/2016
 */

var Vertex = function( params ){
	//for draw
	this._graph = params.graph;
	this._minradius = 15;
	this._maxradius = 50;
	this._radius = null;
	this._posx = null;
	this._posy = null;
	this._mouseOver = false;
	this._active = false;
	this._colorOut = '#555a5e';
	this._colorOver = '#444ec1';
	this._colorBorder = '#9fa5df';
	this._colorActive = '#00cc66';
	this._colorBorderActive = '#00e673';
	this._colorText = 'white';
	this._colorBlur = 'white';
	this._sizeText = '30px';
	this._fontText = 'tahoma';
	this._blurEffect = 10;
	this._lineWidth = 3;
	this._newPosx = null;
	this._newPosy = null;
	this._movingVertex = false;
	this._menuActive = false;

	//node dates
	this._vector = [];
	this._routes = [];
	this._name = params.name;
	this._adjacents = [];
	this._valence = this._adjacents.length;
	this._incomings = [];
	this._incomingDegree = this._incomings.length;
	this._outgoings = [];
	this._outgoingDegree =this._outgoings.length;
}

Vertex.prototype.setRadius = function( radius){
	if(radius < this._minradius || radius > this._maxradius){
		if(radius<this._minradius){
			this._radius = this._minradius;
		}else{
			this._radius = this._maxradius;
		}
	}else{
		this._radius = radius;
	}
}

Vertex.prototype.setPositions = function(x, y){
	this._posx = x;
	this._posy = y;
}

Vertex.prototype.showNodeName = function(){
	this._graph._ctx.save();
	this._graph._ctx.fillStyle = this._colorText;
	this._graph._ctx.font = this._sizeText+' '+this._fontText;
	if(this._active || this._mouseOver){
		this._graph._ctx.shadowColor = this._colorBlur;
		this._graph._ctx.shadowOffsetX = 0;
		this._graph._ctx.shadowOffsetY = 0;
		this._graph._ctx.shadowBlur = this._blurEffect;
	}
	this._graph._ctx.centeredText( this._name, this._posx, this._posy );
	this._graph._ctx.restore();
}

Vertex.prototype.setName = function(name){
	this._name = name;
}

Vertex.prototype.getName = function(){
	return this._name;
}

Vertex.prototype.getAdjacents = function(){
	var a = [];
	for (var i = 0; i < this._valence; i++) {
		a.push(this._adjacents[i].getName());
	}
	return a;
}

Vertex.prototype.addAdjacent = function( adjacentNode ){
	this._adjacents.push( adjacentNode );
	this._valence = this._adjacents.length;
}

Vertex.prototype.addIncoming = function( incomingNode ){
	this._incomings.push( incomingNode );
	this._incomingDegree = this._incomings.length;
}

Vertex.prototype.addOutgoing = function( outgoingNode ){
	this._outgoings.push( outgoingNode );
	this._outgoingDegree = this._outgoings.length;
}

Vertex.prototype.elementA= function( node ){
	this.addAdjacent( node );
	this.addOutgoing( node );
}

Vertex.prototype.elementB= function( node ){
	this.addAdjacent( node );
	this.addIncoming( node );
}

Vertex.prototype.toString = function(){
	return 'Node';
}

Vertex.prototype.setColorActive = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.fillStyle = this._colorActive;
	this._graph._ctx.fillCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
    this.showNodeName();
    this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.lineWidth = this._lineWidth;
	this._graph._ctx.strokeStyle = this._colorBorderActive;
    this._graph._ctx.strokeCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
}

Vertex.prototype.setColorActiveRoute = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.fillStyle = this._colorActive;
	this._graph._ctx.fillCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
    this.showNodeName();
    this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.lineWidth = this._lineWidth;
	this._graph._ctx.strokeStyle = this._colorBorderActive;
    this._graph._ctx.strokeCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
}

Vertex.prototype.draw = function(){
	if( !this._graph._vertexActive ){
		if((( this._graph._mousex - this._posx )*( this._graph._mousex - this._posx ) + 
			( this._graph._mousey - this._posy )*( this._graph._mousey - this._posy ))< 
			( this._radius*this._radius) ){
			this._mouseOver = true;
			if(this._graph._mouseDown) this._movingVertex = true;
		}else{
			this._mouseOver = false;
		}
		this.drawNode();
	}else{
		if( this._graph._vertexActive == this ){
			this.setColorActive();
		}else{
			this.drawNode();
		}
	}
}

Vertex.prototype.isActive = function(x,y){
	if((( x - this._posx )*( x - this._posx ) + ( y - this._posy )*( y - this._posy )) < ( this._radius*this._radius) ){
		return this;
	}
	return null;
}

Vertex.prototype.drawNode = function(){
	if(this._mouseOver || this._movingVertex || this._active){
		if(this._movingVertex) this.moveNode();
		this.mouseOver();
	}else{
		this.mouseOut();
	}
	this.showNodeName();
	this._active = false;
}

Vertex.prototype.moveNode = function(){
	if( this._graph._onlyOnce ){
		this._newPosx = this._posx-this._graph._mousex;
		this._newPosy = this._posy-this._graph._mousey;
		this._graph._onlyOnce = false;
	}else{
		this._posx = this._graph._mousex + this._newPosx;
		this._posy = this._graph._mousey + this._newPosy;
	}
}

Vertex.prototype.mouseOver = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.fillStyle = this._colorOver;
	this._graph._ctx.fillCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
    if(this._movingVertex) this.effectMovingNode();
}

Vertex.prototype.mouseOut = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.fillStyle = this._colorOut;
    this._graph._ctx.fillCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
}

Vertex.prototype.effectMovingNode = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.lineWidth = this._lineWidth;
	this._graph._ctx.strokeStyle = this._colorBorder;
    this._graph._ctx.strokeCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
}

Vertex.prototype.setRoutes = function(){
	for (var i = 0; i < this._vector.length; i++) {
		this._routes.push( new Route( {graph: this._graph, route: this._vector[i]} ));
	}
}
Vertex.prototype.getNewRoutes = function( ){
	this._vector = [];
	this._maxJumps = this._graph._nodes.length;
	for (var i = 1; i <= this._maxJumps; i++) {
		this.getChilds( ' > '.concat(this.getName()),this, i);
	}
}

Vertex.prototype.getChilds = function( myTemp, myJump, maxJumps ){
	for (var i = 0; i < myJump._adjacents.length; i++) {

		newJump = myJump._adjacents[i];
		newTemp = myTemp.concat(' > ',newJump.getName() );

		numJump = newTemp.match(/\b(\d+)\b.*?/gmi).length;

		if( this.compareLastNodes(myTemp,newTemp) ){
			if( numJump == maxJumps && this.exist(newTemp) ){
				this.addToVector( newTemp );
			}else{
				this.getChilds( newTemp, newJump, maxJumps);
			}
		}else{
			continue;
		}	
	}
}

Vertex.prototype.addToVector = function( val ){
	if( this._vector.length==0 ){
		this._vector.push(val);
	}else{
		var a = true;
		for (var i = 0; i < this._vector.length; i++) {
			if(val.length>this._vector[i].length){
				if( val.substring(0, this._vector[i].length) == this._vector[i] ){
					this._vector[i] = val;
					a = false;
				}
			}
		}
		if(a) this._vector.push(val);
	}
}

Vertex.prototype.compareVectors = function(a,b){
	for (var i = 0; i < a.length; i++) {
		if(a[i]!=b[i]) return false;
	}
	return true;
}

Vertex.prototype.filter = function(value){
	var a = value.match(/\b(\d+)\b.*?/gmi);
	var b = a.unique();
	var t = '';
	for (var i = 0; i < b.length; i++) {
		t += ' > '+b[i];
	}
	return t;
}

Vertex.prototype.compareLastNodes = function( text, newText ){
	var lastNodes = text.match(/\b(\d+)\b.*?/gmi);
	var newNode = newText.match(/\b(\d+)\b.*?/gmi).pop();
	for (var i = 0; i < lastNodes.length; i++) {
		if(lastNodes[i] == newNode) return false;
	}
	return true;
}

Vertex.prototype.exist = function( value ){
	if( value.match(/\b(\d+)\b.*?/gmi).length > this._graph._nodes.length ){
		return false;
	}
	if(this._vector.length==0){
		return true;
	}else{
		var a = value.match(/\b(\d+)\b.*?/gmi);
		var size = a.length;
		var flag = true;
		for (var i = 0; i < this._vector.length; i++) {
			var b = this._vector[i].match(/\b(\d+)\b.*?/gmi);
			if(b.length<a.length) size = b.length;
			flag = true;
			for (var j = 0; j < size; j++) {
				if( b[j]!=a[j]) flag = false;
			}
			if(!flag) return true;
		}
		return false;
	}
}

Vertex.prototype.isNewRoute = function( newRoute, routes ){
	if(routes.length==0) return true;
	if(newRoute===undefined || newRoute===null) return false;
	if(newRoute){		
		for (var i = 0; i < routes.length; i++) {
			if(routes[i]._routeString == newRoute._routeString) return false;
		}
		return true;
	}
}

Vertex.prototype.getRouteMin = function( Vertex ){
	if( this._routes.length > 0 ){
		var a = [];
		for (var i = 0; i < this._routes.length; i++) {
			var newRoute = this._routes[i].getRouteTo( Vertex );
			if( this.isNewRoute(newRoute, a) ){
				a.push( newRoute );
			}
		}
		var b = [];
		for (var i = 0; i < a.length; i++) {
			b.push( a[i]._weight );
		}
		var c = Math.min.apply(null, b);
		var d = [];
		for (var i = 0; i < a.length; i++) {
			if( a[i]._weight == c ) d.push( a[i] );
		}
		return d;
	}else{
		return null;
	}
}


























/**
 * Class Relationship
 *
 * @author Juan Acuña Silvera
 * @update 04/02/2016
 */

var Edge = function( params ){
	this._graph = params.graph;
	this._name = params.name;
	this._directed = params.graph._directed;
	this._parse = /\w+\s*(?:(?:\;(?:\s*\w+\s*)?)+)?/gmi;
	this._nodeA = this.getNode(this._name,0);
	this._nodeB = this.getNode(this._name,1);
	this._weight = this.getWeight();
	this._nodeA.elementA( this._nodeB );
	this._nodeB.elementB( this._nodeA );

	//draw values
	this._posx0 = this._nodeA._posx;
	this._posx1 = this._nodeB._posx;
	this._posy0 = this._nodeA._posy;
	this._posy1 = this._nodeB._posy;
	this._tolerance = 7;
	this._mouseOver = false;
	this._dx = null;
	this._dy = null;
	this._distance = null;
	this._tan = null;
	this._linePoint = null;
	this._colorActive = '#22c383';
	this._colorOver = '#008ae6';
	this._colorOut = '#535679';
	this._widthOver = 2.5;
	this._widthOut = 1;
}

Edge.prototype.toString = function(){
	return 'Relationship';
}

Edge.prototype.getNode = function( name, element){
	return this._graph.getNode( name.match( this._parse )[element] );
}

Edge.prototype.getWeight = function(){
	return parseInt(this._name.match( this._parse )[2]);
}

Edge.prototype.getName = function(){
	return ' > '.concat( this._nodeA.getName(), ' > ',this._nodeB.getName() );
}

Edge.prototype.setName = function( name){
	this._name = name;
}

Edge.prototype.updatePositions = function(){
	this._posx0 = this._nodeA._posx;
	this._posx1 = this._nodeB._posx;
	this._posy0 = this._nodeA._posy;
	this._posy1 = this._nodeB._posy;
}

Edge.prototype.draw = function(){
	this.updatePositions();
	this._linePoint = this.getPointNearestMouse();
	this._distance = Math.abs(Math.sqrt( (this._graph._mousex - this._linePoint.x)*(this._graph._mousex - this._linePoint.x) + (this._graph._mousey - this._linePoint.y)*(this._graph._mousey - this._linePoint.y)) );
    if(this._distance < this._tolerance){
      	if( this._graph._mousex < this._posx0 - this._tolerance || this._graph._graph._mousex > this._posx1 + this._tolerance ){
      		this._mouseOver = false;
      	}else{
      		this._mouseOver = true;
      	}
    }else{ 
    	this._mouseOver = false;
    }
    this.drawRelationship();
}

Edge.prototype.drawRelationship = function(){
	if(this._mouseOver){
		this._active=true;
		this.mouseOver();
	}else{
		this._active=false;
		this.mouseOut();
	}
}

Edge.prototype.getPointNearestMouse = function(){
	lerp = function(a,b,c){return(a+c*(b-a));};
    this._dx = this._posx1 - this._posx0;
    this._dy = this._posy1 - this._posy0;
    this._tan = ( (this._graph._mousex - this._posx0 )*this._dx + (this._graph._mousey-this._posy0)*this._dy )/( this._dx*this._dx+this._dy*this._dy );
    return {x: lerp(this._posx0, this._posx1, this._tan),y: lerp(this._posy0, this._posy1, this._tan)};
}

Edge.prototype.mouseOver = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.lineWidth = this._widthOver;
	this._graph._ctx.strokeStyle = this._colorOver;
	this._graph._ctx.moveTo( this._posx0, this._posy0 );
	this._graph._ctx.lineTo( this._posx1, this._posy1 );
	this._graph._ctx.stroke();
	this._graph._ctx.restore();
	//draw circle where mouse is --> this._graph._ctx.fillCircle(this._linePoint.x, this._linePoint.y, this._tolerance);
}

Edge.prototype.mouseOut = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.lineWidth = this._widthOut;
	this._graph._ctx.strokeStyle = this._colorOut;
	this._graph._ctx.moveTo( this._posx0, this._posy0 );
	this._graph._ctx.lineTo( this._posx1, this._posy1 );
	this._graph._ctx.stroke();
	this._graph._ctx.restore();
}









/**
 * Class Route
 *
 * @author Juan Acuña Silvera
 * @update 05/02/2016
 */

var Route = function( params ){
	this._graph = params.graph;
	this._directed = params.graph._directed;
	this._routesParse = /\b(\d+)\b.*?/gmi;
	this._routeString = params.route;
	this._weight = 0;
	this._stops = null;
	this._jumps = [];
	this.setNodes();
}


Route.prototype.setNodes = function(){
	for (var i = 0; i < this._routeString.match( this._routesParse ).length; i++) {
		this['stop_'+i] = this._routeString.match( this._routesParse )[i];
	}
	this._stops = i;
	this.setJumps();
}

Route.prototype.setJumps = function(){
	for (var i = 0; i < this._stops-1; i++) {
		this._jumps.push( this._graph.getRelationShip( ' > '.concat( this._graph.getNode( this['stop_'+i] ).getName(), ' > ',  this._graph.getNode( this['stop_'+(i+1)]).getName() ) ) ) ;
		if(this._jumps[this._jumps.length-1]==null && !this._directed) this._jumps[this._jumps.length-1] = ( this._graph.getRelationShip( ' > '.concat( this._graph.getNode( this['stop_'+(i+1)] ).getName(), ' > ',  this._graph.getNode( this['stop_'+(i)]).getName() ) ) ) ;
	}
	this.setWeight();
}

Route.prototype.setWeight = function(){
	for (var i = 0; i < this._jumps.length; i++) {
		this._weight += this._jumps[i]._weight;
	}
}

Route.prototype.getRouteTo = function( Node ){
	if( this.nodeExist(Node) ){
		var nodeName = Node.getName();
		var a = '';
		for (var i = 0; i < this._routeString.length; i++) {
			var txt = '';
			for (var j = 0; j < nodeName.length; j++) {
				txt+=this._routeString[i+j];
			}
			txt += this._routeString[i+j+1];
			if( txt+' ' == nodeName ){
				a += txt;
				break;
			}
			a += this._routeString[i];
		}
		return new Route( {graph: this._graph, route: a} );
	}
}

Route.prototype.nodeExist = function( Node){
	for (var i = 0; i < this._jumps.length; i++) {
		if( this._jumps[i]._nodeB == Node || this._jumps[i]._nodeA == Node) return true;
	}
	return false;
}

Route.prototype.getRouteString = function(){
	return this._routeString;
}
