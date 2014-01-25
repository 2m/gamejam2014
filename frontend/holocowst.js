(function() {
    var stage, car, angle = 0, speed = 0
    var l, r, u, d

    var myCarId = Math.floor((Math.random()*100)+1)
    var counter = 0
    var socket = io.connect()
    socket.on('news', function (data) {
	console.log(data)
	socket.emit('my other event', { id: "car_" + myCarId })
    })

    var otherCars = {}
    socket.on('other_car', function (data) {
	console.log("got other_car message")
	console.log(data)

	var otherCar = undefined
	if (data.id in otherCars) {
            otherCar = otherCars[data.id]
	}
	else {
            console.log("creating new car " + data.id)
            otherCar = new Sprite()
            var cb = new Bitmap(new BitmapData("car.png"))
            cb.x = -123
	    cb.y = -50
            otherCar.addChild(cb)
            stage.addChild(otherCar)

            otherCars[data.id] = otherCar
	}

	otherCar.x = data.coords.x
	otherCar.y = data.coords.y
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
	if(e.keyCode == 37) l = true
	if(e.keyCode == 38) u = true
	if(e.keyCode == 39) r = true
	if(e.keyCode == 40) d = true
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

	counter = (counter + 1) % 50
	if (counter == 0) {
            var data = {
		id: "car_" + myCarId,
		coords: { x: car.x, y: car.y }
            }
            console.log("sending data to server")
            socket.emit('car_coords', data)
	}
    }
    
    Start()
})()