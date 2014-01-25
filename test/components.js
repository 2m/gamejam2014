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
  var position = new components.Vector(7.5, 7.5)
  var boundbox = new components.BoundingBox(position, 5, 5)
  var inside = false

  test.ok(boundbox.pointInside(1, 5) == false)
  test.ok(boundbox.pointInside(5, 1) == false)

  test.ok(boundbox.pointInside(5, 5) == true)
  test.ok(boundbox.pointInside(10, 10) == true)

  test.ok(boundbox.pointInside(6, 6) == true)

  test.done()
}

exports.boundboxShouldColideWithBoundBox = function(test) {
  var position = new components.Vector(5, 10)
  var outsidePosition = new components.Vector(100, 50)
  var outer = new components.BoundingBox(position, 10, 10)
  var inner = new components.BoundingBox(position, 10, 10)

  test.ok(outer.collidesWith(inner) == true)
  test.ok(outer.collidesWith(outer) == true)

  inner.position = outsidePosition
  test.ok(outer.collidesWith(inner) == false)

  test.done()
}