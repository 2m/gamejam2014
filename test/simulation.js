var world = require("../frontend/common/world")
var components = require("../frontend/common/components")
var simulation = require("../frontend/common/simulation")
var commands = require("../frontend/common/commands")

exports.shouldApplyMovementStartCommand = function(test) {

  var w = new world.World()
  var s = new simulation.Simulation(w)
  var h = new components.Human("human")
  var c = new commands.MovementStart(1, "human", "N")

  w.addHuman(h)
  s.applyCommand(c)

  test.ok(h.velocity.x == 0, "human should not be moving sideways")
  test.ok(h.velocity.y == -1, "human should be moving upwards")

  test.done()
}

exports.shouldApplyMovementEndCommand = function(test) {

  var w = new world.World()
  var s = new simulation.Simulation(w)
  var h = new components.Human("human")
  var c = new commands.MovementEnd(1, "human")

  h.velocity.x = 12
  h.velocity.y = 2

  w.addHuman(h)
  s.applyCommand(c)

  test.ok(h.velocity.x == 0, "human should not be moving sideways")
  test.ok(h.velocity.y == 0, "human should not be moving vertically")

  test.done()
}

exports.shouldMovePlayerWhenTicked = function(test) {

  var w = new world.World()
  var s = new simulation.Simulation(w)
  var h = new components.Human("human")

  h.velocity.x = 1
  h.velocity.y = 1

  w.addHuman(h)
  s.simulateTick()

  test.ok(h.coords.x == 1, "human should have moved to the right")
  test.ok(h.coords.y == 1, "human should have moved down")

  test.ok(h.velocity.x == 0.8, "human sideways velocity should have degraded")
  test.ok(h.velocity.y == 0.8, "human vertical velocity should have downgraded")

  test.done()
}
