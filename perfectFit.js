function perfectFit(textId, minFontSize="1em", fontFamily, verticalMargin="20px"){
    
    var DEBUG = true;
    function debug(msg){
        if (DEBUG){ console.log(msg); }
    }   
    debug("Running perfectFit with DEBUG = true.");
    debug("textId=" + textId + " fontFamily=" + fontFamily 
       + " minFontSize=" + minFontSize + " verticalMargin=" + verticalMargin);
    // get heading and it's container
    var elem = document.getElementById(textId);
    // save it's contents (should be text only)
    var text = elem.innerHTML;
    // split it's contents into words
    var words = text.split(/\s+/);
    // get rendered width of the whole text string 
    var totalWidth;
    [totalWidth, , ] = getStringWidthHeight(text, minFontSize, fontFamily);
    // get the width of a space
    var spacing, spacing2;
    [spacing, , ] = getStringWidthHeight("a o", minFontSize, fontFamily);
    [spacing2, , ] = getStringWidthHeight("ao", minFontSize, fontFamily);
    spacing = (spacing - spacing2)/2.0;
    debug("spacing: ", spacing);
    // prepare to process individual words
    var svgs = "";
    var wordWidth, wordHeight;
    for (var word of words){ 
        // Get the metrics of each word
        [wordWidth, wordHeight, wordDescent] = getStringWidthHeight(word, minFontSize, fontFamily);
        // create an SVG for each word
        svgs += svgWord(word, wordWidth, wordHeight, wordDescent, wordWidth/totalWidth * 100, minFontSize, fontFamily);
    }
    // replace elem's contents with svgs
    elem.innerHTML = svgs;
    // Style elem as Flexbox
    Object.assign(elem.style, {
        display:"flex",
        flexWrap: "wrap",
        alignItems: "center",
        marginLeft: "-" + spacing+"px",
        marginRight: "-" + spacing+"px",
        //marginBottom: "-" + verticalMargin
    });
    
    function svgWord(text, width, height, descent, percentage, fontSize, fontFamily){
        return "<svg style='margin-top: " + verticalMargin + "; "
                         + "margin-left: "+spacing+"px; "
                         + "margin-right: "+spacing+"px; "
                         + "overflow: visible; "
                         + "min-width:" + width + "px; "
                         + "flex-basis:"+ width + "px; "
                         + "flex-grow:" + percentage + "; "
                         + "height:100%;" + "' "
                         + "viewBox='0 0 " + width + " " + (height+descent) + "'>"
        + "<text x='0' y='"+((height+descent)/2.0)+"' font-family='"+fontFamily+"' font-size='"+fontSize+"' dominant-baseline='central' >" + text 
            +"</text></svg>"
    }

    function getStringWidthHeight(text, fontSize, fontFamily) { // TODO just get text styles from DOM
        var width, height;
        // This is tricky. There are a few methods we can use, in fallback order:
        // 1. Use canvas context.measureText(). This is not supported by any browsers but will be eventually.
        // https://html.spec.whatwg.org/dev/canvas.html#drawing-text-to-the-bitmap
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        if (typeof(ctx) != 'undefined'){ // we have canvas
            ctx.font = fontSize + " " + fontFamily;
            debug("font: " + ctx.font);
            var metrics = ctx.measureText(text);
            var height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            var descent = metrics.actualBoundingBoxDescent;
            var width = metrics.width;
            if (typeof(height) != 'undefined' && !isNaN(height)){ 
                // we have measureText()!!
                debug("using measureText() for: ");
                debug(text);
                debug("width: " + width + " height: " + height+ " descent: " + descent);
                return [width, height, descent];
            }
            // 2. No measureText() so manually scan pixels to find the bounding box
            // Scanline code copied from https://github.com/Pomax/fontmetrics.js
            var padding = 100;
            canvas.width = width + padding;
            fontSizePx = fontSize.replace("px","");
            canvas.height = 3 * fontSizePx;
            canvas.style.opacity = 1;
            ctx.font = fontSize + " " + fontFamily; // Apparently we have to set this again??
            debug("font: " + ctx.font);

            var w = canvas.width,
                h = canvas.height,
                baseline = h/2;

            // Set all canvas pixeldata values to 255, with all the content
            // data being 0. This lets us scan for data[i] != 255.
            ctx.fillStyle = "white";
            ctx.fillRect(-1, -1, w+2, h+2);
            ctx.fillStyle = "black";
            ctx.fillText(text, padding/2, baseline);
            var pixelData = ctx.getImageData(0, 0, w, h).data;

            // canvas pixel data is w*4 by h*4, because R, G, B and A are separate,
            // consecutive values in the array, rather than stored as 32 bit ints.
            var i = 0,
                w4 = w * 4,
                len = pixelData.length;

            // Finding the ascent uses a normal, forward scanline
            while (++i < len && pixelData[i] === 255) {}
            var asc = (i/w4)|0;

            // Finding the descent uses a reverse scanline
            i = len - 1;
            while (--i > 0 && pixelData[i] === 255) {}
            var desc = (i/w4)|0;

            // find the min-x coordinate
            /*for(i = 0; i<len && pixelData[i] === 255; ) {
              i += w4;
              if(i>=len) { i = (i-len) + 4; }}
            var minx = ((i%w4)/4) | 0;*/

            // find the max-x coordinate
            /*var step = 1;
            for(i = len-3; i>=0 && pixelData[i] === 255; ) {
              i -= w4;
              if(i<0) { i = (len - 3) - (step++)*4; }}
            var maxx = ((i%w4)/4) + 1 | 0;*/

            // set font metrics
            var ascent = (baseline - asc);
            var descent = 1+(desc - baseline);
            var height = 1+(desc - asc);
            // var width = maxx - minx;
            // Don't use manually scanned width - it takes away all glyph
            // padding and so will be different to the rendering in the SVG
            
            debug("scanned pixel by pixel: " + text);
            debug("width: " + width + " height: " + height+ " descent: " + descent);
            debug("-----------------------------------------");
            return [width, height, descent];
        
        }
        // 3. If canvas isn't supported at all, use element.scrollWidth and scrollHeight.
        // The width is accurate but the height is off.
        var e = document.createElement('div');
        e.innerHTML = text;
        // Hide the elem and make it take up zero layout space
        Object.assign(e.style, {
            visibility:"hidden",
            display:"inline-block",
            position:"fixed",
            top:"0px",
            left:"0px",
            overflow:"visible",
            whiteSpace:"nowrap",
            padding:0,
            margin: 0,
            fontSize: minFontSize,
            fontFamily: fontFamily
        });
        document.body.appendChild(e);
        var width = e.scrollWidth;
        // Take a guess at lineheight. This really sucks.
        var height = e.scrollHeight / 1.3;
        // e.style.width = "1ex";
        //var exHeight = e.scrollWidth;
        var descent = 0;
        document.body.removeChild(e);
        debug("using scrollWidth/Height for: " + text);
        debug("width: " + width + " height: " + height+ " descent: " + descent);
        return [width, height, descent];    
    } 
}
