(function(exports) {

  var components = require("./components")

  exports["Simulation"] = Simulation

  function Simulation(world) {
    // how much veolicty degrades per frame
    this.friction = 0.8

    this.world = world

    this.applyCommand = function (command) {
      var object = this.world.getObject(command.objectId)
      if (object === undefined) {
        console.log("Command for unknown objectId:" + command.objectId)
        return
      }

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
      for (objectId in this.world.objects) {
        var object = this.world.getObject(objectId)
        object.coords = object.coords.add(object.velocity)
        object.velocity = object.velocity.mul(this.friction)
      }
    }
  }

})(typeof module === 'undefined' ? this['simulation'] = {} : module.exports)
