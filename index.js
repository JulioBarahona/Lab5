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
messages = []
connections = []
fetchDATA()

//gets the data from url
function fetchDATA() {
  console.log('fetching....')
  request.get(urlDennis, function(error, response, body){
    let ping = JSON.parse(body); 
    if(messages.length != ping.length){
      messages = ping;
      io.sockets.emit('chat message', messages); 
    }
})
  console.log('fetched')
}

//sends the data to url
function postDATA(msg) {
  console.log('sending message')
  const formData = new FormData()
  formData.append('nick', studentUsename)
  formData.append('student_id', studentID)
  formData.append('text', msg)
  fetch(urlDennis, { 
    method: 'post', 
    body: formData 
  })
  console.log('message text sent')
}

//default directory is set as index
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//checks for connections of new users and displays both connections and disconnections
io.sockets.on('connection', function(socket){
  connections.push(socket)
  console.log('Yeiiii! New User connected ... :D')
  console.log('%s sockets connected', connections.length)

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
  console.log('Server is now running :D')
  console.log('listening on *:' + port);
});

//calls the fucntion every 10 seconds
setInterval(function(){fetchDATA()}, 10000); 