(function(exports) {

  var components = require("./components")

  exports["Simulation"] = Simulation

  function Simulation(world) {
    // how much veolicty degrades per frame
    this.friction = 0.8
    this.cowSpeed = 2

    this.world = world

    this.setWorld = function (world) {
      this.world = world
    }

    this.applyCommand = function (command) {

      var object = this.world.getObject(command.objectId)
      if (object === undefined) {
        console.log("Command for unknown objectId:" + command.objectId)
        return
      }

      switch (command.commandName) {
        case "MovementStart":
          //object.coords = command.coords

          // vector which points from the current client position to the server known position
          // will be used to correct client movement
          var vect = command.coords.sub(object.coords).normalize()

          object.velocity = command.direction.mul(command.speed).add(vect.mul(0.1))
          object.beingMoved = true
          break
        case "MovementEnd":
          object.beingMoved = false
          break
        case "Blast":
          var blastPosition = this.world.getObject(command.objectId).coords
          for (cowId in this.world.getAllCows()) {
            var cow = this.world.getObject(cowId)
            if (blastPosition.containsInRadius(cow.coords, command.radius)) {
              var cowMovementFromBlast = cow.coords.sub(blastPosition)
              cow.velocity = cow.velocity.add(cowMovementFromBlast.normalize().mul(command.power))
              cow.health -= 1
              console.log("Blasting cow: " + cowId + " which now has health " + cow.health)
            }
          }
          break
        default:
          console.log("Unknown command: " + command.commandName)
      }
    }

    this.simulateTick = function () {

      this.world.increaseCurrentFrameNum()
      if (this.world.getCurrentFrameNum() % 1000 == 0) {
        console.log("Current frame number: " + this.world.getCurrentFrameNum())
      }

      // go through all cows and remove them if health is < 0
      for (cowId in this.world.getAllCows()) {
        var cow = this.world.getObject(cowId)
        if (cow.health <= 0) {
          this.world.removeCow(cowId)
        }
      }

      // go through all cows and make them head towards nearest flower
      for (cowId in this.world.getAllCows()) {
        var cow = this.world.getObject(cowId)

        var nearestFlowerPos, minDistance = 9999
        for (flowerId in this.world.getAllFlowers()) {
          var flower = this.world.getObject(flowerId)
          if (cow.coords.distanceTo(flower.coords) < minDistance) {
            minDistance = cow.coords.distanceTo(flower.coords)
            nearestFlowerPos = flower.coords
          }
        }

        var cowMovementToTheFlower = nearestFlowerPos.sub(cow.coords)
        if (minDistance < 5) {
          cowMovementToTheFlower = components.Vector.Zero
        }

        cow.velocity = cow.velocity.add(cowMovementToTheFlower.normalize())
      }

      for (objectId in this.world.getAllObjects()) {
        var object = this.world.getObject(objectId)

        // updates coordinates and velocity
        object.coords = object.coords.add(object.velocity)

        if (!object.beingMoved) {
          object.velocity = object.velocity.mul(this.friction)
          if (object.velocity.length() < 0.01) {
            object.velocity = components.Vector.Zero
          }
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
