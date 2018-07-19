function perfectFit(textId, minFontSize="1em"){
   document.fonts.ready.then(function () {
        // get heading and it's container
        var elem = document.getElementById(textId);
        // save it's contents
        var text = elem.innerHTML;
        // split it's contents into words
        var words = text.split(/\s+/);
        // temporarily hide the elem and make it take up zero space
        Object.assign(elem.style, {
            visibility:"hidden",
            display:"inline-block",
            position:"fixed",
            top:"100px",
            left:"0px",
            overflow:"visible",
            whiteSpace:"nowrap",
            padding:0,
            margin: 0,
            fontSize: minFontSize
        });
        // get rendered width of the whole text string 
        var totalWidth;
        totalWidth = elem.scrollWidth;
        // replace it's contents to get the width of a space
        var spacing, spacing2;
        [spacing, ] = textWidthHeight("a a");
        [spacing2, ] = textWidthHeight("aa");
        spacing = spacing - spacing2;
        // prepare to process individual words
        var svgs = "";
        var wordWidth, wordHeight;
        for (var word of words){
            console.log("width");
            // replace elem's contents to get the width of each word
            [wordWidth, wordHeight] = textWidthHeight(word);
            // create an SVG for each word
            svgs += svgWord(word, wordWidth, wordHeight, wordWidth/totalWidth * 100);
        }
        // replace elem's contents with svgs
        elem.innerHTML = svgs;
        // make elem visible again and style it as Flexbox
        Object.assign(elem.style, {
            display:"flex",
            flexWrap: "wrap",
            visibility:"initial",
            position:"initial", // TODO test with different initial styles
            top:"initial",
            left:"initial",
            overflow:"initial",
            whiteSpace:"initial",
            padding:"initial",
            margin: "initial",
            fontSize: "initial",
            marginLeft: "-" + spacing + "px",
            marginRight: "-" + spacing + "px",
        });
        
        function svgWord(text, width, height, percentage){
            return "<svg style='margin: 0px " + spacing + "px; "
                             + "min-width:" + width + "px; "
                             + "flex-basis:"+ width + "px; "
                             + "flex-grow:" + percentage + "; "
                             + "height:100%;" + "' "
                             + "viewBox='0 0 " + width + " " + height + "'>"
                + "<text id='"+textId+"' x='0' y='0' font-size='"+minFontSize+"' dominant-baseline='text-before-edge'>" + text 
                +"</text></svg>"
        }

        function textWidthHeight(text){
            elem.innerHTML = text;
            var width = elem.scrollWidth;
            var height = elem.scrollHeight;
            return [width, height];
        } 
   });
}
