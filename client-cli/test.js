const clipboardListener = require("clipboard-event");

// To start listening
clipboardListener.startListening();

clipboardListener.on("change", () => {
   console.log("Clipboard changed");
});

// // To stop listening
// clipboardListener.stopListening();
