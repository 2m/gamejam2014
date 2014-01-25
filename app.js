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

setInterval(function () {
  sim.simulateTick()
}, 15)

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
  for (var humanId in clients) {
    clients[humanId].emit('world_data', new commands.FullWorld(world));
  }

  socket.on('command', function (command) {
    try {
      console.log("received command:")
      console.log(command)
      sim.applyCommand(inflater.inflate(command))
    } catch (e) {
      console.log(e)
    }
  })

  socket.on('disconnect', function() {
    try {
      console.log("disconnected: " + socket)
      world.removeHuman(humanId)
    } catch (e){
      console.log(e)
    }
  })

})
