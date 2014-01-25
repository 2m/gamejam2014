console.log("Starting WEB and GAME server.")

var connect = require("connect");
var app = connect().use(connect.static(__dirname + "/frontend"));
var server = app.listen(process.env.PORT || 8080);

var io = require('socket.io')(server);

// map of soccet to player id
var clients = {}

var simulation = require('./frontend/common/simulation')
var worldModule = require('./frontend/common/world')
var components = require('./frontend/common/components')
var commands = require('./frontend/common/commands')
var inflater = new (require('./frontend/common/inflater').Inflater)()

var world = new worldModule.World()
var sim = new simulation.Simulation(world)

var lastTickTimestamp = Date.now()
setInterval(function () {
  var frameTime = Date.now() - lastTickTimestamp

  while (frameTime > 0) {
    sim.simulateTick()
    frameTime -= 15
  }
  lastTickTimestamp = Date.now()
}, 15)

setInterval(function () {
  //sendWorldSync()
}, 500)

function sendWorldSync() {
  for (var humanId in clients) {
    clients[humanId].emit('world_data', new commands.FullWorld(world));
  }
}

io.on('connection', function (socket) {
  console.log("received new connection: " + socket);

  // todo(aistis): add human to world
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
      sim.applyCommand(inflater.inflate(command))

      // resend the command for all other clients to reapply
      for (var humanId in clients) {
        if (humanId != command.objectId) {
          var position = world.getObject(humanId).coords
          command.coords = position
          console.log("sending command to user" + humanId)
          clients[humanId].emit('command', command);
        }
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
