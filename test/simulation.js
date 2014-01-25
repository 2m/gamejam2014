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
  test.ok(h.velocity.y != 0, "human should be moving upwards")
  test.ok(h.beingMoved == true, "human should be moving upwards")

  test.done()
}

exports.shouldApplyMovementEndCommand = function(test) {

  var w = new world.World()
  var s = new simulation.Simulation(w)
  var h = new components.Human("human")
  var c = new commands.MovementEnd(1, "human")

  h.beingMoved = true

  w.addHuman(h)
  s.applyCommand(c)

  test.ok(h.beingMoved == false, "human should not be being moved")

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

  test.notEqual(h.coords.x, 0)
  test.notEqual(h.coords.y, 0)

  test.notEqual(h.velocity.x, 1)
  test.notEqual(h.velocity.y, 1)

  test.done()
}
