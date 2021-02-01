import Tool from '@/tool';
import ArtRender from '..';

class Location {
    anchorInlineOffset: number;
    focusInlineOffset: number;
    anchorAlineOffset: number;
    focusAlineOffset: number;
    anchorOffset: number;
    anchorNode: Node;
    focusNode: Node;
    focusOffset: number;
    constructor(
        anchorInlineOffset: number,
        focusInlineOffset: number,
        anchorAlineOffset: number,
        focusAlineOffset: number,
        anchorOffset: number,
        anchorNode: Node,
        focusOffset: number,
        focusNode: Node) {

        this.anchorInlineOffset = anchorInlineOffset;
        this.focusInlineOffset = focusInlineOffset;
        this.anchorAlineOffset = anchorAlineOffset;
        this.focusAlineOffset = focusAlineOffset;
        this.anchorOffset = anchorOffset;
        this.anchorNode = anchorNode;
        this.focusNode = focusNode;
        this.focusOffset = focusOffset;
    }
}

export default class Cursor {
    static sel: Selection = window.getSelection();

    /**
     * 挂载的DOM
     */
    mountDom: HTMLElement;
    /**
     * 光标位置
     */
    location: Location;
    constructor(mountDom: HTMLElement) {
        this.mountDom = mountDom;
        this.location = null;
    }

    /**
     * 获取光标位置
     */
    public getSelection(): Location {
        let { anchorNode, anchorOffset, focusNode, focusOffset } = Cursor.sel;
        if (anchorNode && focusNode) {
            let node = anchorNode;
            let len = anchorOffset;
            if (node == this.mountDom) {
                this.location = null;
                return this.location;
            }

            while (node.parentNode != this.mountDom) {
                while (node.previousSibling) {
                    node = node.previousSibling;
                    if (!Tool.hasClass(node as HTMLElement, 'art-shield'))
                        len += node.textContent.length;
                }
                node = node.parentNode;
            }

            let nodeF = focusNode;
            let lenF = focusOffset;

            while (nodeF.parentNode !== this.mountDom) {
                while (nodeF.previousSibling) {
                    nodeF = nodeF.previousSibling;
                    if (!Tool.hasClass(nodeF as HTMLElement, 'art-shield'))
                        lenF += nodeF.textContent.length;
                }
                nodeF = nodeF.parentNode;
            }

            let rootNodeSub = -1;
            for (let i = 0; i < this.mountDom.childNodes.length; i++) {
                if (this.mountDom.childNodes[i] === node) {
                    rootNodeSub = i;
                    break;
                }
            }

            let rootNodeSubF = -1;
            for (let i = 0; i < this.mountDom.childNodes.length; i++) {
                if (this.mountDom.childNodes[i] === nodeF) {
                    rootNodeSubF = i;
                    break;
                }
            }
            let name = anchorNode.parentNode.nodeName;
            if (anchorOffset == 0 && anchorNode.previousSibling == null &&
                (name == 'LI' || name == 'P' || name == 'TH' || name == 'TD')) {
                anchorNode = anchorNode.parentNode;
            }
            this.location = new Location(len, lenF, rootNodeSub, rootNodeSubF, anchorOffset, anchorNode, focusOffset, focusNode);
        } else {
            this.location = null;
        }
        return this.location;
    }
    private searchNode(node: Node, len: number) {
        if (node.childNodes.length == 1 && node.childNodes[0].nodeName == '#text') {
            if (len <= node.childNodes[0].textContent.length)
                return [node.childNodes[0], len];
            else
                len -= node.textContent.length;
        }

        else {
            for (let i = 0; i < node.childNodes.length; i++) {
                if (Tool.hasClass(node.childNodes[i] as HTMLElement, 'art-shield'))
                    continue;
                if (node.childNodes[i].textContent.length < len) {
                    len -= node.childNodes[i].textContent.length;
                } else if (node.childNodes[i].nodeName === "#text") {
                    return [node.childNodes[i], len]
                } else {
                    return this.searchNode(node.childNodes[i], len)
                }
            }
        }

        if (len == 1 && node.nextSibling) {
            return [node.nextSibling, 0];
        }
        return null
    }
    private setTool(alineDom: HTMLElement): boolean {
        let tools = this.mountDom.getElementsByClassName('art-tocTool');
        for (let i = 0; i < tools.length; i++) {
            (<HTMLElement>tools[i]).style.visibility = 'hidden';
            (<HTMLElement>tools[i].nextSibling).style.borderColor = '#9990';
        }

        if (Tool.hasClass(alineDom, 'art-shield')) {
            if (Tool.hasClass(alineDom, 'art-toc')) {
                if (alineDom.previousSibling && Tool.hasClass(alineDom.previousSibling as HTMLElement, 'art-tocTool')) {
                    (<HTMLElement>alineDom.previousSibling).style.visibility = 'visible';
                    alineDom.style.borderColor = '#999';
                } else {
                    //alineDom.parentNode.insertBefore(tocTool(), alineDom);
                }
                return true;
            }
            return false;
        }
        tools = this.mountDom.getElementsByClassName('art-codeBlockTool');
        for (let i = 0; i < tools.length; i++) {
            (<HTMLElement>tools[i]).style.visibility = 'hidden';
        }

        tools = this.mountDom.getElementsByClassName('art-tableTool');
        for (let i = 0; i < tools.length; i++) {
            (<HTMLElement>tools[i]).style.visibility = 'hidden';
        }

        if (ArtRender.plugins.flowchart) {
            tools = this.mountDom.getElementsByClassName('art-flowTool');
            for (let i = 0; i < tools.length; i++) {
                (<HTMLElement>tools[i]).style.border = 'inherit';
                (<HTMLElement>tools[i].previousSibling).style.display = 'none';
            }
        }

        if (alineDom.nodeName == "PRE") {
            if (Tool.hasClass(alineDom.previousSibling as HTMLElement, "art-codeBlockTool")) {
                (<HTMLElement>alineDom.previousSibling).style.visibility = 'visible';
            } 
            if (ArtRender.plugins.flowchart && Tool.hasClass(alineDom as HTMLElement, "art-pre-flow")) {
                alineDom.style.display = 'inherit';
                (<HTMLDivElement>alineDom.nextSibling).style.border = '1px solid #999';
            }
            return true;
        }
        if (alineDom.nodeName == "TABLE") {
            if (Tool.hasClass(alineDom.previousSibling as HTMLElement, "art-tableTool")) {
                (<HTMLElement>alineDom.previousSibling).style.visibility = 'visible';
            }
            return true;
        }
        return false;
    }
    public setSelection(location: Location = undefined) {
        if (typeof location == undefined || !location) {
            location = this.location;
        }
        if (!location) {
            return false;
        }

        // 隐藏所有的art-show Dom
        let showNodeList = this.mountDom.getElementsByClassName("art-show");
        for (let i = showNodeList.length - 1; i >= 0; i--) {
            let classVal = showNodeList[i].getAttribute("class");
            classVal = classVal.replace("art-show", "art-hide");
            showNodeList[i].setAttribute("class", classVal);
        }

        if (this.location && this.location.anchorInlineOffset == this.location.focusInlineOffset &&
            this.location.anchorAlineOffset == this.location.focusAlineOffset) {
            let info = null;
            var pNode = this.mountDom.childNodes[this.location.focusAlineOffset] as HTMLElement;
            var pLen = this.location.anchorInlineOffset;
            this.setTool(pNode as HTMLElement)
            console.log(this.location)
            if(/art-shield/.test(pNode.className)){
                return null;
            }
            if (pNode.nodeName == 'HR') {
                // 不可调优先度
                info = [pNode, 0];
            } else if (this.location.anchorOffset == 0 && (this.location.anchorNode.nodeName === "LI" || this.location.anchorNode.nodeName === "TH" ||
                this.location.anchorNode.nodeName === "P" || this.location.anchorNode.nodeName === "TD" )) {
                    // 删除 this.location.anchorNode.nodeName === "DIV"
                info = [this.location.anchorNode, 0];
            } else if (this.location.anchorOffset == 0 && this.location.anchorNode.parentNode && ((this.location.anchorNode.parentNode.nodeName == 'CODE' && this.location.anchorNode.parentNode.parentNode.nodeName == 'PRE') || this.location.anchorNode.nodeName == 'CODE' && this.location.anchorNode.parentNode.nodeName == 'PRE')) {
                info = [this.location.anchorNode, 0]
            } else {
                info = this.searchNode(pNode, pLen);
            }
            console.log(info);
            if (info === null)
                return null
            let showNodeList = this.mountDom.getElementsByClassName("art-show-math");
            for (let i = showNodeList.length - 1; i >= 0; i--) {
                let classVal = showNodeList[i].getAttribute("class");
                classVal = classVal.replace("art-show-math", "");
                showNodeList[i].setAttribute("class", classVal);
            }
            if (info[0].nodeName == '#text' && Tool.hasClass(info[0].parentNode, 'art-math')) {
                let classVal = (<HTMLSpanElement>info[0].parentNode.previousSibling.childNodes[0]).getAttribute("class");
                if (classVal == null || classVal.indexOf('art-show-math') < 0) {
                    classVal = 'art-show-math';
                    (<HTMLSpanElement>info[0].parentNode.previousSibling.childNodes[0]).setAttribute("class", classVal);
                }
            }
            Cursor.setCursor(info[0], info[1])

            let art_text_double = info[0].parentNode;
            if (art_text_double && Tool.hasClass(art_text_double, "art-hide")) {
                if (art_text_double.previousSibling && Tool.hasClass(art_text_double.previousSibling, "art-text-double")) {
                    art_text_double = art_text_double.previousSibling;
                } else if (art_text_double.nextSibling && Tool.hasClass(art_text_double.nextSibling, "art-text-double")) {
                    art_text_double = art_text_double.nextSibling;
                }
            }

            if (art_text_double && Tool.hasClass(art_text_double, "art-text-double")) {
                let classVal = art_text_double.nextSibling.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                art_text_double.nextSibling.setAttribute("class", classVal);

                classVal = art_text_double.previousSibling.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                art_text_double.previousSibling.setAttribute("class", classVal);
            }

            if (info[0].nodeName === "#text" && Tool.hasClass(info[0].parentNode, "art-hide")) {
                let classVal = info[0].parentNode.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                info[0].parentNode.setAttribute("class", classVal);
            }
        }
    }

    static setCursor(node: Node, offset: number): boolean {
        if(node == undefined && !node)
            return false;
        let range = Cursor.sel.getRangeAt(0).cloneRange();
        range.setStart(node, offset);
        range.collapse(true);
        Cursor.sel.removeAllRanges();
        Cursor.sel.addRange(range);
    }

    public moveCursor(direcction): boolean {
        switch (direcction) {
            case 'ArrowRight':
                this.location.anchorOffset++;
                this.location.focusOffset++;
                this.location.anchorInlineOffset++;
                this.location.focusInlineOffset++;
                break;
            default:
                return false;
        }
        this.setSelection();
        return true;
    }

}