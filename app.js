console.log("Starting WEB server.")

var connect = require("connect");
var app = connect().use(connect.static(__dirname + "/frontend"));
app.listen(process.env.PORT || 8080);

var io = require('socket.io')();

var clients = {}

console.log("Starting GAME server.")
io.on('connection', function (socket) {
  console.log("someones connecting");

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log("got new car" + data);
    clients[data.id] = socket
  })

  socket.on('car_coords', function (data) {
    console.log(data);
    for (var key in clients) {
      if (key != data.id) {
        console.log("sending data to " + key)
        clients[key].emit("other_car", data)
      }
    }
  })

  socket.on('disconnect', function() {
    console.log("disconnected")
  });
  
});

io.listen(8888);
