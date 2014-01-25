(function(exports) {

  var components = require("./components")

  exports["Simulation"] = Simulation

  function Simulation() {
    // how much veolicty degrades per frame
    this.friction = 0.8

    this.objects = {}

    this.addObject = function(object) {
      this.objects[object.id] = object
    }

    this.applyCommand = function (command) {
      if (!(command.objectId in this.objects)) {
        console.log("Command for unknown objectId:" + command.objectId)
      }

      var object = this.objects[command.objectId]
      switch (command.commandName) {
        case "MovementStart":
          object.velocity = command.direction.mul(command.speed)
          break
        case "MovementEnd":
          object.velocity = components.Vector.Zero
          break
        default:
          console.log("Unknown command: " + command.commandName)
      }
    }

    this.simulateTick = function () {
      for (objectId in this.objects) {
        var object = this.objects[objectId]
        object.coords = object.coords.add(object.velocity)
        object.velocity = object.velocity.mul(this.friction)
      }
    }
  }

})(typeof module === 'undefined' ? this['simulation'] = {} : module.exports)
