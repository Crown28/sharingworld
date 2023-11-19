const express = require('express');
const mongoose = require('mongoose');

const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

const app = express();

const PORT = 3000;
const DB ="mongodb+srv://Beube:qmqp1234!@cluster0.l6h5uko.mongodb.net/?retryWrites=true&w=majority"

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const messages = []


io.on('connection', (socket) => {
  const username = socket.handshake.query.username
  socket.on('message', (data) => {
    const message = {
      message: data.message,
      senderUsername: username,
      sentAt: Date.now()
    }
    messages.push(message)
    io.emit('message', message)

  })
});

//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//create api
//get, put, post, delete, update CRUD

//connection
mongoose
.connect(DB)
.then(() => {
  console.log("Connection Successful");
})
.catch((e) => {
  console.log(e);
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});