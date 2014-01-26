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
  var bbox = new components.BoundingBox( 5, 5)
  var bobject = {coords: position}

  test.ok(bbox.pointInside(bobject, 1, 5) == false)
  test.ok(bbox.pointInside(bobject, 5, 1) == false)

  test.ok(bbox.pointInside(bobject, 5, 5) == true)
  test.ok(bbox.pointInside(bobject, 10, 10) == true)

  test.ok(bbox.pointInside(bobject, 6, 6) == true)

  test.done()
}

exports.boundboxShouldColideWithBoundBox = function(test) {
  var near = new components.Vector(5, 10)
  var far = new components.Vector(100, 50)
  var bbox = new components.BoundingBox(10, 10)

  var outer = {coords: near, bbox: bbox}
  var inner = {coords: far, bbox: bbox}

  test.ok(outer.bbox.collidesWith(outer, inner) == false)
  test.ok(outer.bbox.collidesWith(outer, outer) == true)

  test.done()
}

exports.boundboxShouldNotColideWithVeryFarObjects = function(test) {
  var far = new components.Vector(1540, 754)
  var near = new components.Vector(70, 482)
  var bbox = new components.BoundingBox(30, 40)

  var outer = {coords: near, bbox: bbox}
  var inner = {coords: far, bbox: bbox}

  test.ok(outer.bbox.collidesWith(outer, inner) == false)

  test.done()
}
