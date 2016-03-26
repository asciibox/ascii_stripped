		var resizeTO; // Trigger resize end event
	    var drawCharacters = new Array(); // This is just an one-dimensional array containing a two-dimensional array with x and y coordinates for the screenCharacterArray
        var globalContext;
        /** When we are drawing by using mouse clicks, this is set to true **/

		var singleClick = false;
        var mouseDown =false;
        /** This is the general width and height, used globally to show the right coordinate system inside the canvas **/
        var width=320;
        var height=90;
        
        var movingX = false;
        var movingY = false;
        var movingXStartPos = 0;
        var movingYStartPos = 0;
        
        // Check/uncheck if the scrollbar is being shown
        var scrollBarXShown = 1;
        var scrollBarYShown = 1;
        
		// You can modify this. It gets set in the call to app.js->setCanvasSize(), and called from index.html in the callback of Codepage initialization. If you change this, the canvasCharacter-Height and -width changes.
      
        var firstLine=0; // Top Y Position according to scrollbar
        var leftLine=0; // Very left X Position according to scrollbar
        
        var resizeToScreen=false;

        var screenCharacterArray = new Array();
                
 
        /** Depending on the screen size, this has a certain value of pixels **/
        var characterWidth, characterHeight; // There is a difference to canvasCharacterWidth and canvasCharacterHeight: characterWidth is most likely 8 whereas canvasCharacterWidth is the real pixel wide in the canvas
      
      
    
      /** Ansi interpreter, display and charactersatonce **/
      var interpreter, display, charactersatonce;
         
		 function doRedraw() {			 
			
				doClearScreen(false);
        		var lowerFrameStart = visibleWidth*canvasCharacterHeight; // redrawX + visibleXStart
				var sx = visibleXStart*canvasCharacterWidth; // The x coordinate of the upper left corner of the rectangle from which the ImageData will be extracted.
				var sy = (visibleHeight+visibleYStart)*canvasCharacterHeight; // The y coordinate of the upper left corner of the rectangle from which the ImageData will be extracted.
				var sw = (visibleWidth)*canvasCharacterWidth; // The width of the rectangle from which the ImageData will be extracted.
				var sh = (visibleHeight-1)*canvasCharacterHeight; // The height of the rectangle from which the ImageData will be extracted. 
        		var imgData = ctx.getImageData(sx, sy, sw, sh);
        		ctx.putImageData(imgData, 0, 0);
				
        		updateScrollbarX(true,0); // draw the scrollbar at the bottom, x position = 0 
		   		updateScrollbarY(true,0); // Show a part of the scrollbar again
		 }
      
	  // This gets called whenever the scrollbar position changes from scrollbar.js, from inside the even listeners
        function redrawScreenMouseUpdate() {
             var window_innerWidth = (visibleWidth*(canvasCharacterWidth));
             var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
            
             visibleXStart = Math.floor((scrollPosX/window_innerWidth)*width);
             visibleXStop = visibleXStart + visibleWidth;
             
             visibleYStart = Math.floor((scrollPosY/window_innerHeight)*height);
             var visibleYStop = visibleYStart + visibleHeight;
             animOffsetX=visibleXStart;
             firstLine=visibleYStart;
             animOffsetY=visibleYStart;
             leftLine =visibleXStart;
             
             doRedraw();
        }
          
        
    
	/** This clears the screen, but only the area in which the region gets displayed, i.e. max. to visibleWidth and visibleHeight (i.e. 45 characters times 90 characters) **/
    function doClearScreen() {
           var bgstring = "#000000";
		   ctx = document.getElementById("ansi").getContext("2d");
		   ctx.fillStyle = bgstring;
		   var window_innerWidth = (visibleWidth*(canvasCharacterWidth));
		   var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
			
           ctx.fillRect(0, 0, window_innerWidth-canvasCharacterWidth, window_innerHeight-(canvasCharacterHeight*1));
     
		   // clears everything
           //ctx.fillRect(0, 0, document.getElementById('ansi').width, document.getElementById('ansi').height);
    }
        
        function getDisplayWidth() {
            return visibleWidth; // return parseInt(document.getElementById('displaywidth').value);
        }
        function getDisplayHeight() {
            return visibleHeight; // return parseInt(document.getElementById('displayheight').value);
        }
        function getTotalDisplayWidth() {
            return totalVisibleWidth; // return parseInt(document.getElementById('displaywidth').value);
        }
        function getTotalDisplayHeight() {
            return totalVisibleHeight; // return parseInt(document.getElementById('displayheight').value);
        }
        
     
      
        
           function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
        
        
        /** This gets called whenever the mouse moves and the left mouse button is getting keeped pressed  **/
        
        function mouseMove(ansicanvas, e) {
            console.log(e);
            
            var mouse = getMousePos(ansicanvas, e);
                    var mx = mouse.x;
                    var my = mouse.y;                
            
            
               
        }
        
		
        
	
		/* This creates a new screenCharacterArray in which the colors and codes get stored, by default color white and space (32) **/
        /*function setANSICanvasSize() {
            var totalDisplayWidth=getTotalDisplayWidth();
            var totalDisplayHeight=getTotalDisplayHeight();
            
            for (var y = 0; y <= totalDisplayHeight; y++) // TODO if really 
            {                    
                    var xArray = new Array();
                    for (var x = 0; x <= totalDisplayWidth; x++)  // TODO if really
                    {
                     var data = new Array();
                     data[0]=32; // ascii code
                     data[1]=15; // foreground color
                     data[2]=0; // background color
                     xArray[x]=data;
                    }
                    screenCharacterArray[y]=xArray;
                    
                    //console.log("y:"+y+" length:"+screenCharacterArray[y].length);
            }

          
           
        }*/
 window.onresize = function() { 
				finishedRendering=false;
				drawCharacters=new Array();
				makeCanvasBlack();
				if(resizeTO) clearTimeout(this.resizeTO);
				resizeTO = setTimeout(function() {
					resize_canvas();
				}, 250);
           }

		

		/** This is getting called whenever the user resizes the canvas, to show always the same amount of characters, just with a different width and height **/
        function resize_canvas() {
			console.log("RESIZE CLEAR");
		   /*var bgstring = "#000000";
		   finishedRendering=false;
		   ctx = document.getElementById("ansi").getContext("2d");
		   ctx.fillStyle = bgstring;
		   var window_innerWidth = (visibleWidth*(canvasCharacterWidth));
		   var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
		   // clears everything
		   ctx.fillRect(0, 0, document.getElementById('ansi').width, document.getElementById('ansi').height);*/
			finishedRendering=false;
		   // Now set the new canvas dimensions
console.log("RESIZE SIZE");
		   setCanvasSize(document.getElementById("ansi")); // This creates the canvas for us
makeCanvasBlack(); // codepagedisplay.js
		   // Then draw all characters again
		   console.log("RESIZE CHARS");
           
           for (var y = 0; y < screenCharacterArray.length; y++)
           {
			   if (typeof(screenCharacterArray[y])!="undefined") {
					for (var x = 0; x < screenCharacterArray[y].length;  x++)
					{
						if (typeof(screenCharacterArray[y][x])!="undefined")
						{
								drawCharacters.push(new Array(x, y));
						}
					}
			   }
           }
		   finishedRendering=true;
		   console.log("NOW IT SHOULD REDRAW");
		   updateScrollbarX(true,0); // draw the scrollbar at the bottom, x position = 0 
		   		updateScrollbarY(true,0); // Show a part of the scrollbar again
        }
        
	   /* This sets the correct variables from the values visibleWidth, visibleHeight and totalVisibleWidth and totalVisibleHeight **/
       function setCanvasSize(canvas) {
            
            var window_innerWidth = window.innerWidth;
            var window_innerHeight = window.innerHeight;
            var characterWidthPct= window_innerWidth/(visibleWidth*8); // How often does the character fit into the width
            var characterHeightPct = window_innerHeight/(visibleHeight*16);  // How often does the character fit into the height
            
            if (resizeToScreen==false) {
            
                fullCanvasWidth=Math.floor(visibleWidth*8*characterWidthPct);
                fullCanvasHeight=Math.floor(visibleWidth*8*characterHeightPct);

                canvasCharacterWidth=Math.floor(8*characterWidthPct);
                canvasCharacterHeight=Math.floor(16*characterHeightPct);
                canvas.width=renderedMaxX*(canvasCharacterWidth+1); //fullCanvasWidth;
                canvas.height=(visibleHeight+renderedMaxY)*canvasCharacterHeight; // fullCanvasHeight; - set it to required size after rendering TODO
			
        
            } else {
            
                fullCanvasWidth=window_innerWidth; // Math.floor(width*8*characterWidthPct);
                fullCanvasHeight=window_innerHeight; // Math.floor(width*8*characterHeightPct);

                canvas.width=renderedMaxX*(canvasCharacterWidth+1);
                canvas.height=(visibleHeight+renderedMaxY)*canvasCharacterHeight;; // fullCanvasHeight - we will set it after rendering to the required size TODO

                canvasCharacterWidth=Math.floor(window_innerWidth/visibleWidth); // Math.floor(8*characterWidthPct);
                canvasCharacterHeight=Math.floor(window_innerHeight / visibleHeight); // Math.floor(16*characterHeightPct);
                      
            }
            
        }

