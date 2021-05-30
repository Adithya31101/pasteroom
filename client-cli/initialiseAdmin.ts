import clipboardListener from 'clipboard-event';
import { Socket } from 'socket.io-client';
import cp from 'copy-paste';

const initialiseAdmin = (socket: Socket) => {
   try {
      clipboardListener.startListening();
      clipboardListener.on('change', () => {
         socket.emit('clip-change', {
            clipData: cp.paste()
         }, ({success}) => {
            success?
               console.log("Clipboard data sent successfully!!")
            :
               console.log("Error in sending clipboard data :(")
         });
      });
   } 
   catch(err){
      console.log("Ah! snap, there was some error in copying your selection!");
   }
}
export default initialiseAdmin;