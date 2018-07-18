function perfectFit(textId, minWordSize){
   document.fonts.ready.then(function () {
        var tempElem = document.getElementById(textId);
        var container = tempElem.parentElement;
        Object.assign(tempElem.style, {
            visibility:"visible",
            display:"inline-block",
            position:"fixed",
            top:"100px",
            left:"0px",
            overflow:"visible",
            whiteSpace:"nowrap",
            padding:0,
            margin: 0
        });
        var text = tempElem.innerHTML; 
        var words = text.split(/\s+/);
        var totalWidth, width, height;
        [totalWidth, ] = textWidthHeight(text);
        var spacing, spacing2;
        [spacing, ] = textWidthHeight("a a");
        [spacing2, ] = textWidthHeight("aa");
        spacing = spacing - spacing2;
        var output = "";
        for (var word of words){
            var width, height;
            [width, height] = textWidthHeight(word);
            output += svgWord(word, width, height, width/totalWidth * 100);
        }
        container.innerHTML = "<div style='display:flex; flex-wrap:wrap;'>" + output + "</div>";
        
        function svgWord(text, width, height, percentage){/*
            var debug = tempElem.cloneNode(true);
            document.body.appendChild(debug);
            debug.innerHTML = text;*/
            return "<svg style='margin: 0 " + Math.round(spacing * 2)
                           + "; min-width:" + Math.round(minWordSize * width)
                           + "px; flex-basis:"+ Math.round(width)
                           + "px; flex-grow:" + Math.round(percentage)
                           /*+ "; width:" + Math.round(percentage)*/
                           + "; height:100%;" 
                           + "' viewBox='0 0 " + Math.round(width) + " " + Math.round(height) + "'>"
                + "<text id='"+textId+"' x='0' y='0' dominant-baseline='text-before-edge'>" + text 
                +"</text></svg>"
        }

        function textWidthHeight(text){
            tempElem.innerHTML = text;
            var width = tempElem.scrollWidth;
            var height = tempElem.scrollHeight;
            return [width, height];
        } 
   });
}
