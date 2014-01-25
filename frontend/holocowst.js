(function() {
  var stage, car, lastDirection, speedX = 0, speedY = 0
  var l, r, u, d

  var myId = ""

  var socket = io.connect()
  socket.on('world_data', function (data) {
    console.log("Got world data.")
    console.log(data)

  })

  socket.on('human_id', function (data) {
    console.log("Got my human_id.")
    console.log(data)
    myId = data
  })

  function Start()
  {
    stage = new Stage("c")

    // background
    var s = new Sprite()
    s.graphics.beginBitmapFill(new BitmapData("asphalt.jpg"))
    s.graphics.drawRect(0,0,stage.stageWidth, stage.stageHeight)
    stage.addChild(s)

    // car
    car = new Sprite()
    car.x = stage.stageWidth/2
    car.y = stage.stageHeight/2
    var cb = new Bitmap(new BitmapData("car.png"))
    cb.x = -123
    cb.y = -50
    car.addChild(cb)
    stage.addChild(car)

    // events
    stage.addEventListener(KeyboardEvent.KEY_DOWN, onKD)
    stage.addEventListener(KeyboardEvent.KEY_UP  , onKU)
    stage.addEventListener(Event.ENTER_FRAME     , onEF)
  }

  function onKD (e)
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
      if (l) return direction + "E"
      else if (r) return direction + "W"
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
      var command = new commands.MovementStart(0, myId, direction)
      socket.emit("command", command)
    }

    lastDirection = direction
  }

  function onKU (e)
  {
    if(e.keyCode == 37) l = false
    if(e.keyCode == 38) u = false
    if(e.keyCode == 39) r = false
    if(e.keyCode == 40) d = false

    lastDirection = ""
    if (!l && !u && !r && !d) {
      console.log("Sending MovementEnd command to server.")
      var command = new commands.MovementEnd(0, myId)
      socket.emit("command", command)
    }
  }

  function onEF (e)
  {
    speedY *= 0.9
    speedX *= 0.9

    if(d) speedY += 1 + speedY * 0.06
    if(u) speedY -= 1 - speedY * 0.06

    if(r) speedX += 1 + speedX * 0.06
    if(l) speedX -= 1 - speedX * 0.06

    car.x += speedX
    car.y += speedY
  }

  Start()
})()
