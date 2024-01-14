const message = 'NEGIE1';
let newMessage = '';
for (i = 0; i < message.length; i++) {
  if (isNaN(message[i])) {
    newMessage = message[i] + newMessage;
  } else {
    newMessage = newMessage + message[i];
  }
}
console.log(newMessage);