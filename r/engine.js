var isEditable = true
var rawCE = ""
var carPos = 0
var x = document.getElementById('main-txtbox')
var noteKey = ""


function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

if (findGetParameter('p')) {
    noteKey = findGetParameter('p')
    document.title = noteKey
    document.querySelector("meta[property='og:title']").setAttribute("content",noteKey)    
}
else {
    alert("404 not found")
}








window.onload = (event) => {
    console.log('a')
    var t = document.getElementById('main-txtbox')
    t.innerHTML = "Loading.."

    var uri = "https://rtnf.000webhostapp.com/b.php"
    var data = new FormData()
    data.append('key', noteKey)
    fetch(uri, { method: 'POST', body: data, }).then(data => {
        data.text().then(function (result) {
            console.log(result)
            if (result == 'n') {
                alert('404 not found')
            }
            else {
                //t.innerHTML = result;
                mdToggle(result);
            }
        })
    })


  
    
}







//3 detik sekali autosave
//var intervalID = setInterval(function(){saveChanges()},100000)



/*
//Autosave when close
//Bisa di Firefox. Dilarang di Chromium -_-
window.onbeforeunload = function(){
	saveChanges(0);
	return null;
}
*/







function parseMarkdown(markdownText) {
    const htmlText = markdownText
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<center><h1>$1</h1></center>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/^---/gim, '<hr>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/\n$/gim, '<br />')

    return htmlText.trim()
}







function Slimdown() {

    // Rules
    this.rules = [
        { regex: /(#+)(.*)/g, replacement: header },                                         // headers
        { regex: /!\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<img src=\'$2\' alt=\'$1\'>' }, // image
        { regex: /\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<a href=\'$2\'>$1</a>' },        // hyperlink
        { regex: /(\*\*|__)(.*?)\1/g, replacement: '<strong>$2</strong>' },                  // bold
        { regex: /(\*|_)(.*?)\1/g, replacement: '<em>$2</em>' },                             // emphasis
        { regex: /\~\~(.*?)\~\~/g, replacement: '<del>$1</del>' },                           // del
        { regex: /\:\"(.*?)\"\:/g, replacement: '<q>$1</q>' },                               // quote
        { regex: /`(.*?)`/g, replacement: '<code>$1</code>' },                               // inline code
        { regex: /\n\*(.*)/g, replacement: ulList },                                         // ul lists
        { regex: /\n[0-9]+\.(.*)/g, replacement: olList },                                   // ol lists
        { regex: /\n(&gt;|\>)(.*)/g, replacement: blockquote },                              // blockquotes
        { regex: /\n-{3,}/g, replacement: '\n<hr />' },                                      // horizontal rule
        { regex: /\n([^\n]+)\n/g, replacement: para },                                       // add paragraphs
        { regex: /<\/ul>\s?<ul>/g, replacement: '' },                                        // fix extra ul
        { regex: /<\/ol>\s?<ol>/g, replacement: '' },                                        // fix extra ol
        { regex: /<\/blockquote><blockquote>/g, replacement: '\n' }                          // fix extra blockquote

    ];

    // Add a rule.
    this.addRule = function (regex, replacement) {
        regex.global = true;
        regex.multiline = false;
        this.rules.push({ regex: regex, replacement: replacement });
    };

    // Render some Markdown into HTML.
    this.render = function (text) {
        text = '\n' + text + '\n';
        this.rules.forEach(function (rule) {
            text = text.replace(rule.regex, rule.replacement);
        });
        return text.trim();
    };

    function para(text, line) {
        debugger;
        var trimmed = line.trim();
        if (/^<\/?(ul|ol|li|h|p|bl)/i.test(trimmed)) {
            return '\n' + line + '\n';
        }
        return '\n<p>' + trimmed + '</p>\n';
    }

    function ulList(text, item) {
        return '\n<ul>\n\t<li>' + item.trim() + '</li>\n</ul>';
    }

    function olList(text, item) {
        return '\n<ol>\n\t<li>' + item.trim() + '</li>\n</ol>';
    }

    function blockquote(text, tmp, item) {
        return '\n<blockquote>' + item.trim() + '</blockquote>';
    }

    function header(text, chars, content) {
        var level = chars.length;
        if (level == 1) {
            return "<center><h1>" + content.trim() + "</h1></center>"
        }
        return '<h' + level + '>' + content.trim() + '</h' + level + '>';
    }
}

var sd = new Slimdown();


function mdToggle(x) {
   
    var textarea = document.getElementById('main-txtbox')
    rawCE = x
    console.log(rawCE)
    var prcCE = rawCE.replace(/<div><br><\/div>/gi, "\n")
    prcCE = prcCE.replace(/<div>/gi, "\n")
    prcCE = prcCE.replace(/<\/div>/gi, "")
    prcCE = prcCE.replace(/&gt;/gi, ">")
    prcCE = prcCE.replace(/&lt;/gi, "<")
    prcCE = prcCE.replace(/&nbsp;/gi, " ")
    prcCE = prcCE.replace(/<br>/gi, "\n")
    prcCE = prcCE.replace(/\n\n```/gi, "\n```")
    console.log(prcCE)
    //prcCE = parseMarkdown(prcCE)
    //prcCE = sd.render(prcCE)
    prcCE = marked.parse(prcCE)
    textarea.innerHTML = prcCE
    hljs.highlightAll();
    

}


function preprocessMD(x) {
    var prcCE = x.replace(/<div><br><\/div>/gi, "\n")
    prcCE = prcCE.replace(/<div>/gi, "\n")
    prcCE = prcCE.replace(/<\/div>/gi, "")
    prcCE = prcCE.replace(/&gt;/gi, ">")
    prcCE = prcCE.replace(/&lt;/gi, "<")
    prcCE = prcCE.replace(/&nbsp;/gi, " ")
    prcCE = prcCE.replace(/<br>/gi, "\n")
    prcCE = prcCE.replace(/\n\n```/gi, "\n```")
    return prcCE

}


document.onkeyup = function (e) {
    
  //Ctrl+. : Create New Node
    if (e.ctrlKey && e.which == 190) {
        mdToggle()
      


        
    }
}

function getCaretTopPoint() {
    const sel = document.getSelection()
    const r = sel.getRangeAt(0)
    let rect
    let r2
    // supposed to be textNode in most cases
    // but div[contenteditable] when empty
    const node = r.startContainer
    const offset = r.startOffset
    if (offset > 0) {
        // new range, don't influence DOM state
        r2 = document.createRange()
        r2.setStart(node, (offset - 1))
        r2.setEnd(node, offset)
        // https://developer.mozilla.org/en-US/docs/Web/API/range.getBoundingClientRect
        // IE9, Safari?(but look good in Safari 8)
        rect = r2.getBoundingClientRect()
        return { left: rect.right, top: rect.top }
    } else if (offset < node.length) {
        r2 = document.createRange()
        // similar but select next on letter
        r2.setStart(node, offset)
        r2.setEnd(node, (offset + 1))
        rect = r2.getBoundingClientRect()
        return { left: rect.left, top: rect.top }
    } else { // textNode has length
        // https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
        rect = node.getBoundingClientRect()
        const styles = getComputedStyle(node)
        const lineHeight = parseInt(styles.lineHeight)
        const fontSize = parseInt(styles.fontSize)
        // roughly half the whitespace... but not exactly
        const delta = (lineHeight - fontSize) / 2
        return { left: rect.left, top: (rect.top + delta) }
    }
}






