/* The MIT License (MIT)
 *
 * Copyright (c) 2015 Oliver Bachmann, Karlsruhe, Germany
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var animOffsetX = 0;
var animOffsetY = 0;
var visibleXStart = 0;
var visibleYStart = 0;

var bps = 99999;

/** This is just some fancy speed stuff for timeout. Check if this can get made workable again by changing the value to something real and enabling charsAtOnce below **/
var charsAtOnce = 99999;
if (bps == 300)
    charsAtOnce = 10;
else if (bps == 1200)
    charsAtOnce = 40;
else if (bps == 2400)
    charsAtOnce = 80;
else if (bps == 16800)
    charsAtOnce = 6 * 160;
else if (bps == 19200)
    charsAtOnce = 7 * 160;
else if (bps == 57600)
    charsAtOnce = 20 * 160;

var globalBuffer = new Uint8Array();
var escapeCode = "";
var globalEscaped = false;
var globalPos = 0;
// usage:
// instead of setInterval(render, 16) ....

// shim layer with setTimeout fallback
// This makes requestanimframe.js get called all the time
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


(function animloop() {
    requestAnimFrame(animloop);
    render();
})();


/** This function gets always called **/
function render() {

    var charcounter=0;
	
	while ( (drawCharacters.length>0) && (charcounter<charsAtOnce) )
	{
						charcounter++;
						var realX = drawCharacters[0][0];
						var realY = drawCharacters[0][1];
						
						var charArray = screenCharacterArray[realY][realX];
						var asciiCode = charArray[0];
                        var foreground = charArray[1];
                        var background = charArray[2];
						var transparent = charArray[3];

						// This calculates the real X coordinates on the canvas
                        var x = realX * parseInt(canvasCharacterWidth);

						// This calculates the real Y coordinates on the canvas
                        var y = realY * parseInt( canvasCharacterHeight );

						// Again a check, used in conjunction with redrawing the cursor. Or maybe something else. Especially when it's about NOT drawing the background color.
						// I really don't know what this is good for, it has to do with the correct coloring... I once knew what this was.
                      if ( (typeof(transparent)=="undefined") || (transparent==false) ) {

							// This now calculates the position of the character on the image.
                            var xpos=background;
                           
                            while (xpos >= 16) xpos=xpos-16;
                            // This calculates the position of the block of the image, which has the same characters over and over again with different backgrounds, regarding the y position
                            //console.log(Math.random()+"background:"+background);
                            var ypos = Math.floor(background/16);
                            ///console.log(Math.random()+"ypos:"+ypos);
                          
                            var myasciiCode=219;
                            
                            var myx = (myasciiCode % 32) * characterWidth+(xpos*256);
                            var myy = Math.floor(myasciiCode / 32) * characterHeight + (ypos*128);

							// If it needs to get drawn at the top
							if (realY < visibleHeight-1) {

						    	// Then the character from the image gets copied to the canvas
                            	//alert("1:myx="+myx+" myy="+myy+" x="+x+" y="+y+"CW1:"+characterHeight+" canvasCharacterHeight:"+canvasCharacterHeight);
								if (realX<visibleWidth)
								{								
										ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
								}
										if (canvases==2) {
										ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y+(visibleHeight*canvasCharacterHeight), canvasCharacterWidth, canvasCharacterHeight);
										}
								
                            } 
                            	if (canvases==2) {
                            		ctx2.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
                            	} else {
                            		//ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y+(visibleHeight*canvasCharacterHeight), canvasCharacterWidth, canvasCharacterHeight);
                            	}
							
                        }
                        
                        var xpos=foreground;
                        while (xpos >= 16) xpos=xpos-16;
                        var ypos = Math.floor(foreground/16);

                        if (realY < visibleHeight-1)
                        { 
							var myx = (asciiCode % 32) * characterWidth+(xpos*256);
							var myy = Math.floor(asciiCode / 32) * characterHeight + (ypos*128);
							if (realX<visibleWidth)
								{	
									  
									  
									  // standard drawing
									  //ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
									  
									  // now add visibleHeight to it, to draw it below the main image again
									  
									  ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
								}
						  if (canvases==2) {
                          	ctx2.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
                          }
                          
                        } else {
                          
                          	  var myx = (asciiCode % 32) * characterWidth+(xpos*256);
	                          var myy = Math.floor(asciiCode / 32) * characterHeight + (ypos*128);
                          
                          if (canvases==1) {
        	                  ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y+visibleHeight*canvasCharacterHeight, canvasCharacterWidth, canvasCharacterHeight);
                          } else { // draw on the other canvas
        	                  ctx2.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
                          }
                          
                          
                        }

						drawCharacters.shift();
						if (drawCharacters.length==0)
						{
							// Check: Really needed?
							doRedraw(); // Draw upper screen within the scrollbar
						}

	}
}

		