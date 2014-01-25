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
          object.beingMoved = true
          break
        case "MovementEnd":
          object.beingMoved = false
          break
        default:
          console.log("Unknown command: " + command.commandName)
      }
    }

    this.simulateTick = function () {
      for (objectId in this.world.getAllObjects()) {
        var object = this.world.getObject(objectId)
        object.coords = object.coords.add(object.velocity)

        if (!object.beingMoved) {
          object.velocity = object.velocity.mul(this.friction)
        }
      }
    }
  }

})(typeof module === 'undefined' ? this['modules']['simulation'] = {} : module.exports)
