const express = require('express');
const app = express();
const port = process.env.PORT || 3001
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_chat'
});

db.connect(function(err){
  if (err) console.log(err)
})

// Define/initialize our global vars
let messages = []
let isInitNotes = false

const server = app.listen(port, function() {
  console.log(`Connection running in port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log('User Connected: ' + socket.id)
  messages = [];
  db.query('SELECT username,message FROM tbl_messages').on('result', function(data){
    messages.push(data)
    io.emit('MESSAGE', messages)
  })
  // get data from mysql
  socket.on('SEND_MESSAGE', function(data) {
    messages.push(data);
    db.query("INSERT INTO tbl_messages VALUES (NULL, '"+data.username+"', '"+data.message+"')");
    io.emit('MESSAGE', messages)
    console.log(`received data from ${socket.id}: ${data.message}`)
  })
  socket.on('disconnect', function() {
    console.log('User Disconnected: '+ socket.id)
  })
})