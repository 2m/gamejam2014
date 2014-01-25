var components = require("../frontend/common/components")

exports.vectorsShouldBeAdded = function(test) {

  var a = new components.Vector(1, 2)
  var b = new components.Vector(3, 4)

  var c = a.add(b)

  test.ok(c.x == 4, "x should be added")
  test.ok(c.y == 6, "y should be added")

  test.done()
}

exports.humanShouldHaveRequiredComponents = function(test) {

  var h = new components.Human()

  test.ok(h.coords !== undefined)
  test.ok(h.velocity !== undefined)
  test.ok(h.actions === undefined)

  test.done()
}

exports.cowShouldHaveRequiredComponents = function(test) {

  var h = new components.Cow()

  test.ok(h.coords !== undefined)
  test.ok(h.velocity !== undefined)

  test.done()
}
