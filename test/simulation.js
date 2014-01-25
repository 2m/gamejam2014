var components = require("../frontend/common/components")
var simulation = require("../frontend/common/simulation")
var commands = require("../frontend/common/commands")

exports.shouldHoldObjects = function(test) {

  var s = new simulation.Simulation()
  var h = new components.Human("human")

  s.addObject(h)

  test.ok("human" in s.objects, "human should be in simulation")

  test.done()
}

exports.shouldApplyMovementStartCommand = function(test) {

  var s = new simulation.Simulation()
  var h = new components.Human("human")
  var c = new commands.MovementStart(1, "human", "N")

  s.addObject(h)
  s.applyCommand(c)

  test.ok(h.velocity.x == 0, "human should not be moving sideways")
  test.ok(h.velocity.y == -1, "human should be moving upwards")

  test.done()
}

exports.shouldApplyMovementEndCommand = function(test) {

  var s = new simulation.Simulation()
  var h = new components.Human("human")
  var c = new commands.MovementEnd(1, "human")

  h.velocity.x = 12
  h.velocity.y = 2

  s.addObject(h)
  s.applyCommand(c)

  test.ok(h.velocity.x == 0, "human should not be moving sideways")
  test.ok(h.velocity.y == 0, "human should not be moving vertically")

  test.done()
}

exports.shouldMovePlayerWhenTicked = function(test) {

  var s = new simulation.Simulation()
  var h = new components.Human("human")

  h.velocity.x = 1
  h.velocity.y = 1

  s.addObject(h)
  s.simulateTick()

  test.ok(h.coords.x == 1, "human should have moved to the right")
  test.ok(h.coords.y == 1, "human should have moved down")

  test.ok(h.velocity.x == 0.8, "human sideways velocity should have degraded")
  test.ok(h.velocity.y == 0.8, "human vertical velocity should have downgraded")

  test.done()
}
