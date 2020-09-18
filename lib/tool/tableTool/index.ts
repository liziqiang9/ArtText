export default function initTableTool(root: HTMLElement): void {
    root.innerHTML = '';
    root.setAttribute('style', 'width:100%;visibility:hidden;font-size:14px;position:relative;margin-bottom: 2px;')

    let rowInput = document.createElement('input');
    rowInput.setAttribute('style', 'width:35px;margin:0 7px;;font-size:14px;font-weight: 600;color: #1abc9c;border: none;outline: none;')
    rowInput.title = '调整行';

    let columnInput = document.createElement('input');
    columnInput.setAttribute('style', 'width:35px;font-size:14px;font-weight: 600;color: #1abc9c;border: none;outline: none;')
    columnInput.title = '调整列';

    let sizeBox = document.createElement('span');
    sizeBox.style.display = 'none';
    sizeBox.appendChild(rowInput);
    sizeBox.appendChild(columnInput);

    let sizeSpan = document.createElement('span');
    sizeSpan.setAttribute('style', 'width:30px;cursor:pointer;')
    sizeSpan.innerHTML = '<svg class="icon" style="width: 18px; height: 18px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1283"><path d="M64.021106 512c0-17.672498 14.07353-31.998785 31.887244-31.998785h832.182277c17.6111 0 31.887244 14.202467 31.887244 31.998785 0 17.672498-14.07353 31.998785-31.887244 31.998785H95.909373c-17.6111 0-31.888268-14.20349-31.888267-31.998785zM959.977871 352.007099c0 17.672498-14.326287 31.998785-31.998785 31.998785s-31.998785-14.326287-31.998785-31.998785V160.016437c0-17.672498-14.326287-31.998785-31.998784-31.998785H160.016437c-17.672498 0-31.998785 14.326287-31.998785 31.998785v191.990662c0 17.672498-14.326287 31.998785-31.998785 31.998785s-31.998785-14.326287-31.998785-31.998785V160.016437c0-53.016471 42.97886-95.995331 95.995332-95.995331H863.981517c53.016471 0 95.995331 42.97886 95.995331 95.995331v191.990662z m0 319.984779v191.990662c0 53.016471-42.97886 95.995331-95.995331 95.995331H160.016437c-53.016471 0-95.995331-42.97886-95.995331-95.995331V671.991878c0-17.672498 14.326287-31.998785 31.998785-31.998785s31.998785 14.326287 31.998784 31.998785v191.990662c0 17.672498 14.326287 31.998785 31.998785 31.998785h703.966103c17.672498 0 31.998785-14.326287 31.998785-31.998785V671.991878c0-17.672498 14.326287-31.998785 31.998785-31.998785s31.996738 14.32731 31.996738 31.998785z" p-id="1284"></path></svg>';
    sizeSpan.title = '调整大小';
    sizeSpan.onclick = sizeBoxAdjust
    sizeSpan.appendChild(sizeBox);

    let delSpan = document.createElement("span");
    delSpan.setAttribute('style', 'position:absolute;right:0;cursor:pointer;')
    delSpan.innerHTML = '<svg class="icon" style="width: 18px; height: 18px;color: red;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="689"><path d="M800.162002 316.659033c1.850138-17.575284 17.596773-30.322609 35.172058-28.473495 17.575284 1.850138 30.322609 17.596773 28.473494 35.172058l-57.966202 550.673811c-5.143137 48.856731-46.341445 85.946464-95.467306 85.946464H313.625954c-49.126884 0-90.325192-37.089733-95.468329-85.946464L160.192446 323.358619c-1.850138-17.575284 10.898211-33.32192 28.472471-35.172057 17.575284-1.850138 33.32192 10.898211 35.172058 28.473494l57.965179 550.672788c1.714038 16.285918 15.446807 28.64848 31.822776 28.648481h396.74707c16.375969 0 30.108738-12.363585 31.822776-28.648481l57.967226-550.673811z m-192.176904 99.345636c17.672498 0 31.998785 14.326287 31.998785 31.998785v223.989447c0 17.672498-14.326287 31.998785-31.998785 31.998785s-31.998785-14.326287-31.998785-31.998785V448.00243c0-17.671475 14.326287-31.997762 31.998785-31.997761z m-191.990662 0c17.672498 0 31.998785 14.326287 31.998785 31.998785v223.989447c0 17.672498-14.326287 31.998785-31.998785 31.998785s-31.998785-14.326287-31.998785-31.998785V448.00243c0-17.671475 14.326287-31.997762 31.998785-31.997761z m-31.998785-223.989447h255.987209v-47.998178c0-8.836249-7.163143-15.999392-15.999393-15.999392H399.995043c-8.836249 0-15.999392 7.163143-15.999392 15.999392v47.998178z m-63.996546 0V128.018675c0-35.344996 28.652574-63.996546 63.997569-63.996546h255.987209c35.343973 0 63.996546 28.652574 63.996546 63.996546v63.996547h223.99968c17.672498 0 31.998785 14.326287 31.998785 31.998785s-14.326287 31.998785-31.998785 31.998784H96.019891c-17.672498 0-31.998785-14.326287-31.998785-31.998784s14.326287-31.998785 31.998785-31.998785h223.979214z" p-id="690"></path></svg>';
    delSpan.title = '删除表格';
    delSpan.onclick = delTable

    root.appendChild(sizeSpan);
    root.appendChild(delSpan);
}

function getTableSize(table: HTMLTableElement): [number, number] {
    if (!table)
        return [0, 0];
    let rows = table.rows.length;
    let cells = table.rows.item(0).cells.length;
    return [rows, cells];
}

function setTableSize(table: HTMLTableElement, newValues: [number, number]): void {
    if (newValues[0] == -1 || newValues[1] == -1) {
        return null;
    }
    let values = getTableSize(table);
    // 调整行
    if (newValues[0] != values[0]) {
        // 删除还是新增
        if (newValues[0] < values[0]) {
            for (let i = values[0] - 1; i > newValues[0] - 1; i--) {
                table.rows[i].parentNode.removeChild(table.rows[i]);
            }
        } else {
            for (let i = newValues[0] - values[0]; i > 0; i--) {
                let tr = document.createElement('tr');
                for (let j = 0; j < values[1]; j++) {
                    let td = document.createElement('td');
                    tr.appendChild(td);
                }
                table.childNodes[1].appendChild(tr);
            }
        }
    }
    // 调整列
    if (newValues[1] != values[1]) {
        // 删除还是新增
        if (newValues[1] < values[1]) {
            for (let i = values[1] - 1; i > newValues[1] - 1; i--) {
                for (let j = 0; j < table.rows.length; j++) {
                    table.rows[j].cells[i].parentNode.removeChild(table.rows[j].cells[i]);
                }
            }
        } else {
            for (let i = newValues[1] - values[1]; i > 0; i--) {
                for (let j = 0; j < table.rows.length; j++) {
                    if (j == 0) {
                        table.rows[j].appendChild(document.createElement('th'));
                    } else {
                        table.rows[j].appendChild(document.createElement('td'));
                    }
                }
            }
        }
    }
}

function sizeBoxAdjust(e: MouseEvent): void {
    let div = (<HTMLSpanElement>e.target).parentNode.parentNode;
    if (div.nextSibling && div.nextSibling.nodeName == 'TABLE') {
        let sizeBox = (<HTMLElement>e.target).nextSibling as HTMLSpanElement;
        if (sizeBox.style.display == 'none') {
            sizeBox.style.display = '';
            let values = getTableSize(div.nextSibling as HTMLTableElement);
            (<HTMLInputElement>sizeBox.childNodes[0]).value = values[0].toString();
            (<HTMLInputElement>sizeBox.childNodes[1]).value = values[1].toString();
        } else {
            setTableSize(div.nextSibling as HTMLTableElement, 
                [parseInt((<HTMLInputElement>sizeBox.childNodes[0]).value), parseInt((<HTMLInputElement>sizeBox.childNodes[1]).value)]);
            sizeBox.style.display = 'none';
        }
    }

}

function delTable(e: MouseEvent): void {
    let div = (<HTMLSpanElement>e.target).parentNode.parentNode;
    if (div.nextSibling && div.nextSibling.nodeName == 'TABLE') {
        div.parentNode.removeChild(div.nextSibling);
        div.parentNode.removeChild(div);
    }
}