/**
 * Create Class for create Multiple Canvaces and change Context
 *
 * @author Juan Acuña Silvera
 * @update 27/01/2016
 *
 */

var SoloCanvas = function(){
    this._inputs = arguments;
    this._numCanvases = null;
    this._jsCanvas1 = null;
    this._ctx1 = null;
    this._jsCanvases = [];
    this._activeDrawingCanvas = null;
    this._canvasNames = [];
    this._objTCanvas = [];
    this.setCanvasNames();
}






/**
 * Method for get type of variable
 *
 * @author Juan Acuña Silvera
 * @update 29/01/2016
 * return : 'function', 'object', 'array','string', 'number', 'boolean', or 'undefined'
 */

SoloCanvas.prototype.getType = function( variable ){
    return ({}).toString.call(variable).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}






/**
 * Method create autmatically canvases Names
 *
 * @author Juan Acuña Silvera
 * @update 27/01/2016
 *
 */

SoloCanvas.prototype.setCanvasNames = function(){
    if(this._inputs.length>1){
        this._numCanvases = this._inputs.length;
        for (var i = 0; i < this._numCanvases; i++) {
            this._canvasNames.push( this._inputs[i].toString() );
        }
    }else{
        this._numCanvases = this._inputs[0];
        for (var i = 0; i < this._numCanvases; i++) {
            this._canvasNames.push( 'cnv'.concat(i+1) );
        }
    }
    this.startSoloCanvas();
}






/**
 * Method create context and all couple of canvases
 *
 * @author Juan Acuña Silvera
 * @update 27/01/2016
 *
 */

SoloCanvas.prototype.startSoloCanvas = function(){
    for (var i = 0; i < this._canvasNames.length; i++) {
        this.createCoupleCanvases(i);
    }
    this.changeContext(0);
    mainFunction(this);
}






/**
 * Method create couple of canvases , original + clone
 *
 * @author Juan Acuña Silvera
 * @update 27/01/2016
 *
 */

SoloCanvas.prototype.createCoupleCanvases = function(i){
    this._objTCanvas = [];
    var canv1 = document.createElement('canvas');
    //asign id's to canvaces
    canv1.id = this._canvasNames[i];
    //add canvaces to html index
    document.getElementById('dobleCnv').appendChild(canv1); 
    //gets elements as var
    this._tjsCanvas1 = document.getElementById(this._canvasNames[i]);
    //gets 2d drawing context for the canvases
    this._tctx1 = this._tjsCanvas1.getContext('2d');
    //size
    this._tjsCanvas1.width = window.innerWidth;
    this._tjsCanvas1.height = window.innerHeight;
    //position
    this._tjsCanvas1.style.position = 'absolute';
    this._tjsCanvas1.style.left = '0px';
    this._tjsCanvas1.style.top = '0px';
    //vector temporal
    this._objTCanvas.push(this._tjsCanvas1);
    this._objTCanvas.push(this._tctx1);
    //añadir
    this._jsCanvases.push( this._objTCanvas );
}






/**
 * Method change actual context
 *
 * @author Juan Acuña Silvera
 * @update 27/01/2016
 *
 */

SoloCanvas.prototype.changeContext = function(n){
    try {
        if (n < this._jsCanvases.length) {
            this._jsCanvas1 = this._jsCanvases[n][0];
            this._ctx1 = this._jsCanvases[n][1];
            this._activeDrawingCanvas = n;
        }
        else {
            this._jsCanvas1 = this._jsCanvases[0][0];
            this._ctx1 = this._jsCanvases[0][1];
            this._activeDrawingCanvas = 0;
        }
    } catch (e) {
        console.log('current drawing context nonexistent.');
    }
}































/*******************************
*main functions for canvas works
*23/11/2015 UPDATE
*
*
******Author : Alberto Acuña/Beru*/

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(callback,element){
                window.setTimeout(callback, 1000 / 60);
            };
})();

window.cancelAnimFrame = (function(){  
    return  window.cancelAnimationFrame       || 
            window.mozCancelAnimationFrame ||
            function(callback,element){
                window.setTimeout(callback, 1000 / 60);
            };
})();























/**
 * create a circle ( for drawn need a fill or stroke after this)
 *
 * @author Juan Acuña Silvera
 * @update 21/11/2015
 *
 * @example : ctx.circle(100, 100, 50, 0)
 */

CanvasRenderingContext2D.prototype.circle = function( x, y, radius){
    this.save();
    this.beginPath();
    this.arc( x, y, radius, 0, 2*Math.PI, true);
    this.closePath();
    this.restore();
}






/**
 * draw a fill circle
 *
 * @author Juan Acuña Silvera
 * @update 21/11/2015
 *
 * @example : ctx.fillCircle(100, 100, 50)
 */

CanvasRenderingContext2D.prototype.fillCircle = function( x, y, radius){
    this.save();
    this.beginPath();
    this.arc( x, y, radius, 0, 2*Math.PI, true);
    this.fill();
    this.closePath();
    this.restore();
}






/**
 * draw a stroke circle
 *
 * @author Juan Acuña Silvera
 * @update 21/11/2015
 *
 * @example : ctx.strokeCircle(100, 100, 50, 0)
 */

CanvasRenderingContext2D.prototype.strokeCircle = function( x, y, radius){
    this.save();
    this.beginPath();
    this.arc( x, y, radius, 0, 2*Math.PI, true);
    this.stroke();
    this.closePath();
    this.restore();
}






/**
 * draw a wrap text
 *
 * @author Juan Acuña Silvera
 * @update 11/02/2015
 *
 * @example : ctx.wrapedText("Hello World!\n\nMom what u doing.\n\n\nBeru is hungry.",40,40,140,15);
 */

CanvasRenderingContext2D.prototype.wrapedText = function ( text, x, y, width, lineHeight) {
    var jumps = text.split("\n");
    for (var i = 0; i < jumps.length; i++) {
        var w = jumps[i].split(' ');
        var line = '';
        for (var n = 0; n < w.length; n++) {
            var testLine = line + w[n] + ' ';
            var metrics = this.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > width && n > 0) {
                this.fillText(line, x, y);
                line = w[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.fillText(line, x, y);
        y += lineHeight;
    }
}






/**
 * full centered Text
 *
 * @author Juan Acuña Silvera
 * @update 11/02/2015
 *
 * @example : ctx.centeredText("Hello World!",x,y);
 */

 CanvasRenderingContext2D.prototype.centeredText = function( text, x, y){
    this.save();
    this.textBaseline = "middle";
    this.textAlign = "center";
    this.fillText(text,x,y);
    this.restore();
 }
