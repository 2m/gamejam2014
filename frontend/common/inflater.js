(function(exports) {

  var commands = require("./commands")

  exports["Inflater"] = Inflater

  function Inflater() {
    this.inflate = function(command) {
      switch (command.commandName) {
        case "MovementStart": return commands.MovementStart.inflate(command)
        case "MovementEnd": return commands.MovementEnd.inflate(command)
        case "FullWorld": return commands.FullWorld.inflate(command)
        case "Blast": return commands.Blast.inflate(command)
        default: throw ("I dunno how to inflate: " + command.commandName)
      }
    }
  }

})(typeof module === 'undefined' ? this['modules']['inflater'] = {} : module.exports)
