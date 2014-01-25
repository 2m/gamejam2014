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
