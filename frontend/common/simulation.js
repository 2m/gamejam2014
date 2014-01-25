(function(exports) {

  exports["Simulation"] = Simulation

  function Simulation() {
    var actors = {}

    this.applyCommand = function (command) {
      if (!(command.objectId in actors)) {
        console.log("Command for unknown objectId:" + command.objectId)
      }

      var actor = actors[command.objectId]
      switch (command.commandName) {
        case "MovementStart":
          // todo
          break
        default:
          console.log("Unknown command: " + command.commandName)
      }
    }
  }

})(typeof module === 'undefined' ? this['simulation'] = {} : module.exports)
