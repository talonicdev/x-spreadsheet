
import Clipboard from '../core/clipboard';
import DataProxy from '../core/data_proxy';
import {
    bind,
    mouseMoveUp,
    bindTouch,
    createEventEmitter,
  } from './event';
import { CellRange } from '../core/cell_range';
//import { Utils } from '../core/utils';
import * as Utils from '../core/utils';

function test(str) {
    console.log("API called!");
    console.log(str);
    console.log("this is:");
    console.log(this);
}

export default class API {

    constructor(mainReference) {
        this.eventMap = createEventEmitter();
        this.ref = mainReference;
        this.clipboard = new Clipboard();
        this.dataProxy = new DataProxy();
        this.ActiveSheet = mainReference.sheet;
    }

    selectCell(sShorthand) {
        let oCell = Utils.getCoords(sShorthand);
        if (!oCell) return null;
        this.ref.sheet.selector.reset();
        this.ref.sheet.selector.set(oCell.ri,oCell.ci);
    }

    selectCellRange(sShorthandStart,sShorthandEnd) {
        if (sShorthandStart && !sShorthandEnd) {
            let aTmp = sShorthandStart.split(":");
            if (aTmp.length > 1) {
                sShorthandStart  = aTmp[0];
                sShorthandEnd = aTmp[1];
            }
        }
        let oCoordsStart = Utils.getCoords(sShorthandStart);
        let oCoordsEnd = Utils.getCoords(sShorthandEnd);

        if (!oCoordsStart && !oCoordsEnd) return null;
        if (oCoordsStart && !oCoordsEnd) return this.selectCell(oCoordsStart);
        console.log("Setting Cell Range: "+oCoordsStart.ri+"/"+oCoordsStart.ci+" - "+oCoordsEnd.ri+"/"+oCoordsEnd.ci,sShorthandStart,sShorthandEnd);
        this.ref.sheet.selector.reset();
        this.ref.sheet.selector.set(oCoordsStart.ri,oCoordsStart.ci);
        this.ref.sheet.selector.setEnd(oCoordsEnd.ri,oCoordsEnd.ci,false);

    }

    getSelectedRange(bToArray) {
        let oCoordRange = this.ref.sheet.selector.range.clone();
        let sShorthandStart = Utils.getShorthand({ ci: oCoordRange.sci, ri: oCoordRange.sri });
        let sShorthandEnd = Utils.getShorthand({ ci: oCoordRange.eci, ri: oCoordRange.eri });
        if (bToArray) {
            return [sShorthandStart,sShorthandEnd];
        }
        if (this.ref.sheet.selector.range.multiple()) {
            return sShorthandStart+":"+sShorthandEnd;
        }
        return sShorthandStart;
    }

    getSelectedRangeData() {
        return this.clipboard.copy(this.ref.sheet.selector.range.clone());
    }

}