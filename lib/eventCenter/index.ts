import { htmlToMd } from "../editor/toNode/index"
import ArtText from "../index";
import { blod, italic, del, ins, sup, sub, mark } from "../tool/default";
import Tool from "../tool";
export function executeFutureEvent(target, name, descriptor) {
    target;
    let oldValue = descriptor.value;

    descriptor.value = function() {
        for (let art of ArtText.artTexts) {
            art.eventCenter.executeFutureEvent('start-' + name)
        }
        oldValue.apply(this, arguments)
        for (let art of ArtText.artTexts) {
            art.eventCenter.executeFutureEvent('end-' + name)
        }
    };
    return descriptor;
}
class EventCenter {

    editorHtmlDom: HTMLElement;
    uploadImg: Function;
    clickInfo: Map<string, number>;
    artText: ArtText;
    isComposition: boolean;
    futureEvent: Map<string, Function[]>;
    observer: MutationObserver;
    eventListeners: any[];

    constructor(artText: ArtText) {
        this.artText = artText;
        this.editorHtmlDom = null;
        this.uploadImg = null;
        this.clickInfo = null;
        this.isComposition = false;
        this.futureEvent = new Map();
        this.observer = new MutationObserver(this.observerCallback);
        this.eventListeners = [];
    }

    init(): void {
        this.editorHtmlDom = this.artText.editor.htmlNode.dom;
        this.addEventListener('keydown', this.keydown);
        this.addEventListener('keyup', this.keyup);

        // this.onfocus      
        // this.onblur

        this.addEventListener('compositionstart', (e: CompositionEvent, _this: EventCenter) => { e; _this.isComposition = true; });
        this.addEventListener('compositionend', (e: CompositionEvent, _this: EventCenter) => { e; _this.isComposition = false; });

        this.addEventListener('click', this.click);
        this.addEventListener('contextmenu', this.contextmenu);
        this.addEventListener('mousedown', this.mousedown)

        // 贴贴事件
        this.addEventListener('paste', this.paste);

        // 拖拽事件
        this.addEventListener('drop', this.drop)
        // this.ondrag

        // 设置observer的配置选项
        //let config = { attributes: true, childList: true, subtree: true };

        //this.observer.observe(this.editorHtmlDom, config);
    }
    observerCallback(mutationsList, observer) {
        observer;
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                console.log('A child node has been added or removed.');
            }
            else if (mutation.type == 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }

        }
    }

    addFutureEvent(name: string, fun: Function) {
        if (this.futureEvent.has(name)) {
            this.futureEvent.get(name).push(fun);
        } else {
            this.futureEvent.set(name, [fun]);
        }
    }
    executeFutureEvent(name: string) {
        if (this.futureEvent.has(name)) {
            let _list = this.futureEvent.get(name);
            for (let i = _list.length - 1; i >= 0; i--) {
                _list[i]();
            }
            this.futureEvent.set(name, []);
        }
    }
    addEventListener(eventName: string, fun: Function, useCapture: boolean = false): void {
        let _this = this;
        function closure(e) {
            _this.artText.editor.cursor.getSelection();
            fun(e, _this);
        }
        this.editorHtmlDom.addEventListener(eventName, closure, useCapture);
        this.eventListeners.push([eventName, closure, useCapture])
    }

    removeEventListener(eventName: string, fun: EventListenerOrEventListenerObject, useCapture: boolean = false): void {
        this.editorHtmlDom.removeEventListener(eventName, fun, useCapture);
    }

    removeAllEventListener(){
        for(let e of this.eventListeners){
            this.removeEventListener(e[0], e[1], e[2]);
        }
    }

    keydown(e: KeyboardEvent, _this: EventCenter): boolean {
        let key: string = e.key;
        console.log(key);
        if (!_this.shortcutKey(e, _this.artText)) {
            // 是否摁下快捷键
            return false;
        } else if (/^Arrow(Right|Left|Up|Down)$/.test(key) && _this.artText.editor.cursor.moveCursor(key)){
            e.preventDefault();
            return false;
        } else if (key == 'Enter') {
            // 回车时渲染
            if (!_this.artText.editor.enterRender()) {
                e.preventDefault();
                return false;
            }
        } else if (key == 'Backspace') {
            // 退格时渲染
            if (!_this.artText.editor.backRender()) {
                e.preventDefault();
                return false;
            }
        }
        return true;
    }

    shortcutKey(e: KeyboardEvent, artText: ArtText): boolean {
        if (e.ctrlKey && e.keyCode == 66) {
            // ctrl + b 粗体
            blod(artText);
        } else if (e.ctrlKey && e.keyCode == 73) {
            // ctrl + i 斜体
            italic(artText);
        } else if (e.ctrlKey && e.shiftKey && e.keyCode == 68) {
            // ctrl + shift + d 删除线
            del(artText);
        } else if (e.ctrlKey && e.keyCode == 85) {
            // ctrl + u 下划线
            ins(artText);
        } else if (e.ctrlKey && e.altKey && e.keyCode == 83) {
            // ctrl + alt + s 上标
            sup(artText);
        } else if (e.ctrlKey && e.shiftKey && e.keyCode == 83) {
            // ctrl + shift + s 下标
            sub(artText);
        } else if (e.ctrlKey && e.keyCode == 77) {
            // ctrl + m 标记
            mark(artText);
        } else {
            return true;
        }
        return false;
    }

    keyup(e: KeyboardEvent, _this: EventCenter) {
        let key: string = e.key;
        if (key == 'Backspan') {
            if (_this.editorHtmlDom.innerHTML == "") {
                // html编辑器为空时
                _this.editorHtmlDom.innerHTML = "<div><p><br/></p></div>"
            }
        }
        if (!_this.isComposition) {
            // 输入法不为连续时，如中文输入时
            _this.artText.editor.render();
        }
    }

    /**左点击 */
    click(e: MouseEvent, _this: EventCenter) {
        let dom = e.target as HTMLAnchorElement;
        if (e.altKey && dom.nodeName == "A") {
            //window.location.href=node.href;
            window.open(dom.href)
        } else {
            let cursor = _this.artText.editor.cursor;
            if(cursor.location && cursor.location.anchorInlineOffset != cursor.location.focusInlineOffset 
                && cursor.location.anchorAlineOffset == cursor.location.focusAlineOffset){
                _this.artText.tool.setFloatToolbar('show');
            }else{
                _this.artText.tool.setFloatToolbar('hide');
            }
            _this.artText.tool.setFloatAuxiliaryTool('hide');
            cursor.setSelection();
        }
    }

    /**右点击 */
    contextmenu(e: MouseEvent, _this: EventCenter) {
        e.preventDefault();
        _this.artText.tool.setFloatAuxiliaryTool('show');
    }


    mousedown(e: MouseEvent, _this: EventCenter) {
        let obj: Map<string, number> = new Map();
        obj['pageX'] = e.pageX;
        obj['pageY'] = e.pageY;
        obj['offsetX'] = e.offsetX;
        obj['offsetY'] = e.offsetY;
        _this.clickInfo = obj;;
    }

    paste(e: ClipboardEvent, _this: EventCenter) {
        if (!(e.clipboardData && e.clipboardData.items)) {
            return;
        }
        let clipboard = null;
        for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
            let item = e.clipboardData.items[i];
            if (item.kind === "string") {
                if (item.type == "text/plain") {
                    clipboard = ["text/plain", item];
                } else if (item.type == "text/html") {
                    clipboard = ["text/html", item];
                    break;
                }
            }
        }
        if (clipboard) {
            if (clipboard[0] == "text/html") {
                let fun: Function = _this.getAsString(_this);
                clipboard[1].getAsString(fun);
                return false;
            }
        }
    }
    getAsString(_this: EventCenter): Function {
        // 剪贴事件回调
        function closure(str: string) {
            let html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = str;
            let body = html.childNodes[1];

            let location = _this.artText.editor.cursor.location;
            console.log(location);
            let md = htmlToMd(body);
            console.log(md);
            md = md.replace(/(^\s*)|(\s*$)/g, "");
            let mdRows = md.split('\n');
            let sub = location[2];
            for (let i = 0; i < mdRows.length; i++) {
                if (i == 0) {
                    console.log(sub);
                    _this.editorHtmlDom.childNodes[sub].appendChild(document.createTextNode(mdRows[i]));
                    sub++;
                    //window.artText.event.rootDom.childNodes[location[2]].innerHTML = body.childNodes[i].innerHTML;
                } else {
                    console.log(sub);
                    _this.editorHtmlDom.insertBefore(document.createTextNode(mdRows[i]), _this.editorHtmlDom.childNodes[sub]);
                    sub++;
                }
            }
        }
        return closure;

    }

    drop(e: DragEvent, _this: EventCenter) {
        e.preventDefault();
        for (var i = 0, len = e.dataTransfer.files.length; i < len; i++) {
            var f0 = e.dataTransfer.files[i];
            //创建一个文件内容读取器——FileReader
            var fr = new FileReader();
            console.log(fr, f0);
            if (/.*\.md$/.test(f0.name) || f0.type == 'text/plain') {
                fr.onload = function () {
                    if (fr.result) {
                        _this.artText.editor.openFile(fr.result.toString(), f0.name);
                    }
                };
                fr.readAsText(f0);
            } else if (/^image\/(png|jpe?g)$/.test(f0.type)) {
                fr.onload = function () {
                    let url = null;
                    if (_this.uploadImg) {
                        url = _this.uploadImg(fr.result);
                    } else {
                        url = fr.result;
                    }

                    var img = new Image();
                    img.src = url; //dataURL
                    console.log(img);
                    let span = document.createElement('span');
                    span.setAttribute('class', 'art-hide');
                    let text = document.createTextNode('![' + f0.name + '](' + url + ')');
                    span.appendChild(text);
                    const target = e.target as HTMLElement;
                    target.appendChild(span);
                    target.appendChild(img);
                }
                //读取文件中的内容 —— DataURL：一种特殊的URL地址，本身包含着所有的数据
                fr.readAsDataURL(f0);
            } else {
                Tool.message('不支持该文件类型', 'error');
            }
        }
    }
}
export default EventCenter