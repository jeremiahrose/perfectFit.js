# perfectFit.js
Make headings fit their divs perfectly.

Features:
- Tiny. (2kb)
- Fast. Runs once on page load, then lets CSS do the rest. No event handlers.
- The ONLY text fitting library that properly scales wrapped text.
- Optional minimum font size.
- Works with custom fonts & fancy text styles with fully selectable text.
- Tested on latest versions of Chromium and Firefox as of July 2018.

Usage:
<script src="perfectFit.js"></script>
<div class="container">
    <div id="heading">A Long Expected Party</div>
</div>
<script>
    perfectFit("heading", "30px");
</script>

How it works:
Behind the hood, perfectFit breaks your text into individual words and renders
each word as inline SVG. These are then placed in a Flexbox container which
responsively scales the words to snugly fit the edges of the containing div.

Known limitations:
* Requires a modern browser with Flexbox and SVG support. Not yet tested 
on: Safari, Opera, Android or IE, or mobile browsers. I would appreciate some 
help improving the compatibility and writing polyfills where necessary.

* Still ironing out some issues with padding and spacing

* Cannot do hyphenated word-breaks (yet).

* If using webfonts, perfectFit must be run after the fonts are loaded. 
To this end, it uses the document.fonts.ready.then() handler, which 
currently works on Chrome but not in Firefox. For Firefox you will have to
manually ensure that your fonts are loaded before running perfectFit().
