(function(exports) {

  var components = require("./components")

  exports["MovementStart"] = MovementStart
  exports["MovementEnd"] = MovementEnd
  exports["FullWorld"] = FullWorld

  function MovementStart(frameId, objectId, direction, coords) {
    this.commandName = "MovementStart"
    this.frameId = frameId // int
    this.objectId = objectId

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

    this.speed = 1
    this.coords = coords
  }

  MovementStart.inflate = function (command) {
    var direction = new components.Vector(command.direction.x, command.direction.y)
    var command = new MovementStart(command.frameId, command.objectId)
    command.direction = direction
    return command
  }

  function MovementEnd(frameId, objectId) {
    this.commandName = "MovementEnd"
    this.frameId = frameId
    this.objectId = objectId
  }

  MovementEnd.inflate = function (command) {
    return new MovementEnd(command.frameId, command.objectId)
  }

  function FullWorld(world) {
    this.commandName = "FullWorld"
    this.world = world
  }

  FullWorld.inflate = function (command) {
    var world = require("./world").World.inflate(command.world)
    return new FullWorld(world)
  }

})(typeof module === 'undefined' ? this['modules']['commands'] = {} : module.exports)
