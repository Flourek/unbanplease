const potatGeneralRacism1 = /(\b((=[nhk])(n[i1!¡jl]b+[e3]r|nygg[e3]r|higger|kneeger)[s5z]?)\b)|((chinam[ae]n|ching[\W_]*chong))|((towel|rag|diaper)[\W_]*head[s5z]?)|((sheep|goat|donkey)\W?(fuck|shag)\w*)|((sand|dune)[\W_]*(n[i1!¡jl]g(!ht)|c[o0]{2}n|monk[iey]+)\w*)/gi;

const potatGeneralRacism2 = /((the h[o0]l[o0]caust|gen[o0]cide|there was)[\s\S]*?(the holocaust|genocide)[\s\S]*?((didn[ ''‘’´`]?t|never) happened|(is|was) a lie)|there was[\s\S]*?(no|n[ ''‘’´`]?t an?y?)[\s\S]*?\w*[\s\S]*?(genocide|holocaust))|in[\W_]*bred[s5z]?|filthy jew|bl[a4]cks?|africans? bastard|musl[i1]ms are (violent )?t[e3]rrorists?|r[e3]t[a4]rded m[0o]nkey|bl[a4]cks?|africans? (are|can be|were) (subhuman|primitive)|blackface/gi;

const potatGeneralSlurs = /(\b(f|ph)[áàâäãåa@][g4]+[e3o0]*t*\b)|(\btr[a@4]nn[y¡i1!jl]es?|tr[a@4]nn|trans[vf]est[iy]te|transfag|tranny|trapsexual|she\W?males?)([s5z]?)|(\bbull)?d[yi]ke[s5z]?|(fudge\W?packer|muff\W?diver|(carpet|rug)\W?muncher|pillow\W?biter|shirt\W?lifter|shit\W?stabber|turd\W?burglar)|\bboiola\b|\bplayo\b|\bwomen are nothing more than objects\b|\bwomen are objects\b|\bholocaust\b|(\b[fḞḟ][a4@][g]\b|[fḞḟ]+[a4@]+[g]+[o0]+[t]+)/gi;

const potatRacoonWord = /\bc[o0]{2}ns\b/gi;
const potatNWord = /\b[Nnñ]+[i1|]+[ckgbB6934qğĜƃ၅5]+[e3]u?r+|nigg/gi;
const potatCWord = /\bc+h+i+n+k+s*/gi;
const potatTWord = /\bt+r+[a4]+n+(i+[e3]+|y+|[e3]+r+)s*/gi;
const potatFWord = /\bf+[a4@]+[gbB6934qğĜƃ၅5]+([oei]+t+(r+y+|r+i+[e3]+)?)?s*/gi;

function censorText(selector) {
    const $element = $(selector);

    // Function to mask a bad word with only first and last letters visible
    function maskWord(word) {
        return word[0] + "-".repeat(word.length - 2) + word.slice(-1);
    }

    // List of regex patterns to check against
    const patterns = [
        potatGeneralRacism1,
        potatGeneralRacism2,
        potatGeneralSlurs,
        potatRacoonWord,
        potatNWord,
        potatCWord,
        potatTWord,
        potatFWord
    ];

    // Function to replace bad words within a text string
    function censorTextContent(text) {
        patterns.forEach(regex => {
            text = text.replace(regex, match => maskWord(match));
        });
        return text;
    }

    // Recursive function to traverse and censor text nodes
    function traverseAndCensor(element) {
        element.contents().each(function() {
            if (this.nodeType === Node.TEXT_NODE) {
                // Replace text content if it’s a text node
                this.nodeValue = censorTextContent(this.nodeValue);
            } else {
                // Recursively handle child elements
                traverseAndCensor($(this));
            }
        });
    }

    // Start the recursive censoring process
    traverseAndCensor($element);
}

