import Parser from "@/parser";
import VNode from "@/node";
import { OPENTAG, CLOSETAG, TAGNAME, ATTRIBUTE } from "@/parser/common"

export default class InteractionParser {
    public parser: Parser;
    private html_inlines: { name: string, open: boolean, attrs: Map<string, string>, node: VNode} [];
    constructor(options) {
        this.parser = new Parser(options);
    }

    public image(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            
            text._literal = "![";
            if (node.firstChild) {
                text._literal += node.firstChild._literal;
            }
            text._literal += "](" + node._destination;
            if (node._title)
                text._literal += "\"" + node._title + "\"";

            text._literal += ")";
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("contenteditable", "false");
        }

    }

    public heading(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = "#".repeat(node._level) + " ";
            span.appendChild(text);
            node.prependChild(span);

            let md = node.getMd();
            md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
            let a = new VNode('link');
            a.attrs.set('name', md);
            a.attrs.set('class', 'art-meta art-shield');
            node.prependChild(a);
        }
    }

    public link(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = '[';
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = '](' + node._destination + ')';
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public code(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = '`';
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = '`';
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    private html_inline(node: VNode, entering: boolean) {
        if (entering) {
            const reHtmlOpenTag = new RegExp("^<(" + TAGNAME + ")(" + ATTRIBUTE + "*)\\s*/?>");
            const reHtmlCloseTag = new RegExp("^</(" + TAGNAME + ")\\s*[>]");
            let match, info: { name: string, open: boolean, attrs: Map<string, string>, node: VNode} = Object();
            if (match = node._literal.match(reHtmlOpenTag)) {
                info.name = match[1];
                info.open = true;
                info.attrs = new Map();
                info.node = node;
                let m;
                while(m = match[2].match(/\s*(.*?)="(.*?)"/)) {
                    info.attrs.set(m[1], m[2]);
                    match[2] = match[2].replace(m[0], "");
                }
                this.html_inlines.push(info);
            } else if (match = node._literal.match(reHtmlCloseTag)) {
                let name = match[1];
                
                for (let i = this.html_inlines.length - 1; i >= 0; i--) {
                    console.log(node, this.html_inlines[i].node)
                    if (node.parent !== this.html_inlines[i].node.parent) {

                    }
                    if (name === this.html_inlines[i].name) {
                        let tag = new VNode(name);
                        tag.attrs = this.html_inlines[i].attrs;
                        console.log(this.html_inlines[i]);
                        let child = node.prev, prev;
                        while (child && child !== this.html_inlines[i].node) {
                            prev = child.prev;
                            tag.prependChild(child);
    
                            child = prev;
                        }
                        node.insertBefore(tag);

                        node.attrs.set("class", "art-hide");
                        this.html_inlines[i].node.attrs.set("class", "art-hide");
                        let cla = tag.attrs.get("class");
                        if (cla) {
                            tag.attrs.set("class", cla + " art-text-double");
                        } else {
                            tag.attrs.set("class", "art-text-double");
                        }
                        break;
                    }
                }
            }

            console.log(node, match, info)
        }
    }

    private html_block(node: VNode, entering: boolean) {
        if (entering) {
            console.log(node)
        }
    }

    private item(node: VNode, entering: boolean) {
        if (entering) {
            if (node.firstChild && node.firstChild.type === "item_checkbox") {
                node.attrs.set("class", "art-md-item-checkbox");
                node.firstChild.attrs.delete("disabled");
            }
        }
    }

    private math(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = '$';
            span.appendChild(text);
            node.insertBefore(span);

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = '$';
            span.appendChild(text);
            node.insertAfter(span);

            span = new VNode("span");
            span.attrs.set("class", "art-text-double");
            node.replace(span);

            let child = node.firstChild;
            let _literal = "";
            while (child) {
                _literal += child._literal;
                child = child.next;
            }

            let art_tool = new VNode("art_tool");
            art_tool.attrs.set("--tool", "math");
            art_tool.attrs.set("--math", _literal);
            span.appendChild(art_tool);

            node.attrs.set("class", "art-text-parent art-md-math");

            span.appendChild(node);
        }
    }

    public emph(node: VNode, entering: boolean) {
        if (entering) {
            if (node.firstChild.type === "strong")
                return;
            let art_mark = node.firstChild.type === 'strong' ? node.firstChild.attrs.get('art-marker') : node.attrs.get('art-marker');

            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = art_mark;
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = art_mark;
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public strong(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = node.attrs.get('art-marker');
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = node.attrs.get('art-marker');
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public delete(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = node.attrs.get('art-marker');
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = node.attrs.get('art-marker');
            span.appendChild(text);
            node.insertAfter(span);
        }
    }
    
    private table(node: VNode, entering: boolean) {
        if (entering) {
            node.attrs.set("class", "art-md-table");

            let art_tool = new VNode("art_tool");
            art_tool.attrs.set("--tool", "table");
            node.insertBefore(art_tool);
        }
    }

    public interactionParse(ast: VNode) {
        let walker = ast.walker(),
            event: { entering: boolean; node: VNode; },
            type: string;

        this.html_inlines = [];
        while ((event = walker.next())) {
            type = event.node.type;

            if (this[type]) {
                this[type](event.node, event.entering);
            }
        }
    }

    public parse(input: string): VNode {
        let doc = this.parser.parse(input);
        this.interactionParse(doc);

        return doc;
    }

    public inlineParse(input: string): VNode {
        let doc = new VNode("paragraph");
        doc._string_content = input;
        this.parser.inlineParser.parse(doc);
        this.interactionParse(doc);

        return doc;
    }
}