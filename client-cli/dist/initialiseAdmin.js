"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clipboard_event_1 = __importDefault(require("clipboard-event"));
const copy_paste_1 = __importDefault(require("copy-paste"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const checkExecPermission = () => {
    const pathToExecutable = path_1.default.resolve(__dirname, '../../clipboard-event/platform/clipboard-event-handler-linux');
    fs_1.default.access(pathToExecutable, 1, (err) => {
        if (err) {
            fs_1.default.chmodSync(pathToExecutable, 0o766);
        }
    });
};
const initialiseAdmin = (socket) => {
    if (os_1.default.platform() === 'linux') {
        checkExecPermission();
    }
    try {
        clipboard_event_1.default.startListening();
        clipboard_event_1.default.on('change', () => {
            try {
                socket.emit('clip-change', {
                    clipData: copy_paste_1.default.paste()
                }, ({ success }) => {
                    success ?
                        console.log("Clipboard data sent successfully!!")
                        :
                            console.log("Error in sending clipboard data :(");
                });
            }
            catch (e) {
                console.log("Error in accessing clipboard.");
            }
        });
    }
    catch (err) {
        console.log("Ah! snap, there was some error in copying your selection!");
    }
};
exports.default = initialiseAdmin;
//# sourceMappingURL=initialiseAdmin.js.map