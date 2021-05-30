import clipboardListener from 'clipboard-event';
import { Socket } from 'socket.io-client';
import cp from 'copy-paste';

const initialiseAdmin = (socket: Socket) => {
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
export default initialiseAdmin;