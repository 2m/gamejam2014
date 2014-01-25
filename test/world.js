var worldModule = require("../frontend/common/world")
var components = require("../frontend/common/components")

exports.humansShouldBeAdded = function(test) {
  var world = new worldModule.World()
  var human = new components.Human()

  var humanId = world.addHuman(human)
  test.ok(humanId)

  var object = world.getObject(humanId)
  test.ok(human == object)

  test.done()
}