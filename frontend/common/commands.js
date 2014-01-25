(function(exports) {

  var components = require("./components")

  exports["MovementStart"] = MovementStart
  exports["MovementEnd"] = MovementEnd
  exports["FullWorld"] = FullWorld

  function MovementStart(frameId, objectId, direction, coords) {
    this.commandName = "MovementStart"
    this.frameId = frameId // int
    this.objectId = objectId

    if (typeof direction == "string") {
      switch (direction) {
        case "N":  this.direction = new components.Vector(0, -1); break;
        case "NE": this.direction = new components.Vector(1, -1); break;
        case "E":  this.direction = new components.Vector(1, 0); break;
        case "SE": this.direction = new components.Vector(1, 1); break;
        case "S":  this.direction = new components.Vector(0, 1); break;
        case "SW": this.direction = new components.Vector(-1, 1); break;
        case "W":  this.direction = new components.Vector(-1, 0); break;
        case "NW": this.direction = new components.Vector(-1, -1); break;
      }
    }
    else {
      this.direction = direction
    }

    this.speed = 1
    this.coords = coords
  }

  MovementStart.inflate = function (data) {
    var direction = new components.Vector(data.direction.x, data.direction.y)
    var coords = new components.Vector(data.coords.x, data.coords.y)
    return new MovementStart(data.frameId, data.objectId, direction, coords)
  }

  function MovementEnd(frameId, objectId) {
    this.commandName = "MovementEnd"
    this.frameId = frameId
    this.objectId = objectId
  }

  MovementEnd.inflate = function (data) {
    return new MovementEnd(data.frameId, data.objectId)
  }

  function FullWorld(world) {
    this.commandName = "FullWorld"
    this.world = world
  }

  FullWorld.inflate = function (data) {
    var world = require("./world").World.inflate(data.world)
    return new FullWorld(world)
  }

})(typeof module === 'undefined' ? this['modules']['commands'] = {} : module.exports)
