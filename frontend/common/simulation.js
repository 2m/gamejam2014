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

        // updates coordinates and velocity
        object.coords = object.coords.add(object.velocity)

        if (!object.beingMoved) {
          object.velocity = object.velocity.mul(this.friction)
        }
      }
    }

    this.getCollisions = function(objects) {
      var keys = Object.keys(objects)
      var collision_pairs = []

      for (var outer_index = 0; outer_index < keys.length - 1; outer_index++) {
        var outer_key = keys[outer_index]
        var outer = objects[outer_key]

        // object has no bounding box
        if (!outer.bbox) {
          continue;
        }

        for (var inner_index = outer_index + 1;
             inner_index < keys.length; inner_index++) {

          var inner_key = keys[inner_index]
          var inner = objects[inner_key]

          // object has no bounding box
          if (!outer.bbox) {
            continue;
          }

          if (inner.bbox.collidesWith(outer.bbox)) {
            collision_pairs.push([outer, inner])
          }
        }
      }

      return collision_pairs
    }

  }

})(typeof module === 'undefined' ? this['modules']['simulation'] = {} : module.exports)
