(function(exports) {

  exports["Simulation"] = Simulation

  function Simulation() {
    this.objects = {}

    this.addObject = function(object) {
      this.objects[object.id] = object
    }

    this.applyCommand = function (command) {
      if (!(command.objectId in this.objects)) {
        console.log("Command for unknown objectId:" + command.objectId)
      }

      var actor = this.objects[command.objectId]
      switch (command.commandName) {
        case "MovementStart":
          actor.velocity = command.direction.mul(command.speed)
          break
        default:
          console.log("Unknown command: " + command.commandName)
      }
    }
  }

})(typeof module === 'undefined' ? this['simulation'] = {} : module.exports)
