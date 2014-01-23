var io = require('socket.io')();

var clients = {}

io.on('connection', function (socket) {
  console.log("someones connecting");

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
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
  
});

io.listen(8888);
