"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = __importDefault(require("commander"));
const socket_io_client_1 = require("socket.io-client");
const initialiseAdmin_1 = __importDefault(require("./initialiseAdmin"));
const copy_paste_1 = __importDefault(require("copy-paste"));
const socket = socket_io_client_1.io('http://pasteroom-env.eba-3n4xnfa3.us-east-1.elasticbeanstalk.com');
let RoomCode;
//Config for CLI
commander_1.default
    .version('0.0.1')
    .option('-a, --admin', "Start node-paster as admin!")
    .option('-c, --code [code]', "Start node-paster as a client with a code!")
    .option('-p, --print', "Log all the clipboard content on the console.")
    .option('-r, --reserve', "Log previous clipboard content before overwrite")
    .parse(process.argv);
//Web Socket initialisation
socket.on('connect', () => {
    console.log("Connected to the server...");
});
socket.on('connect_error', (err) => {
    if (err.message === "xhr poll error") {
        console.error(chalk_1.default.redBright("Aah, Snap! Server seems to be down!"));
    }
    else {
        console.error(chalk_1.default.redBright(err));
    }
    process.exit(1);
});
socket.on('admin-clip-change', ({ clipData }) => {
    if (commander_1.default.admin)
        return;
    if (commander_1.default.print) {
        console.log(chalk_1.default.cyanBright(clipData));
        console.log("Listening for admin's clipboard changes...");
    }
    else {
        copy_paste_1.default.copy(clipData, () => {
            console.log("Copied to Clipboard!");
            console.log("Listening for admin's clipboard changes...");
        });
    }
});
socket.on('admin-disconnect', () => {
    console.log("The admin of this room has disconnected! You will be disconnected.");
    process.exit(0);
});
socket.on('disconnect', () => {
    console.log("Disconnected");
    process.exit(0);
});
const init = (admin, code = null) => __awaiter(void 0, void 0, void 0, function* () {
    socket.emit('init', {
        admin,
        code,
    }, (response) => {
        if (response.code) {
            console.log(`Created a new room as admin, \n CODE: ${chalk_1.default.yellowBright(response.code)}`);
            initialiseAdmin_1.default(socket);
        }
        else if (response.message) {
            console.log(chalk_1.default.green("Successfully joined the room with code " + code));
        }
        else {
            console.log(chalk_1.default.redBright(response.error));
            process.exit(0);
        }
    });
});
if (commander_1.default.admin) {
    init(true);
}
else if (((_a = commander_1.default.code) === null || _a === void 0 ? void 0 : _a.length) > 0) {
    init(false, commander_1.default.code);
}
else {
    console.log("Oops! seems like you did not enter any code or join as an admin type --help for help!");
    process.exit(0);
}
//# sourceMappingURL=index.js.map