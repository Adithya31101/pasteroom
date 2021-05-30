import chalk from 'chalk';
import program from 'commander';
import { Socket, io } from 'socket.io-client';
import initialiseAdmin from './initialiseAdmin';
import cp from 'copy-paste';

const socket: Socket = io('http://localhost:3120/');

let RoomCode: string;
//Config for CLI
program
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
   if(err.message === "xhr poll error"){
      console.error(chalk.redBright("Aah, Snap! Server seems to be down!"));
   } else {
      console.error(chalk.redBright(err));
   }
   process.exit(1);
});

socket.on('admin-clip-change', ({clipData}) => {
   if(program.admin) return;
   if(program.print) {
      console.log(chalk.bgCyanBright(clipData));
   } else {
      cp.copy(clipData, () => {
         console.log("Copied to Clipboard!");
      });
   }
})

socket.on('admin-disconnect', () => {
   console.log("The admin of this room has disconnected! You will be disconnected.")
   process.exit(0);
})

socket.on('disconnect', () => {
   console.log("Disconnected");
   process.exit(0);
});

const init  = async (admin: boolean, code: string = null ) => {
   socket.emit('init', {
      admin,
      code,
   }, (response: any) => {
      if(response.code){
         console.log(`Created a new room as admin, \n CODE: ${chalk.yellowBright(response.code)}`);
         initialiseAdmin(socket);
      } else if(response.message){
         console.log(chalk.green("Successfully joined the room with code " + code));
      } else {
         console.log(chalk.redBright(response.error));
         process.exit(0);
      }
   })
}

if(program.admin){
   init(true);
} else if(program.code?.length > 0){
   init(false, program.code);
} else {
   console.log("Oops! seems like you did not enter any code or join as an admin type --help for help!");
   process.exit(0);
}