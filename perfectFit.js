function perfectFit(textId, minFontSize="1em"){
   document.fonts.ready.then(function () {
        var tempElem = document.getElementById(textId);
        var container = tempElem.parentElement;
        console.log(minFontSize);
        Object.assign(tempElem.style, {
            visibility:"visible",
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
            console.log("width");
            [width, height] = textWidthHeight(word);
            output += svgWord(word, width, height, width/totalWidth * 100);
        }
        container.innerHTML = "<div style='display:flex; flex-wrap:wrap;'>" + output + "</div>";
        
        function svgWord(text, width, height, percentage){
            return "<svg style='padding: 0px " + spacing * 2 + "px; "
                             + "min-width:" + width + "px; "
                             + "flex-basis:"+ width + "px; "
                             + "flex-grow:" + Math.round(percentage) + "; "
                             + "height:100%;" + "' "
                             + "viewBox='0 0 " + Math.round(width) + " " + Math.round(height) + "'>"
                + "<text id='"+textId+"' x='0' y='0' font-size='"+minFontSize+"' dominant-baseline='text-before-edge'>" + text 
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
