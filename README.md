# perfectFit.js
Make headings fit their divs perfectly.

Features:
- The ONLY text fitting library that properly scales wrapped text.
- Fits text to the exact size of a div, to the pixel, responsively.
- Tiny (~4kB minified).
- No event handlers. Runs once on page load, then lets CSS do the rest. 
- Options for minimum font size and vertical spacing.
- Works with webfonts, text styles, shadows, transforms
- Fully selectable text.
- Tested on latest versions of Chromium and Firefox as of July 2018.

Downsides:
- It changes the markup so might not be suitable for screen readers
- Not yet tested in a variety of browsers (please help!)
- Doesn't work well with underlined text (there will be gaps between the words)

Under construction:
- Option to disable text wrapping
- Correct handling of non-default letter-spacing
- Compatibility with older browsers and IE
- More exact handling of horizontal space
- Fancy github demo page
- Webfont loading example

Usage:
```
<script src="perfectFit.js"></script>

<style>
    .container {width: 50%;}
    h1 {font-family: "Times New Roman", Times, serif;}
</style>

<div class="container">
    <h1 id="heading">A Long Expected Party</h1>
</div>

<script>
    perfectFit("heading", minFontSize="30px", verticalSpacing="8px");
</script>
```

A note about webfonts:

It is your responsibility to make sure your font is loaded and rendered in the 
browser before running perfectFit(), otherwise your text will not scale
correctly. The Google Web Font Loader will help you out with this:
https://github.com/typekit/webfontloader

How it works:

Behind the hood, perfectFit breaks your text into individual words and renders
each word as inline SVG. These are then placed in a Flexbox container which
responsively scales the words to snugly fit the edges of the containing div.
