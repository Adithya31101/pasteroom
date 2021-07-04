//TOAST SPECIFIC GLOBAL VARIABLES AND EVENT LISTENERS

const toast = document.getElementById('toast');
const toastIcon = toast.children[0];
const toastMessage = toast.children[1];
const toastClose = document.getElementById('toast-close');
const joinRoom = document.getElementById('join-room');
const codeInput = document.getElementById("code-input");
let codeString = "";

/* SHOW TOAST 
      @param text: string 
         @desc: Text to be shown on the toast
      @param severity: 'success' | 'error'
         @desc: Severity determines the color and the icon
*/
const showToast = (text, severity) => {
  if (severity === "success") {
    toast.style.background = "#4CB050";
    toastIcon.innerHTML = "check_circle";
    toastMessage.innerText = text;
  } else {
    toast.style.background = "red";
    toastIcon.innerHTML = "error";
    toastMessage.innerText = text;
  }
  toast.style.opacity = 1;
  toast.style.top = "100px";
};

// ON TOAST CLOSE CLICK
toastClose.addEventListener('click', () => {
   toast.style.top = '-100px';
   toast.style.opacity = 0;
});

// ON CHARACTER INPUT
codeInput.addEventListener('input', (e) => {
   const value = e.target.value.toUpperCase();
   codeString = value;
   e.target.value = value;
})


// ON JOIN CLICK WITH CODE
joinRoom.addEventListener('click', (e) => {
   e.preventDefault();
   const codeRegex = /^[A-Z]{4}$/;
   if(codeString.length < 4){
      showToast("The code has to be of 4 characters!", 'error');
   } else if(!codeRegex.test(codeString)) {
      showToast("The code needs to have only characters!", 'error');
   } else {
      history.pushState(null, null, `/room/${codeString}`);
      main();
      codeInput.value = "";
   }   
});

/* INITIALISE 
      @param code: string
         @desc: The code to join a specific room
*/
const init = (code) => {
   return new Promise((resolve, reject) => {
      const socket = io();
      socket.emit('init', {
         admin: false,
         code: code
      }, (response) => {
         if(response && response.error){
            showToast(response.error, 'error');
            reject(socket);
         } else {
            showToast(response.message, 'success')
            leaveButton.style.display = "flex";

            // Adding an event listener to the now visible leave button
            leaveButton.addEventListener('click', () => {
               socket.disconnect();
               history.pushState(null, null, "/");
               main();
            })

            resolve(socket);
         }
      });
   });
}

//Utility Functions for event handlers
const copiedSuccessfully = (copyButton) => {
   copyButton.children[0].innerHTML = "done";
   setTimeout(() => {
      copyButton.children[0].innerHTML = "content_copy";
   }, 1000);
}

const copyToClipboard = (data, copyButton) => {
   try {
      if(navigator.clipboard && window.isSecureContext){
         navigator.clipboard.writeText(data)
         .then(() => {
            copiedSuccessfully(copyButton);
         })
         .catch(e => alert(e.message));
         return;
      } else {
         const substituteTextArea = document.createElement('textarea');
         substituteTextArea.value = data;
         substituteTextArea.style.position = 'absolute';
         substituteTextArea.style.opacity = 0;
         substituteTextArea.style.top = '-20rem';
         document.body.appendChild(substituteTextArea);
         substituteTextArea.select();
         if(document.execCommand('copy')){
            copiedSuccessfully(copyButton);
            substituteTextArea.remove();
         };
      }
   } 
   catch(e){
      alert(e.message)
   }
}


//MAIN PROGRAM STARTS RUNNING FROM HERE
const leaveButton = document.getElementById('leave-button');
let socket;
const clipboardArea = document.getElementById("clipboard-area");
const roomInput = document.getElementById("room-input");

const addNewClipData = (clipData) => {
   if(clipboardArea.childElementCount === 1){
      document.querySelector('.placeholder').style.display = "none"
   }
   //Create a div and add a class to it 
   const clipDataDiv = document.createElement('div');
   clipDataDiv.className = 'clip-item';
   
   //Create button for copy with the click event handler and then append it to clipDataDiv
   const copyButton = document.createElement('button');
   copyButton.className = 'copy-button';
   copyButton.addEventListener('click', () => {
      copyToClipboard(clipData, copyButton);
   });
   copyButton.type = 'button';
   copyButton.innerHTML = '<span class="material-icons">content_copy</span>'
   clipDataDiv.appendChild(copyButton);

   //Create a close button that will remove the current node
   const closeButton = document.createElement('button');
   closeButton.className = 'close-button';
   closeButton.addEventListener('click', (e) => {
      e.target.parentElement.parentElement.remove();
   });
   closeButton.type = 'button';
   closeButton.innerHTML = '<span class="material-icons">close</span>'
   clipDataDiv.appendChild(closeButton);

   //Create a paragraph to store all the clipdata and display it
   const clipText = document.createElement('p');
   clipText.className = 'clip-text';
   clipText.innerText = clipData;
   clipDataDiv.appendChild(clipText);

   //Create a span with timestamp of the clip
   const now = new Date();
   const timeStamp = document.createElement('span');
   timeStamp.className = "clip-timestamp";
   timeStamp.innerText = now.toLocaleTimeString();
   clipDataDiv.appendChild(timeStamp);

   //Prepend it to the DOM
   clipboardArea.prepend(clipDataDiv);
} 


const main = () => {
   const roomURLRegex = /^\/room\/[A-Za-z]{4}/;
   const URLPath = window.location.pathname;

   if(roomURLRegex.test(URLPath)){
      init(URLPath.split('/')[2])
         .then((socketInstance) => {
            socket = socketInstance;
            roomInput.style.display = "none";
            clipboardArea.style.display = 'flex';
            socket.on("admin-clip-change", ({clipData}) => {
               addNewClipData(clipData);
            });
            socket.on('admin-disconnect', () => {
               showToast("The admin of this room has disconnected! You will be disconnected.", 'error')
            });
         })
         .catch(() => {
            roomInput.style.display = "flex";
         });
   } else {
      roomInput.style.display = 'flex';
      clipboardArea.style.display = "none";
      leaveButton.style.display = "none"
   }
}

main();