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
createFlowers()
createCows()
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createFlowers() {
  var flowerMinPos = components.Vector.Zero
  var flowerMaxPos = new components.Vector(2000, 1000)
  var maxFlowers = 20
  for (var i = 0; i < maxFlowers; i++) {
    var x = getRandomInt(flowerMinPos.x, flowerMaxPos.x)
    var y = getRandomInt(flowerMinPos.y, flowerMaxPos.y)
    var flower = new components.Flower()
    flower.coords = new components.Vector(x, y)
    world.addFlower(flower)
  }
}

function createCows() {
  var minPos = components.Vector.Zero
  var maxPos = new components.Vector(2000, 1000)
  var maxCount = 20
  for (var i = 0; i < maxCount; i++) {
    var x = getRandomInt(minPos.x, maxPos.x)
    var y = getRandomInt(minPos.y, maxPos.y)
    var object = new components.Cow()
    object.coords = new components.Vector(x, y)
    world.addCow(object)
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
