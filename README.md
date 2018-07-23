# perfectFit.js
Make headings fit their divs perfectly.

Features:
- The ONLY text fitting library that properly scales wrapped text.
- Fits text to the exact size of a div, to the pixel, responsively.
- Tiny (~4kB minified).
- No event handlers. Runs once on page load, then lets CSS do the rest. 
- Options for minimum font size and vertical spacing.
- Works with webfonts
- Fully selectable text.
- Tested on latest versions of Chromium and Firefox as of July 2018.

Downsides:
- It changes the markup so might not be suitable for screen readers
- Not yet tested in a variety of browsers (please help!)

Under construction:
- Option to disable text wrapping
- Correctly dealing with text styles and decoration
- Correctly dealing with delayed loading of webfonts
- Compatibility with older browsers and IE
- More exact handling of horizontal space
- Fancy github demo page

Usage:
```
<script src="perfectFit.js"></script>

<style>
    .container {width: 50%;}
    #heading {font-family: "Times New Roman";}
</style>

<div class="container">
    <div id="heading">A Long Expected Party</div>
</div>

<script>
    perfectFit("heading", minFontSize="30px", verticalMargin="8px");
</script>
```

Example using webfonts:

https://css-tricks.com/loading-web-fonts-with-the-web-font-loader/

How it works:

Behind the hood, perfectFit breaks your text into individual words and renders
each word as inline SVG. These are then placed in a Flexbox container which
responsively scales the words to snugly fit the edges of the containing div.
