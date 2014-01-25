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


exports.boundBoxShouldConfirmPointInside = function(test) {
  var boundbox = new components.BoundingBox(5, 5, 10, 10)
  var inside = false

  test.ok(boundbox.pointInside(1, 5) == false)
  test.ok(boundbox.pointInside(5, 1) == false)

  test.ok(boundbox.pointInside(5, 5) == true)
  test.ok(boundbox.pointInside(10, 10) == true)

  test.ok(boundbox.pointInside(6, 6) == true)

  test.done()
}