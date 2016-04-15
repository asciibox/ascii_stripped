ascii viewer
==============

This is an ANSI viewer, a stripped version of the ascii rocks editor. 
There are other ANSI viewers as well in the wild, for example [escape.js](https://github.com/atdt/escapes.js/)
The only difference to escape.js is that it 
 - shows the ANSI fullscreen
 - has an own scrollbar, not the one from the browser
 - theoretically supports 256 colors xterm ansi (but it's not tested yet)
 - makes use of requestanimframe, therefore is slower
 - you can setup a speed inside requestanimframe.js

Contains pure JS and HTML to show .ANS files in the window, not more. Also adds scrollbars if the ANSI file exceeds the width and height of the window.

Contains a default.txt and create_default.php in case you deploy this somewhere, the original .ANS might have the wrong encoding, create_default.php then creates a correct .ANS file from the text file which can get shown online.

By default, test.ans will get shown.