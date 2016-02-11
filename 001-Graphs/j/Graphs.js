//starts EVERYTHING. Main entrance point
window.onload = function () {

    //create duo canvases
    //EXAMPLE FOR CREATE YOUR DUO CANVAS
    //OPTION1 ===>> D = new DuoCanvas(4)  -->> create 4 layers(couples) of canvases, names autoasigned enumerated
    //OPTION2 ===>> D = new DuoCanvas('Background','Cards','Messages','Mouse');  -->> create 4 layers(couples) of canvases, names choosed
    var D = new SoloCanvas('Background','Nodes');
}

var mainFunction = function(soloCanvas){
    //Create class Game 
    var G = new Graph({
    	vertices		: '{1, 2, 3, 4, 5, 6}',
    	relationships 	: '{{1,2}, {1,5}, {2,3}, {2,5}, {3,4}, {4,5}, {4,6}}',
    	canvas 			: soloCanvas,
    	directed 	 	: false
    });
}







/**
 * Class Graph
 *
 * @author Juan Acuña - Beru
 * @update 04/02/2016
 */

var Graph = function( params ){
	//values for handle canvas
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
	this._relationshipString = params.relationships;
	this._relationships = [];
	this._relationshipsParse = /\w+\s*(?:(?:\,(?:\s*\w+\s*)?)+)?/gmi;
	this.createRelationShips();

	//when all created
	this._graph = this;
	this.createRoutes();
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

Graph.prototype.createNodes	= function(){
	this._nodes = [];
	for (var i = 0; i < this._nodeString.match( this._nodesParse ).length; i++) {
		this._nodes.push( new Node( {graph: this, name: this._nodeString.match( this._nodesParse )[i] } ) );
	}
}

Graph.prototype.createRelationShips	= function(){
	this._relationships = [];
	for (var i = 0; i < this._relationshipString.match( this._relationshipsParse ).length; i++) {
		this._relationships.push( new Relationship( {graph: this, name: this._relationshipString.match( this._relationshipsParse )[i]} ) );
	}
}

Graph.prototype.createRoutes = function(){
	for (var i = 0; i < this._nodes.length; i++) {
		this._nodes[i].getNewRoutes();
	}
	this.setRoutes();
}

Graph.prototype.setRoutes = function(){
	for (var i = 0; i < this._nodes.length; i++) {
		this._nodes[i].setRoutes();
	}
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
}

Graph.prototype.setPositions = function(){
	//set positions automatically ... working



	this.playDraw();
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
		this._nodes[i].draw();
	}
}

Graph.prototype.addEventMouse = function(){
	this._parent.addEventListener('mousemove', this.onMouseMove.bind(this) );
	this._parent.addEventListener('mousedown', this.onMouseDown.bind(this) );
	this._parent.addEventListener('mouseup', this.onMouseUp.bind(this) );
}

Graph.prototype.onMouseMove = function(e){
	var rect = this._parent.document.body.getBoundingClientRect();
	this._mousex = e.clientX - rect.left;
	this._mousey = e.clientY - rect.top;
}

Graph.prototype.onMouseDown = function(e){
	this._mouseDown = true;
}

Graph.prototype.onMouseUp = function(e){
	this._mouseDown = false;
	this._onlyOnce = true;
	for (var i = 0; i < this._nodes.length; i++) {
		this._nodes[i]._movingNode = false;
	}
}























/**
 * Class Node
 *
 * @author Juan Acuña Silvera
 * @update 04/02/2016
 */

var Node = function( params ){
	//for draw
	this._graph = params.graph;
	this._radius = 50;
	this._posx = 100*parseInt(params.name)*1.5;
	this._posy = this._graph._height/2;
	this._mouseOver = false;
	this._active = false;
	this._colorOut = '#555a5e';
	this._colorOver = '#444ec1';
	this._colorBorder = '#9fa5df';
	this._colorText = 'white';
	this._colorBlur = 'white';
	this._sizeText = '40px';
	this._fontText = 'tahoma';
	this._blurEffect = 10;
	this._lineWidth = 3;
	this._newPosx = null;
	this._newPosy = null;
	this._movingNode = false;

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

Node.prototype.showNodeName = function(){
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

Node.prototype.setName = function(name){
	this._name = name;
}

Node.prototype.getName = function(){
	return this._name;
}

Node.prototype.getAdjacents = function(){
	var a = [];
	for (var i = 0; i < this._valence; i++) {
		a.push(this._adjacents[i].getName());
	}
	return a;
}

Node.prototype.addAdjacent = function( adjacentNode ){
	this._adjacents.push( adjacentNode );
	this._valence = this._adjacents.length;
}

Node.prototype.addIncoming = function( incomingNode ){
	this._incomings.push( incomingNode );
	this._incomingDegree = this._incomings.length;
}

Node.prototype.addOutgoing = function( outgoingNode ){
	this._outgoings.push( outgoingNode );
	this._outgoingDegree = this._outgoings.length;
}

Node.prototype.elementA= function( node ){
	this.addAdjacent( node );
	this.addOutgoing( node );
}

Node.prototype.elementB= function( node ){
	this.addAdjacent( node );
	this.addIncoming( node );
}

Node.prototype.toString = function(){
	return 'Node';
}

Node.prototype.draw = function(){
	if((( this._graph._mousex - this._posx )*( this._graph._mousex - this._posx ) + 
		( this._graph._mousey - this._posy )*( this._graph._mousey - this._posy ))< 
		( this._radius*this._radius) ){
		this._mouseOver = true;
		if(this._graph._mouseDown) this._movingNode = true;
	}else{
		this._mouseOver = false;
	}
	this.drawNode();
}

Node.prototype.drawNode = function(){
	if(this._mouseOver || this._movingNode || this._active){
		if(this._movingNode) this.moveNode();
		this.mouseOver();
	}else{
		this.mouseOut();
	}
	this.showNodeName();
	this._active = false;
}

Node.prototype.moveNode = function(){
	if( this._graph._onlyOnce ){
		this._newPosx = this._posx-this._graph._mousex;
		this._newPosy = this._posy-this._graph._mousey;
		this._graph._onlyOnce = false;
	}else{
		this._posx = this._graph._mousex + this._newPosx;
		this._posy = this._graph._mousey + this._newPosy;
	}
}

Node.prototype.mouseOver = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.fillStyle = this._colorOver;
	this._graph._ctx.fillCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
    if(this._movingNode) this.effectMovingNode();
}

Node.prototype.mouseOut = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.fillStyle = this._colorOut;
    this._graph._ctx.fillCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
}

Node.prototype.effectMovingNode = function(){
	this._graph._ctx.save();
	this._graph._ctx.beginPath();
	this._graph._ctx.lineWidth = this._lineWidth;
	this._graph._ctx.strokeStyle = this._colorBorder;
    this._graph._ctx.strokeCircle( this._posx, this._posy, this._radius);
    this._graph._ctx.restore();
}

Node.prototype.setRoutes = function(){
	for (var i = 0; i < this._vector.length; i++) {
		this._routes.push( new Route( this._vector[i]) );
	}
}
Node.prototype.getNewRoutes = function( ){
	this._vector = [];
	this._maxJumps = this._graph._nodes.length;
	for (var i = 1; i <= this._maxJumps; i++) {
		this.getChilds( ' > '.concat(this.getName()),this, i);
	}
}

Node.prototype.getChilds = function( myTemp, myJump, maxJumps ){
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

Node.prototype.addToVector = function( val ){
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

Node.prototype.compareVectors = function(a,b){
	for (var i = 0; i < a.length; i++) {
		if(a[i]!=b[i]) return false;
	}
	return true;
}

Node.prototype.filter = function(value){
	var a = value.match(/\b(\d+)\b.*?/gmi);
	var b = a.unique();
	var t = '';
	for (var i = 0; i < b.length; i++) {
		t += ' > '+b[i];
	}
	return t;
}

Node.prototype.compareLastNodes = function( text, newText ){
	var lastNodes = text.match(/\b(\d+)\b.*?/gmi);
	var newNode = newText.match(/\b(\d+)\b.*?/gmi).pop();
	for (var i = 0; i < lastNodes.length; i++) {
		if(lastNodes[i] == newNode) return false;
	}
	return true;
}

Node.prototype.exist = function( value ){
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



















/**
 * Class Relationship
 *
 * @author Juan Acuña Silvera
 * @update 04/02/2016
 */

var Relationship = function( params ){
	this._graph = params.graph;
	this._name = params.name;
	this._parse = /\w+\s*(?:(?:\;(?:\s*\w+\s*)?)+)?/gmi;
	this._nodeA = this.getNode(this._name,0);
	this._nodeB = this.getNode(this._name,1);
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
	this._colorOver = '#008ae6';
	this._colorOut = '#535679';
	this._widthOver = 2.5;
	this._widthOut = 1;
}

Relationship.prototype.toString = function(){
	return 'Relationship';
}

Relationship.prototype.getNode = function( name, element){
	return this._graph.getNode( name.match( this._parse )[element] );
}

Relationship.prototype.getName = function(){
	return this._name;
}

Relationship.prototype.setName = function( name){
	this._name = name;
}

Relationship.prototype.updatePositions = function(){
	this._posx0 = this._nodeA._posx;
	this._posx1 = this._nodeB._posx;
	this._posy0 = this._nodeA._posy;
	this._posy1 = this._nodeB._posy;
}

Relationship.prototype.draw = function(){
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

Relationship.prototype.drawRelationship = function(){
	if(this._mouseOver){
		this._active=true;
		this.mouseOver();
	}else{
		this._active=false;
		this.mouseOut();
	}
}

Relationship.prototype.getPointNearestMouse = function(){
	lerp = function(a,b,c){return(a+c*(b-a));};
    this._dx = this._posx1 - this._posx0;
    this._dy = this._posy1 - this._posy0;
    this._tan = ( (this._graph._mousex - this._posx0 )*this._dx + (this._graph._mousey-this._posy0)*this._dy )/( this._dx*this._dx+this._dy*this._dy );
    return {x: lerp(this._posx0, this._posx1, this._tan),y: lerp(this._posy0, this._posy1, this._tan)};
}

Relationship.prototype.mouseOver = function(){
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

Relationship.prototype.mouseOut = function(){
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

var Route = function( text ){
	this._routesParse = /\b(\d+)\b.*?/gmi;
	this._routeString = text;
	this._stops = null;
	this.setNodes();
}


Route.prototype.setNodes = function(){
	for (var i = 0; i < this._routeString.match( this._routesParse ).length; i++) {
		this['stop_'+i] = this._routeString.match( this._routesParse )[i];
	}
	this._stops = i;
}



