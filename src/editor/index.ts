import { Art } from '@/core';
import { SwitchRenderButton } from '@/plugins/toolbar/default';
import Render from '@/renders';
import Tool from '@/tool';
import ArtText from '../artText'
import ArtRender from '../renders/artRender';
import TextareaRender from '../renders/textareaRender';
import './index.css'

/**
 * 编辑器
 */
export default class Editor {
    static plugins = [ArtRender, TextareaRender]
    static DEFAULT_CSS = '';

    artText: ArtText;
    dom: HTMLDivElement;
    fileInfo: {};
    defaultRender: any;
    runRender: Render;
    renders: {};
    constructor(artText: ArtText) {
        this.artText = artText;

        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-editor markdown-body');
        this.artText.dom.appendChild(this.dom);

        this.fileInfo = {};
        this.renders = {};

        for (let R of Editor.plugins) {
            this.addRender(R);
        }

        Tool.addCss(Editor.DEFAULT_CSS);
        Editor.DEFAULT_CSS = '';

        let artRender = this.renders['ArtRender'];
        this.defaultRender = artRender;
        this.runRender = artRender;

        this.artText.exportAPI('openFile', this.getFile);
    }

    public init(): void {
        for (let key in this.renders) {
            this.dom.appendChild(this.renders[key].createDom());
        }
        this.runRender.open();
        this.runRender.setMd(this.artText.options.defaultMd);
    }

    /**
     * 添加渲染器
     */
    public addRender(R: any) {
        if (R.DEFAULT_CSS != undefined)
            Editor.DEFAULT_CSS += R.DEFAULT_CSS;
        
        let name = R.name;
        if (R.Name != undefined)
            name = R.Name;
        this.renders[name] = new R(this.artText);
        
        this.artText.get<SwitchRenderButton>('switchRenderButton').abbrNames.push(this.renders[name].abbrName);
        this.artText.get<SwitchRenderButton>('switchRenderButton').renderNames.push(name);
    }

    /**
     * 打开文件
     * @param md markdown文本
     * @param fileInfo 
     * @param renderName 
     */
    public openFile(fileInfo: {} = {}, renderName: string = null): void {
        this.fileInfo = Object.assign({ name: null, id: null, defaultMd: '' }, fileInfo);;
        this.switchRender(renderName);
    }

    /**
     * 获取文件
     * @param key 
     */
    public getFile(key: string = null): any {
        if (key == 'fileInfo')
            return this.fileInfo;
        else if (key == 'md')
            return this.runRender.getMd();
        else {
            this.fileInfo['markdown'] = this.runRender.getMd();
            return this.fileInfo;
        }
    }

    /**
     * 切换渲染器
     * @param renderName 渲染器的名字
     */
    public switchRender(renderName: string): void {
        let render: Render = null;
        let md: string;
        if (renderName == null) {
            render = this.defaultRender
            md = this.fileInfo['defaultMd'];
        } else if (this.runRender == this.renders[renderName])
            return null;
        else {
            render = this.renders[renderName];
            md = this.runRender.getMd()
        }

        this.runRender.close();
        render.open();
        render.setMd(md);

        this.runRender = render;
    }
}

export let EditorExport = {
    install: function (Art, options) {
        options['container'].bind('$editor', Editor, [{'get': 'art'}], true);
    },
    created: function (art , options) {
        art.get('$editor');
    },
    mount: function(art: Art, options) {
        art.get<Editor>('$editor').init();
    }
}