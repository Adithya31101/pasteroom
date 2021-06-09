//GLOBAL TODO: 
//--- Make a file with all possible room codes;
import generateCode from './generateCode';
import { Socket, Server } from 'socket.io';
import express from 'express';
import { resolve } from 'path';
import { createServer } from 'http';

//initialisation
const app = express();


const httpServer = createServer(app);
const PORT = process.env.PORT || 3120;
const io: Server = new Server(httpServer);
let roomCode: string;

type initData = {
   admin: boolean;
   code: string;
}

io.on('connection', (socket: Socket) => {
   socket.on('init', (data: initData, callback) => {
      if(data.admin){
         roomCode = generateCode.getUnusedCode(socket.id);
         if(roomCode){
            socket.join(roomCode);
            callback({code: roomCode});
         } else {
            callback({error: "All rooms are already occupied! Try again later"})
         }
      } else {
         if(data.code){
            if(generateCode.validateCode(data.code)){
               socket.join(data.code);
               callback({message: "Connected Successfully!"});
            } else {
               callback({error: "Invalid code... Contact the admin and try again!"})
            }
         } else {
            callback({error: "Code not provided!"})
         }
      }
   });

   socket.on('clip-change', (data, callback) => {
      socket.broadcast.to(generateCode.getCodeToEmit(socket.id)).emit('admin-clip-change', data);
      callback({success: true}); 
   });

   socket.on('disconnect', () => {
      const wasAdmin = generateCode.freeCode(socket.id);
      if (wasAdmin) socket.broadcast.to(roomCode).emit('admin-disconnect');
   });
});

//Middlewares
app.use('/static' , express.static(resolve('./public/static')));
app.use(express.json());


app.get('/', (req, res) => {
   res.sendFile(resolve('./public/index.html'));
})

//Routes
app.get('/room/:code', (req, res) => {
   res.sendFile(resolve('./public/index.html'));
});

app.get('/how-it-works', (req, res) => {
   res.sendFile(resolve('./public/how-it-works.html'));
});

httpServer.listen(PORT, () => {
   console.log(`Listening on PORT ${PORT}`)
})
