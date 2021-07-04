"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class codeHelper {
    constructor() {
        this.codes = [
            { code: "COAL", inUse: false, adminId: null },
            { code: "FLAT", inUse: false, adminId: null },
            { code: "COOL", inUse: false, adminId: null },
            { code: "HALT", inUse: false, adminId: null },
            { code: "BELL", inUse: false, adminId: null },
            { code: "TURN", inUse: false, adminId: null },
            { code: "SCAM", inUse: false, adminId: null },
            { code: "BURN", inUse: false, adminId: null },
            { code: "SEND", inUse: false, adminId: null },
            { code: "LIKE", inUse: false, adminId: null },
        ];
    }
    getUnusedCode(adminId) {
        let i = 0;
        while (this.codes[i].inUse && i < this.codes.length) {
            i++;
        }
        if (i === this.codes.length)
            return null;
        this.codes[i].inUse = true;
        this.codes[i].adminId = adminId;
        return this.codes[i].code;
    }
    freeCode(adminId) {
        const i = this.codes.findIndex(code => code.adminId === adminId);
        if (i !== -1) {
            this.codes[i].inUse = false;
            this.codes[i].adminId = null;
            return this.codes[i].code;
        }
        else {
            return null;
        }
    }
    getCodeToEmit(adminId) {
        const codeObj = this.codes.find(c => c.adminId === adminId);
        if (codeObj) {
            return codeObj.code;
        }
        else {
            return null;
        }
    }
    validateCode(code) {
        const codeObj = this.codes.find(c => c.code === code);
        if (codeObj && codeObj.inUse) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = new codeHelper();
//# sourceMappingURL=generateCode.js.map