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
var backgroundRenderedImage;
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function Interpreter(url) {
        var http, buffer, pos, escaped, escapeCode;
        http = new XMLHttpRequest();
        http.open("GET", url, true);

        http.onreadystatechange = function () {
            
            if (http.readyState === 4) {
                if (http.status === 200) {
					escapesCursor.parse(ab2str(http.response), // ab2str: new Uint8Array
					{
                    onEscape    : escapesCursor.escape,
                    onLiteral   : modified_write2,
                    onComplete  : function() {
                        // Only serves the purpose of debugging, remove later
                                                            if (debug==true) { // Shows line numbers
                                                               for (var y = 0; y < screenCharacterArray.length; y++) {
                                                                   writeToScreenCharacterArray(parseInt(y), String(y));
                                                               }
                                                            }
                                                            
                                                            console.log("COMPLETE");
                                                            setCanvasSize(); // This creates the canvas for us  
							    
												
                                                           if (renderedMaxY > defaultVisibleHeight)
							   { 
								   visibleHeight = defaultVisibleHeight;
							   } else {
								   visibleHeight = renderedMaxY;
							   }
							   if (renderedMaxX > defaultVisibleWidth)
							   {
								   visibleWidth = defaultVisibleWidth+1;
							   } else {
								   visibleWidth = renderedMaxX+1;
							   }
							   totalVisibleHeight=renderedMaxY;
							 //  totalVisibleWidth=renderedMaxX;
							   // Update popup
							   
							   document.getElementById('totalVisibleWidth').value=defaultTotalVisibleWidth;
							   document.getElementById('totalVisibleHeight').value=totalVisibleHeight;
							   document.getElementById('visibleWidth').value=visibleWidth;
                                                           
                                                           makeCanvasBlack();
                                                           activateRequestAnimFrame=true;		
                                                           
							  // alert("renderedMaxY: "+renderedMaxX+" screenCharacter.length: "+screenCharacterArray.length);
						}
                	});

                   
                } else {
                    throw ("Could not retrieve: " + url);
                }
            }
        };

        http.setRequestHeader("Content-Type", "application/octet-stream");
        http.responseType = "arraybuffer";
        http.send();

		
    }
    
function writeToScreenCharacterArray(y, what) {
 
    var counter = new Array();
  
    for (var z = 0; z < what.length; z++)
    {
                         var myCharArray=new Array();
                         myCharArray[0]=what.charCodeAt(z);
                         myCharArray[1]=3;
                         myCharArray[2]=1;
                         if (typeof(screenCharacterArray[y])=="undefined") screenCharacterArray[y]=new Array();
                         
                         screenCharacterArray[y][z]=myCharArray;
    }
    
}
    
function modified_write2(text) {

				var CR = 0x0d,
                LF = 0x0a,
                cursor = this,
                image_data,
                background,
                foreground,
                charcode,
                x,
                y,
                i,
                length;

            var foreground = escapesCursor.foreground;
			if (escapesCursor.flags & 0x1) {
					 foreground=foreground+8;
			}

            var background = escapesCursor.background;

            for (i = 0, length = text.length; i < length; i++) {
                charcode = text.charCodeAt(i); // & 0xff;  // truncate to 8 bits
                switch (charcode) {
                case CR:
                    cursor.column = 1;
                    break;

                case LF:
                    cursor.row++;
                    break;

                default:
                   // x = (cursor.column - 1) * 8;
                    // y = (cursor.row + cursor.scrollback - 1) * 16;
                     x = (cursor.column - 1);
					 y = (cursor.row + cursor.scrollback - 1);

					// modified
					// image_data = this.renderChar(charcode, foreground, background);
                    // this.context.putImageData(image_data, x, y);

					// 1 = blue
					// 2 = green
					// 3 = cyan
					// 4 = red
					// 5 = purple
					// 6 = brown
					// 7 = green
					// 8 = light blue
					// 9 = light green
					// 10 = light cyan
					// 11 = light red
					// 12 = light purple
					// 13 = yellow
					// 14 = white
					
					//if (prevy!=y) alert(y);

					//prevy = y;
					// globalContext is = document.getElementById("ansi").getContext("2d");
					codepage.drawChar(globalContext, charcode, foreground, background, x, y); // , transparent, storeCharacter, storeCharacterX) 
					if (cursor.column === totalVisibleWidth) { // visibleWidth used here, otherwise translation errors. This seems to be that way because normal screens normally stopped at 80. Format check would be an option.
                        cursor.column = 1;
                        cursor.row++;
                    } else {
                        cursor.column++;
                    }
                    break;
                }
				

// The value of 'row' represents current position relative to the top of the
// screen and therefore cannot exceed 25. Vertical scroll past the 25th line
// increments the scrollback buffer instead.

                if (cursor.row === 26) {
                    cursor.scrollback++;
                    cursor.row--;
                }
            }

}