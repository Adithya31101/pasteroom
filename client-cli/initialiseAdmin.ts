import clipboardListener from 'clipboard-event';
import { Socket } from 'socket.io-client';
import cp from 'copy-paste';
import fs from 'fs';
import os from 'os';
import path from 'path';
const checkExecPermission = () :void => {
   const pathToExecutable = path.resolve(__dirname, '../../clipboard-event/platform/clipboard-event-handler-linux');
   fs.access(pathToExecutable, 1, (err) => {
      if(err){
         fs.chmodSync(pathToExecutable, 0o766);
      }
   });
} 

const initialiseAdmin = (socket: Socket) => {
   if (os.platform() === 'linux'){
      checkExecPermission();
   }
   try {
      clipboardListener.startListening();
      clipboardListener.on('change', () => {
         try{
            socket.emit('clip-change', {
               clipData: cp.paste()
            }, ({ success }) => {
               success ?
                  console.log("Clipboard data sent successfully!!")
                  :
                  console.log("Error in sending clipboard data :(")
            });

         } catch (e) {
            console.log("Error in accessing clipboard.")
         }
         
      });
   } 
   catch(err){
      console.log("Ah! snap, there was some error in copying your selection!");
   }
}
export default initialiseAdmin;