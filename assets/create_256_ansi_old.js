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
/*jslint browser: true, devel: true, plusplus: true */
 var xStart = 0;
 var yStart = 0;
 
   var ansicolors = [
      '000000', 'aa0000', '00aa00', 'aa5500', '0000aa', 'aa00aa', '00aaaa', 'aaaaaa', '555555', 'ff5555', // 10
      '55ff55', 'ffff55', '5555ff', 'ff55ff', '55ffff', 'ffffff', '000000', '00005f', '000087', '0000af', // 20
      '0000D7', '0000FF', '005F00', '005F5F', '005f87', '005faf', '005fd7', '005fff', '008700', '00875f', // 30
      '008787', '0087af', '0087d7', '0087ff', '00af00', '00af5f', '00af87', '00afaf', '00afd7', '00afff', // 40
      '00d700', '00d787', '00d787', '00d7af', '00d7af', '00d7ff', '00ff00', '00ff5f', '00ff87', '00ffaf', // 50
      '00ffd7', '00ffff', '5f0000', '5f5fff', '5f0087', '5f00af', '5f00d7', '5f00ff', '5f5f00', '5f5f5f', // 60
      '5f5f87', '5f5faf', '5f5fd7', '5f5fff', '5f8700', '5f875f', '5f8787', '5f87af', '5f87d7', '5f87ff', // 70
      '5faf00', '5faf5f', '5faf87', '5fafaf', '5fafd7', '5fafff', '5fd700', '5fd75f', '5fd787', '5fd7af', // 80
      '5fd7d7', '5fd7ff', '5fff00', '3399cc', '5fff87', '5fffaf', '5fffd7', '5fffff', '870000', '87005f', // 90
      '870087', '8700af', '8700af', '8700ff', '875f00', '875f5f', '875f87', '875faf', '875fd7', '875fff', // 100 
      '878700', '87875f', '878787', '8787af', '8787d7', '8787ff', '87af00', '87af5f', '87af87', '87afaf', // 110
      '87afd7', '87afff', '87d700', '87d75f', '87d787', '87d7af', '87d7d7', '87d7ff', '87ff00', '87ff5f', // 120
      '87ff87', '87ffaf', '87ffd7', '87ffff', 'af0000', 'af005f', 'af0087', 'af00af', 'af00d7', 'af00ff', // 130
      'af5f00', 'af5f5f', 'af5f87', 'af5faf', 'af5fd7', 'af5fff', 'af8700', 'af875f', 'af8787', 'af87af', // 140
      'af87d7', 'af87ff', 'afaf00', 'afd7af', 'afaf87', 'afafaf', 'afafd7', 'afafff', 'afd700', 'afd75f', // 150
      'afd787', 'afd7af', 'afd7d7', 'afd7ff', 'afff00', 'afff5f', 'afff87', 'afffaf', 'afffd7', 'afffff', // 160
      'd70000', 'd7005f', 'dd2699', 'd700af', 'd700d7', 'd700ff', 'd75f00', 'd75f5f', 'd75f87', 'd75faf', // 170
      'd75fd7', 'd75fff', 'd78700', 'd7875f', 'd78787', 'd787af', 'd787d7', 'd787ff', 'd7af00', 'd7af5f', // 180
      'd7af87', 'd7afaf', 'd7afd7', 'd7afff', 'd7d75f', 'd7d75f', 'd7d787', 'd7d7af', 'd7d7d7', 'd7d7ff', // 190
      'd7ff00', 'd7ff5f', 'd7ff87', 'd7ffaf', 'd7ffd7', 'd7ffff', 'ff0000', 'ff005f', 'ff0087', 'ff00af', // 200
      'ff00d7', 'ff00ff', 'ff5f00', 'ff5f5f', 'ff5f87', 'ff5faf', 'ff5fd7', 'ff5fff', 'ff8700', 'ff875f', // 210
      'ff8787', 'ff87af', 'ff87d7', 'ffaf00', 'ffaf00', 'ffaf5f', 'ffaf87', 'ffafaf', 'ffafd7', 'ffafff', // 220
      'ffd700', 'ffd75f', 'ffd787', 'ffd7af', 'ffd7d7', 'ffd7ff', 'ffff00', 'ffff5f', 'ffff87', 'ffffaf', // 230
      'ffffd7', 'ffffff', '080808', '121212', '1c1c1c', '262626', '303030', '3a3a3a', '444444', '4e4e4e', // 240
      '585858', '626262', '6c6c6c', '767676', '808080', '8a8a8a', '949494', '9e9e9e', 'a8a8a8', 'b2b2b2', // 250
      'bcbcbc', 'c6c6c6', 'd0d0d0', 'e4e4e4', 'e4e4e4', 'eeeeee', 'ffffff'
    ];

function Codepage(codepageUrl, callback) {
        var img, codepageImgs, backgroundImgs;

        function createCanvas(width, height) {
            var newCanvas;
            newCanvas = document.createElement("canvas");
            
            newCanvas.setAttribute("width", width);
            newCanvas.setAttribute("height", height);
            return newCanvas;
        }

        function colorCanvas(source, color, preserveAlpha) {
            var canvas, ctx, imageData, i;
            canvas = createCanvas(source.width, source.height);
            ctx = canvas.getContext("2d");
            ctx.drawImage(source, 0, 0);
            imageData = ctx.getImageData(0, 0, source.width, source.height);
            for (i = 0; i < imageData.data.length; ++i) {
                
                var c1 = h2d(ansicolors[color].substring(0,2));
                var c2 = h2d(ansicolors[color].substring(2,4));
                var c3 = h2d(ansicolors[color].substring(4));
               
                imageData.data[i++] = c1; // COLORS[color][0];
                imageData.data[i++] = c2; // COLORS[color][1];
                imageData.data[i++] = c3; // COLORS[color][2];
                if (!preserveAlpha) { imageData.data[i] = 255; }
            }
            ctx.putImageData(imageData, 0, 0);
            return canvas;
        }

function d2h(d) {return d.toString(16);}
function h2d(h) {return parseInt(h,16);}

        img = new Image();
        img.onload = function () {
       
            var i, background;
            characterWidth = img.width / 32;
            
            characterHeight = img.height / 8;
            codepageImgs = [];
            backgroundImgs = [];
            background = createCanvas(characterWidth, characterHeight);
            for (i = 0; i < ansicolors.length; i++) {
                document.getElementById('progress').innerHTML="i: "+i+" of "+ansicolors.length;
                codepageImgs[i] = colorCanvas(img, i, true);
                backgroundImgs[i] = colorCanvas(background, i, false);
            }
            
            newCanvas = document.createElement("canvas");
            
            newCanvas.setAttribute("width", img.width*16);
            newCanvas.setAttribute("height", img.height*16);
            
            ctx = newCanvas.getContext("2d");
            
            for (var i = 0; i < codepageImgs.length; i++) 
            {
                var x = i;
                while (x >= 16) x=x-16;
                var y = Math.floor(i/16);
                
    
                ctx.drawImage(codepageImgs[i], 0, 0, 256, 128, x*256, y*128, 256, 128);
            }
            
            document.body.appendChild(newCanvas);

            callback();
        };
        img.src = codepageUrl;

        function drawChar(ctx, asciiCode, foreground, background, x, y, transparent) {
            
            //console.log(" drawChar:"+ctx+" asciiCode:"+asciiCode+" foreground:"+foreground+" background:"+background+" x:"+x+" y:"+y);
            if (x>xStart) {
                if (y>yStart) {
                        if ( (typeof(transparent)=="undefined") || (transparent==false) ) {
                         
                         var charArray = Array();
                         charArray[0]=asciiCode;
                         charArray[1]=foreground;
                         charArray[2]=background;
                        
                         screenCharacterArray[y][x]=charArray;
                        }
                        x=x-xStart;
                        y=y-yStart;
                        x = (x - 1) * characterWidth;
                        y = (y - 1) * characterHeight;
                        if ( (typeof(transparent)=="undefined") || (transparent==false) ) {
                            ctx.drawImage(backgroundImgs[background], x, y);
                        }
                        ctx.drawImage(codepageImgs[foreground], (asciiCode % 32) * characterWidth, Math.floor(asciiCode / 32) * characterHeight, characterWidth, characterHeight, x, y, characterWidth, characterHeight);
            }
            }
        }

        function generateDisplay(width, height) {
            return colorCanvas(createCanvas(width * characterWidth, height * characterHeight), 0, false);
        }

		/** This was used from within codepagedisplaxy.js, line 309. The escape.js library should handle scrolling for us, however there might be situation in which codepagedisplay.js 309 needs to get re-enabled to deliver proper results **/
        function scrollDisplay(ctx, canvas) {
            ctx.drawImage(canvas, 0, characterHeight, canvas.width, canvas.height - characterHeight * 2, 0, 0, canvas.width, canvas.height - characterHeight * 2);
            ctx.fillStyle = "black";
            ctx.fillRect(0, canvas.height - characterHeight * 2, canvas.width, characterHeight);
        }

        return { "drawChar": drawChar, "generateDisplay": generateDisplay, "scrollDisplay": scrollDisplay };
    };
    
    
    function Display(width, height) {
        var canvas, ctx, x, y, savedX, savedY, foreground, background, bold, inverse;

     
        canvas = codepage.generateDisplay(width, height);
        ctx = canvas.getContext("2d");

        function homeCursor() {
            x = 1;
            y = 1;
        }

        function resetAttributes() {
            foreground = 7;
            background = 0;
            bold = false;
            inverse = false;
        }

        function setBold(value) {
            bold = value;
        }

        function setInverse(value) {
            inverse = value;
        }

        function setPos(newX, newY) {
            x = Math.min(width, Math.max(1, newX));
            y = Math.min(height, Math.max(1, newY));
        }

        function setForeground(value) {
            foreground = value;
        }

        function setBackground(value) {
            background = value;
        }

        function clearToEndOfLine() {
            var i;
            for (i = x; i < width; ++i) {
                codepage.drawChar(ctx, 0, 0, 0, i, y);
            }
        }

        function clearScreen() {
            homeCursor();
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function up(num) {
            y = Math.max(1, y - num);
        }

        function down(num) {
            y = Math.min(height - 1, y + num);
        }

        function newLine() {
            x = 1;
            if (y === height - 1) {
                codepage.scrollDisplay(ctx, canvas);
                return true;
            }
            ++y;
            return false;
        }

        function back(num) {
            x = Math.max(1, x - num);
        }

        function forward(num) {
            if (x === width) { newLine(); }
            x = Math.min(width, x + num);
        }

        function drawChar(asciiCode) {
            switch (asciiCode) {
            case 26:
                break;
            default:
                if (!inverse) {
                    codepage.drawChar(ctx, asciiCode, bold ? foreground + 8 : foreground, background, x++, y);
                } else {
                    codepage.drawChar(ctx, asciiCode, bold ? background + 8 : background, foreground, x++, y);
                }
                if (x === width + 1) { return newLine(); }
            }
            return false;
        }

        function savePosition() {
            savedX = x;
            savedY = y;
        }

        function restorePosition() {
            x = savedX;
            y = savedY;
        }

        homeCursor();
        resetAttributes();
       
        return {
            "resetAttributes": resetAttributes,
            "setBold": setBold,
            "setInverse": setInverse,
            "setPos": setPos,
            "up": up,
            "down": down,
            "newLine": newLine,
            "back": back,
            "forward": forward,
            "setForeground": setForeground,
            "setBackground": setBackground,
            "clearToEndOfLine": clearToEndOfLine,
            "clearScreen": clearScreen,
            "canvas": canvas,
            "drawChar": drawChar,
            "savePosition": savePosition,
            "restorePosition": restorePosition
        };
    }

function Interpreter(url, callback) {
        var http, buffer, pos, escaped, escapeCode;

        function reset() {
            pos = 0;
            escapeCode = "";
            escaped = false;
        }

        http = new XMLHttpRequest();
        http.open("GET", url, true);

        http.onreadystatechange = function () {
            
            if (http.readyState === 4) {
                if (http.status === 200) {
                    buffer = new Uint8Array(http.response);
                    reset();
                    callback();
                } else {
                    throw ("Could not retrieve: " + url);
                }
            }
        };

        http.setRequestHeader("Content-Type", "application/octet-stream");
        http.responseType = "arraybuffer";
        http.send();

        function read(mycharactersatonce, display) {
            var i, j, code, values;

            function getValues() {
                return escapeCode.substr(1, escapeCode.length - 2).split(";").map(function (value) {
                    var parsedValue;
                    parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? 1 : parsedValue;
                });
            }

            for (i = 0; i < mycharactersatonce; ++i) {

                if (pos === buffer.length || buffer[pos] === 26) { return i; }
                code = buffer[pos++];
                if (escaped) {
                    escapeCode += String.fromCharCode(code);
                    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
                        escaped = false;
                        values = getValues();
                        if (escapeCode.charAt(0) === "[") {
                            switch (escapeCode.charAt(escapeCode.length - 1)) {
                            case "A":
                                display.up(values[0]);
                                break;
                            case "B":
                                display.down(values[0]);
                                break;
                            case "C":
                                display.forward(values[0]);
                                break;
                            case "D":
                                display.back(values[0]);
                                break;
                            case "H":
                                if (values.length === 1) {
                                    display.setPos(1, Math.min(values[0]));
                                } else {
                                    display.setPos(values[1], values[0]);
                                }
                                break;
                            case "J":
                                if (values[0] === 2) {
                                    display.clearScreen();
                                }
                                break;
                            case "K":
                                display.clearToEndOfLine();
                                break;
                            case "m":
                                for (j = 0; j < values.length; ++j) {
                                    if (values[j] >= 30 && values[j] <= 37) {
                                        display.setForeground(values[j] - 30);
                                    } else if (values[j] >= 40 && values[j] <= 47) {
                                        display.setBackground(values[j] - 40);
                                    } else {
                                        switch (values[j]) {
                                        case 0:
                                            display.resetAttributes();
                                            break;
                                        case 1:
                                            display.setBold(true);
                                            break;
                                        case 5:
                                            break;
                                        case 7:
                                            display.setInverse(true);
                                            break;
                                        case 22:
                                            display.setBold(false);
                                            break;
                                        case 27:
                                            display.setInverse(false);
                                            break;
                                        case 39:
                                            break;
                                        default:
                                            break;
                                        }
                                    }
                                }
                                break;
                            case "s":
                                display.savePosition();
                                break;
                            case "u":
                                display.restorePosition();
                                break;
                            default:
                                break;
                            }
                        }
                        escapeCode = "";
                    }
                } else {
                    if (code === 27 && buffer[pos] === 0x5B) {
                        escaped = true;
                    } else if (code === 13 && buffer[pos] === 10) {
                        ++pos;
                        if (display.newLine()) {
                            return i + 1;
                        }
                    } else {
                        if (display.drawChar(code)) {
                            return i + 1;
                        }
                    }
                }
            }
            return i + 1;
        }

        return { "read": read, "reset": reset };
    }

