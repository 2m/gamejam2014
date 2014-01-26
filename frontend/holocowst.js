(function() {
  var stage, car, lastDirection, speedX = 0, speedY = 0
  var l, r, u, d

  var myId

  var inflater = new modules.inflater.Inflater()

  window.world = world = undefined
  var simulation = new modules.simulation.Simulation()

  var sprites = {}

  var socket = io.connect()
  socket.on('world_data', function (data) {
    world = inflater.inflate(data).world
    simulation.setWorld(world)

    if (myId !== undefined && stage === undefined) {
      var ticker = new modules.ticker.Ticker(simulation)
      Start()
    }
  })

  socket.on('human_id', function (data) {
    console.log("Got my human_id.")
    console.log(data)

    myId = data
    if (world !== undefined && stage === undefined) {
      var ticker = new modules.ticker.Ticker(simulation)
      Start()
    }
  })

  socket.on('command', function (command) {
    simulation.applyCommand(inflater.inflate(command))
  })

  function createNewHumanSprite() {
    var sprite = new Sprite()
    var cb = new Bitmap(new BitmapData("human.png"))
    cb.x = -21
    cb.y = -100
    sprite.addChild(cb)

    // debug, feet point
    sprite.graphics.beginFill (0, 1.0);
    sprite.graphics.drawCircle(0, 0, 3)
    sprite.graphics.endFill()

    stage.addChild(sprite)
    return sprite
  }

  function createNewFlowerSprite() {
    var sprite = new Sprite()
    var cb = new Bitmap(new BitmapData("flower.png"))
    cb.x = -8
    cb.y = -29
    sprite.addChild(cb)

    // debug, feet point
    sprite.graphics.beginFill (0, 1.0);
    sprite.graphics.drawCircle(0, 0, 3)
    sprite.graphics.endFill()

    stage.addChild(sprite)
    return sprite
  }

  function Start()
  {
    stage = new Stage("c")
    console.log("Stage w:" + stage.stageWidth + ", stage h: " + stage.stageHeight)

    // background
    var s = new Sprite()
    var bg_tile = new BitmapData("bg_grid.png")
    s.graphics.beginBitmapFill(bg_tile)
    s.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight)
    s.graphics.endFill()
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
      var myHuman = world.getObject(myId)
      var command = new modules.commands.MovementStart(world.getCurrentFrameNum(), myId, direction, myHuman.coords)
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
    for (objectId in world.getAllObjects()) {
      var object = world.getAllObjects()[objectId]

      var sprite = sprites[objectId]
      if (sprite === undefined) {
        console.log("Creating sprite for:" + objectId)
        switch (object.type) {
          case "Human": sprite = createNewHumanSprite(); break
          case "Flower": sprite = createNewFlowerSprite(); break
          default: throw "Do not know what sprite to create for " + object.type
        }
        sprites[objectId] = sprite
      }

      sprite.x = object.coords.x
      sprite.y = object.coords.y
    }

    // delete sprites for which we do not have world objects
    for (objectId in sprites) {
      if (!(objectId in world.getAllObjects())) {
        console.log("Removing sprite which does not have a game object.")
        stage.removeChild(sprites[objectId])
        delete sprites[objectId]
      }
    }
  }

})()
