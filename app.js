console.log("Starting WEB and GAME server.")

var connect = require("connect");
var app = connect().use(connect.static(__dirname + "/frontend"));
var server = app.listen(process.env.PORT || 8080);

var io = require('socket.io')(server);

// map of player_id to socket
var clients = {}

var components = require('./frontend/common/components')
var commands = require('./frontend/common/commands')
var inflater = new (require('./frontend/common/inflater').Inflater)()

var world = new (require('./frontend/common/world').World)()
var simulation = new (require('./frontend/common/simulation').Simulation)(world)
var ticker = new (require('./frontend/common/ticker').Ticker)(simulation)

setInterval(function () {
  sendWorldSync()
}, 5000)

function sendWorldSync() {
  for (var humanId in clients) {
    clients[humanId].emit('world_data', new commands.FullWorld(world));
  }
}

io.on('connection', function (socket) {
  console.log("received new connection: " + socket);

  var human = new components.Human()
  var humanId = world.addHuman(human)

  clients[humanId] = socket

  // let the new client know of its own id
  socket.emit('human_id', humanId);

  // new player connected and was added to the world
  // lets send the new world to all players
  sendWorldSync()

  socket.on('command', function (command) {
    try {
      console.log("received command:" + command.commandName)
      var position = world.getObject(command.objectId).coords
      command.coords = position
      simulation.applyCommand(inflater.inflate(command))

      // resend the command for all clients to reapply
      for (var humanId in clients) {
        console.log("sending command to user" + humanId)
        clients[humanId].emit('command', command);
      }

    } catch (e) {
      console.log(e.stack)
    }
  })

  socket.on('disconnect', function() {
    try {
      console.log("disconnected: " + socket)
      world.removeHuman(humanId)
      delete clients[humanId]
    } catch (e){
      console.log(e)
    }
  })

})
