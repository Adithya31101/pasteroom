"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clipboard_event_1 = __importDefault(require("clipboard-event"));
const copy_paste_1 = __importDefault(require("copy-paste"));
const initialiseAdmin = (socket) => {
    try {
        clipboard_event_1.default.startListening();
        clipboard_event_1.default.on('change', () => {
            socket.emit('clip-change', {
                clipData: copy_paste_1.default.paste()
            }, ({ success }) => {
                success ?
                    console.log("Clipboard data sent successfully!!")
                    :
                        console.log("Error in sending clipboard data :(");
            });
        });
    }
    catch (err) {
        console.log("Ah! snap, there was some error in copying your selection!");
    }
};
exports.default = initialiseAdmin;
//# sourceMappingURL=initialiseAdmin.js.map