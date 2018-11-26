/*
  Julio Barahona M
  141206
  Sistemas y tecnologias web
  Seccion 10
  Lab 5: Node & Sockets
*/

//imports the packages that where installed
const FormData = require('form-data')
const fetch = require('node-fetch')
const axios = require('axios')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const request = require('request');

//sets the port, id and username that are gonna be sent by me :D, PORT wont be sent since im mad at him  >:(
const port = process.env.PORT || 3000
const urlDennis = 'http://34.210.35.174:7000'
const studentID = "141206"
const studentUsename = "Julio Barahona M"

//where all the mesages wil be stored at
outgoingMessage = 0
chatMessages = []
connections = []
fetchDATA()


//offline testing 
// var person = [{ "nick":"John", "student_id":"123", "text": "pee pee" },
// { "nick":"Anna", "student_id":"456", "text": "poo poo" },
// { "nick":"Peter", "student_id":"789", "text": "pee poo"}]
// console.log(person

//gets the data from url
async function fetchDATA() {
  console.log('fetching....')
  const jsonFile = await axios.get(urlDennis)
  let chatMessages = jsonFile.data
  let psedoJSON = chatMessages.slice(outgoingMessage, chatMessages.length)
  //console.log(psedoJSON)
  io.emit('chat message', chatMessages)
  outgoingMessage = chatMessages.length

  console.log('fetched')
}

//sends the data to url
function postDATA(msg) {
  const formData = new FormData()
  console.log('assembling message')

  formData.append('nick', studentUsename)
  formData.append('student_id', studentID)
  formData.append('text', msg)
  
  console.log('sending message')
  fetch(urlDennis, { 
    method: 'post', 
    body: formData 
  })

  console.log('message text sent')
  fetchDATA()
}

//default directory is set as index
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//trying to senf with enter
/*mensajes.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      postDATA(e)
      fetchDATA()
      }
});
didnt work :(
*/

//checks for connections of new users and displays both connections and disconnections
io.on('connection', function(socket){
  console.log('Yeiiii! New User connected ... :D')
  console.log('%s sockets connected', connections.length)
  console.log("fetching data....")
  fetchDATA()
  console.log("data fetched....")

  //disconnected from server 
  socket.on('disconnect', function(){
    console.log('Hope you liked the app! Bye :D ')
  })

  //sending message
  socket.on('chat message', function(msg) {
    postDATA(msg)
  });
})

//sets the port in which the app will be listenint
http.listen(port, function(){
  console.log('Server is now running on port 3000 :D')
});

//calls the fucntion every 10 seconds
setInterval(function(){fetchDATA()}, 10000); 



