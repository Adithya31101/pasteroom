//TOAST SPECIFIC GLOBAL VARIABLES AND EVENT LISTENERS

const toast = document.getElementById('toast');
const toastIcon = toast.children[0];
const toastMessage = toast.children[1];
const toastClose = document.getElementById('toast-close');
const joinRoom = document.getElementById('join-room');
const codeInput = document.getElementById("code-input");
let codeString = "";

const showToast = (text, severity) => {
  if (severity === "success") {
    toast.style.background = "4CB050";
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

toastClose.addEventListener('click', () => {
   toast.style.top = 0;
   toast.style.opacity = 0;
});

codeInput.addEventListener('input', (e) => {
   const value = e.target.value.toUpperCase();
   codeString = value;
   console.log(value);
   e.target.value = value;
})

joinRoom.addEventListener('click', () => {
   window.location = `/room/${codeString}`;
})

/* SHOW TOAST 
      @param text: string 
         @desc: Text to be shown on the toast
      @param severity: 'success' | 'error'
         @desc: Severity determines the color and the icon
*/


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
            console.log(response);
            showToast(response.error, 'error');
            reject(socket);
         } else {
            showToast(response.message, 'success')
            leaveButton.style.display = "flex";
            resolve(socket);
         }
      });
   });
}

//MAIN PROGRAM STARTS RUNNING FROM HERE
const leaveButton = document.getElementById('leave-button');
const roomURLRegex = /^\/room\/[A-Za-z]{4}/;
const URLPath = window.location.pathname;
let socket;

if(roomURLRegex.test(URLPath)){
   init(URLPath.split('/')[2])
      .then((socketInstance) => {
        console.log(socketInstance);
        socket = socketInstance;
        document.getElementById("room-input").style.display = "none";
        document.getElementById("clipboard-area").style.display = 'block';
        socket.on("admin-clip-change", ({clipData}) => {
           addNewClipData(clipData);
        });
      })
      .catch(() => {
         document.getElementById("room-input").style.display = "flex";
      });
} else {
   document.getElementById("room-input").style.display = 'flex';
}