(function(exports) {

  var components = require("./components")

  exports["MovementStart"] = MovementStart
  exports["MovementEnd"] = MovementEnd

  function MovementStart(frameId, objectId, direction) {
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
  }

  function MovementEnd(frameId, objectId) {
    this.commandName = "MovementEnd"
    this.frameId = frameId
    this.objectId = objectId
  }

})(typeof module === 'undefined' ? this['commands'] = {} : module.exports)
