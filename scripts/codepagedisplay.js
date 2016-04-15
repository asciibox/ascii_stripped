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
var xStart = 0;
var yStart = 0;
var codepageImg;
var renderedMaxX = 0;
var renderedMaxY = 0;

/** This is functionality for drawing characters on the canvas using the image map **/
function Codepage(codepageUrl, callback) {
    var COLORS, img;

    /** Let's load the image map. See interpreter.js **/
    img = new Image();
    img.onload = function () {
        //var i, background;
        characterWidth = 256 / 32; //img.width / 32;
        characterHeight = 128 / 8; // img.height / 8;
        codepageImg = img;

        callback();
    };
    img.src = codepageUrl;


    /** This gets called from modified_write2 from inside escape.js **/
    function drawChar(ctx, asciiCode, foreground, background, x, y, transparent, storeCharacter, storeCharacterX) {

        var realY = y;
        if (typeof (storeCharacter) == "number") {
            realY = storeCharacter;
            storeCharacter = true;
        }
        var realX = x;
        if (typeof (storeCharacterX) == "number") {
            realX = storeCharacterX;
            storeCharacter = true;
        }

        if (x >= xStart - 1) { // xStart is the x value of the scrollbar. For example if we show all characters starting at x = 3.
            if (y >= yStart - 1) { // yStart is the y value of the scrollbar. For example if we show all characters starting at y > 5.

                // transparent is only used in conjunction to redraw the cursor. So this is nearly always true - but anyway it might not get called.
                if ((typeof (transparent) == "undefined") || (transparent == false)) {
                    var charArray = new Array();

                    charArray[0] = asciiCode;
                    charArray[1] = foreground;
                    charArray[2] = background;

                    // This are checks, otherwise the browser hangs. If it's more efficient to do a try catch then that's okay too.
                    if (typeof (screenCharacterArray[realY]) == "undefined") {
                        screenCharacterArray[realY] = new Array();
                        //console.log("realY: "+realY);

                        height = realY+3;
                        screenCharacterArray[realY][realX] = charArray;
                        drawCharacters.push(new Array(realX, realY));
                        //console.log("Array "+realY);

                        if (renderedMaxX < realX)
                            renderedMaxX = realX + 1;
                        if (renderedMaxY < realY)
                            renderedMaxY = realY + 1;
                    } else
                    // only if storeCharacter is set and storeCharacter==true
                    if ((typeof (storeCharacter) == "undefined") || (storeCharacter == true)) {
                        screenCharacterArray[realY][realX] = charArray; // Store the triple array inside the variable screenCharacterArray
                        //console.log("realY2: "+realY);
                        drawCharacters.push(new Array(realX, realY));
                        if (renderedMaxX < realX)
                            renderedMaxX = realX + 1;
                        if (renderedMaxY < realY)
                            renderedMaxY = realY + 1;
                    }
                }

// Drawing then happens in requestanimrame.js, but only if  activateRequestAnimFrame  is set to true, inside interpreter.js

                //}
            } // if x >= xStart-1
        } // if y >= yStart-1

    }

    return {"drawChar": drawChar};
}

function makeCanvasBlack() {

    var bgstring = "#000000";
    ctx = document.getElementById("ansi").getContext("2d");
    ctx.fillStyle = bgstring;

    // clears everything
    ctx.fillRect(0, 0, document.getElementById('ansi').width, document.getElementById('ansi').height);
}

/* This sets the correct variables from the values visibleWidth, visibleHeight and totalVisibleWidth and totalVisibleHeight **/
function setCanvasSize() {


    // If set to 0 use just modified variables like visibleWidth and visibleHeight to calculate the font size
    if ((defaultTotalVisibleWidth == 0) || (defaultTotalVisibleHeight == 0))
    {
        defaultTotalVisibleWidth = visibleWidth;
        defaultTotalVisibleHeight = visibleHeight;
    }
    var window_innerWidth = window.innerWidth;
    var window_innerHeight = window.innerHeight;
    // defaultTotalVisibleWidth and defaultTotalVisibleHeight get used to calculate the font size. These variables do not get changed anywhere and can only get set in index.html, nowhere else.
    // Or by setting them to 0, then the 2 variables get assigned by the variables visibleWidth and visibleHeight above
    var characterWidthPct = window_innerWidth / ((defaultTotalVisibleWidth+1) * 8); // How often does the character fit into the width

	// If there is a scrollbar
	
	if (renderedMaxX>visibleWidth)
	{
		var characterHeightPct = window_innerHeight / ((defaultTotalVisibleHeight) * 16);  // How often does the character fit into the height
	} else {
		// no scrollbar
		
		var characterHeightPct = window_innerHeight / ((defaultTotalVisibleHeight-2) * 16);  // How often does the character fit into the height
	}
	var canvas=document.getElementById('ansi');

    if (resizeToScreen == false) {

        // This is what is used most often
        fullCanvasWidth = Math.floor(defaultTotalVisibleWidth * 8 * characterWidthPct);
        fullCanvasHeight = Math.floor(defaultTotalVisibleWidth * 8 * characterHeightPct);

        canvasCharacterWidth = Math.floor(8 * characterWidthPct);
        canvasCharacterHeight = Math.floor(16 * characterHeightPct);
        //alert(canvasCharacterWidth+"/"+canvasCharacterHeight);
        canvas.width = (renderedMaxX+4) * (canvasCharacterWidth ); //fullCanvasWidth;
        if (canvases==1) {
        	canvas.height = (visibleHeight + renderedMaxY) * canvasCharacterHeight; // fullCanvasHeight; - set it to required size after rendering TODO
        	
        } else {
        	canvas.height = (visibleHeight * canvasCharacterHeight); // fullCanvasHeight; - set it to required size after rendering TODO        	
        	document.getElementById('ansi2').height=(visibleHeight + renderedMaxY) * canvasCharacterHeight; // fullCanvasHeight; - set it to required size after rendering TODO
        	document.getElementById('ansi2').width=(renderedMaxX+4) * (canvasCharacterWidth ); // fullCanvasHeight; - set it to required size after rendering TODO
        }
        
        
        //console.log("canvas.width: "+canvas.width+" canvas.height: "+canvas.height);
        //console.log("canvasCharacterHeight: "+canvasCharacterHeight);
        //console.log("canvas height = "+visibleHeight+"+"+renderedMaxY+"*"+canvasCharacterHeight);

    } else {

        fullCanvasWidth = window_innerWidth; // Math.floor(width*8*characterWidthPct);
        fullCanvasHeight = window_innerHeight; // Math.floor(width*8*characterHeightPct);

        canvas.width = (renderedMaxX+4) * ( canvasCharacterWidth );
        canvas.height = (visibleHeight + renderedMaxY) * canvasCharacterHeight;
        // fullCanvasHeight - we will set it after rendering to the required size TODO

        canvasCharacterWidth = Math.floor(window_innerWidth / visibleWidth); // Math.floor(8*characterWidthPct);
        canvasCharacterHeight = Math.floor(window_innerHeight / visibleHeight); // Math.floor(16*characterHeightPct);

    }

}