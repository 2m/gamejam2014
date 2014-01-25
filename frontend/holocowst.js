(function() {
  var stage, car, angle = 0, speed = 0, lastDirection = ""
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

    if (lastDirection != direction) {
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
  }

  function onEF (e)
  {
    speed *= 0.9
    if(u) speed += 1+speed*0.06
    if(d) speed -= 1

    if(r) angle += speed * 0.003
    if(l) angle -= speed * 0.003

    car.rotation = angle*180/Math.PI
    car.x += Math.cos(angle) * speed
    car.y += Math.sin(angle) * speed
  }

  Start()
})()
