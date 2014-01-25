(function(exports) {

  var commands = require("./commands")

  exports["Inflater"] = Inflater

  function Inflater() {
    this.inflate = function(command) {
      switch (command.commandName) {
        case "MovementStart": return commands.MovementStart.inflate(command)
        case "MovementEnd": return commands.MovementEnd.inflate(command)
        default: throw new Exception("I dunno how to inflate: " + command.commandName)
      }
    }
  }

})(typeof module === 'undefined' ? this['inflater'] = {} : module.exports)
