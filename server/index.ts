//GLOBAL TODO: 
//--- Make a file with all possible room codes;
import generateCode from './generateCode';
import { Socket, Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

//initialisation
const app = express();
const httpServer = createServer(app);
const PORT = 3120 || process.env.PORT;
const io: Server = new Server(httpServer);
let roomCode: string;

io.on('connection', (socket: Socket) => {
   socket.on('init', (data, callback) => {
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
      socket.broadcast.to(roomCode).emit('admin-clip-change', data);
      callback({success: true}); 
   });

   socket.on('disconnect', () => {
      const wasAdmin = generateCode.freeCode(socket.id);
      if (wasAdmin) socket.broadcast.to(roomCode).emit('admin-disconnect');
   });
});

//Middlewares
app.use(express.json());

//Routes
app.post('/', (req, res) => {
   console.log(req.body);
   if(req.body.admin){
      //ADMIN INIT
      if(req.body.code){
         //MAKE A ROOM WITH THAT CODE
      } else {
         //ASSIGN A CODE TO A ROOM AND SEND THE SAME TO THE ADMIN CLIENT
      }
   } else {
      //CLIENT INIT
      if(!req.body.code){
         //THERE IS NO CODE ERROR -> client
      } 
      //CONNECT THE CLIENT TO THE SAME {CODE} ROOM
   }
   res.status(200).json({message: "Connected to server!"});
})

httpServer.listen(PORT, () => {
   console.log(`Listening on PORT ${PORT}`)
})