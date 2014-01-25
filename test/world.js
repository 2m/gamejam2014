var worldModule = require("../frontend/common/world")
var components = require("../frontend/common/components")

exports.humanShouldBeAdded = function(test) {
  var world = new worldModule.World()
  var human = new components.Human()

  var humanId = world.addHuman(human)
  test.ok(humanId)

  var object = world.getObject(humanId)
  test.ok(human == object)

  test.done()
}

exports.twoHumansShouldBeAdded = function(test) {
  var world = new worldModule.World()
  var human0 = new components.Human()
  var human1 = new components.Human()

  var humanId0 = world.addHuman(human0)
  var humanId1 = world.addHuman(human1)

  test.ok(humanId0 != humanId1, "human ids are equal")

  test.done()
}
