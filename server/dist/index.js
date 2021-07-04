"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//GLOBAL TODO: 
//--- Make a file with all possible room codes;
const generateCode_1 = __importDefault(require("./generateCode"));
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const http_1 = require("http");
//initialisation
const app = express_1.default();
const httpServer = http_1.createServer(app);
const PORT = process.env.PORT || 8081;
const io = new socket_io_1.Server(httpServer);
let roomCode;
io.on('connection', (socket) => {
    socket.on('init', (data, callback) => {
        if (data.admin) {
            roomCode = generateCode_1.default.getUnusedCode(socket.id);
            if (roomCode) {
                socket.join(roomCode);
                callback({ code: roomCode });
            }
            else {
                callback({ error: "All rooms are already occupied! Try again later" });
            }
        }
        else {
            if (data.code) {
                if (generateCode_1.default.validateCode(data.code)) {
                    socket.join(data.code);
                    callback({ message: "Connected Successfully!" });
                }
                else {
                    callback({ error: "Invalid code... Contact the admin and try again!" });
                }
            }
            else {
                callback({ error: "Code not provided!" });
            }
        }
    });
    socket.on('clip-change', (data, callback) => {
        socket.broadcast.to(generateCode_1.default.getCodeToEmit(socket.id)).emit('admin-clip-change', data);
        callback({ success: true });
    });
    socket.on('disconnect', () => {
        const adminRoomCode = generateCode_1.default.freeCode(socket.id);
        if (adminRoomCode)
            socket.broadcast.to(adminRoomCode).emit('admin-disconnect');
    });
});
//Middlewares
app.use('/static', express_1.default.static(path_1.resolve('dist/public/static')));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.sendFile(path_1.resolve('dist/public/index.html'));
});
//Routes
app.get('/room/:code', (req, res) => {
    res.sendFile(path_1.resolve('dist/public/index.html'));
});
app.get('/how-it-works', (req, res) => {
    res.sendFile(path_1.resolve('dist/public/how-it-works.html'));
});
httpServer.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map