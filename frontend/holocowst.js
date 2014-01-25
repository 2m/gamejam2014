(function() {
  var stage, car, lastDirection, speedX = 0, speedY = 0
  var l, r, u, d

  var myId

  var inflater = new modules.inflater.Inflater()

  var world, simulation

  var sprites = {}

  var socket = io.connect()
  socket.on('world_data', function (data) {
    world = inflater.inflate(data)
    simulation = new modules.simulation.Simulation(world)

    var lastTickTimestamp = Date.now()
    setInterval(function () {
      var frameTime = Date.now() - lastTickTimestamp

      while (frameTime > 0) {
        simulation.simulateTick()
        frameTime -= 15
      }
      lastTickTimestamp = Date.now()
    }, 15)

    if (myId !== undefined && stage === undefined) {
      Start()
    }
  })

  socket.on('human_id', function (data) {
    console.log("Got my human_id.")
    console.log(data)

    myId = data
    if (world !== undefined && stage === undefined) {
      Start()
    }
  })

  socket.on('command', function (command) {
    simulation.applyCommand(inflater.inflate(command))
  })

  function createNewHumanSprite() {
    var sprite = new Sprite()
    sprite.x = stage.stageWidth/2
    sprite.y = stage.stageHeight/2
    var cb = new Bitmap(new BitmapData("car.png"))
    cb.x = -123
    cb.y = -50
    sprite.addChild(cb)
    stage.addChild(sprite)
    return sprite
  }

  function Start()
  {
    stage = new Stage("c")
    console.log("Stage w:" + stage.stageWidth + ", stage h: " + stage.stageHeight)

    // background
    var s = new Sprite()
    s.graphics.beginBitmapFill(new BitmapData("asphalt.jpg"))
    s.graphics.drawRect(0,0,stage.stageWidth, stage.stageHeight)
    stage.addChild(s)

    // events
    stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown)
    stage.addEventListener(KeyboardEvent.KEY_UP  , onKeyUp)
    stage.addEventListener(Event.ENTER_FRAME     , onEnterFrame)
  }

  function onKeyDown(e)
  {
    if (e.keyCode == 37) l = true
    if (e.keyCode == 38) u = true
    if (e.keyCode == 39) r = true
    if (e.keyCode == 40) d = true

    if (l && r) {
      r = false
      l = false
    }
    if (u && d) {
      u = false
      d = false
    }

    function addSidewaysDirection(direction) {
      if (l) return direction + "W"
      else if (r) return direction + "E"
      return direction
    }

    var direction = ""
    if (u) {
      direction = "N"
      direction = addSidewaysDirection(direction)
    }
    else if (d) {
      direction = "S"
      direction = addSidewaysDirection(direction)
    }
    else {
      direction = addSidewaysDirection(direction)
    }

    if (lastDirection != direction && direction != "") {
      console.log("Sending MovementStart command to server with direction: " + direction)
      var command = new modules.commands.MovementStart(0, myId, direction)
      socket.emit("command", command)

      simulation.applyCommand(command)
    }

    lastDirection = direction
  }

  function onKeyUp(e)
  {
    if(e.keyCode == 37) l = false
    if(e.keyCode == 38) u = false
    if(e.keyCode == 39) r = false
    if(e.keyCode == 40) d = false

    lastDirection = ""
    if (!l && !u && !r && !d) {
      console.log("Sending MovementEnd command to server.")
      var command = new modules.commands.MovementEnd(0, myId)
      socket.emit("command", command)

      simulation.applyCommand(command)
    }
  }

  function onEnterFrame (e)
  {
    for (objectId in world.humans) {
      var object = world.humans[objectId]

      var sprite = sprites[objectId]
      if (sprite === undefined) {
        console.log("Creating sprite for:" + objectId)
        sprite = createNewHumanSprite()
        sprites[objectId] = sprite
      }

      sprite.x = object.coords.x
      sprite.y = object.coords.y
    }
  }

})()
