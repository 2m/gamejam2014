(function(exports) {

  exports["Vector"] = Vector
  exports["Human"] = Human
  exports["Cow"] = Cow
  exports["Flower"] = Flower
  exports["BoundingBox"] = BoundingBox

  function Vector(x, y) {
    this.x = x
    this.y = y

    this.add = function(otherVector) {
      return new Vector(this.x + otherVector.x, this.y + otherVector.y)
    }

    this.sub = function(otherVector) {
      return new Vector(this.x - otherVector.x, this.y - otherVector.y)
    }

    this.mul = function(scalar) {
      return new Vector(this.x * scalar, this.y * scalar)
    }

    this.length = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    this.distanceTo = function(other) {
      return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2))
    }

    this.containsInRadius = function(otherVector, radius) {
      return this.distanceTo(otherVector) <= radius
    }

    this.negate = function() {
      return new Vector(-this.x, -this.y)
    }

    this.normalize = function() {
      var length = this.length()
      if (length != 0) {
        return new Vector(this.x / length, this.y / length)
      }
      else {
        return Vector.Zero
      }
    }

    this.toString = function() {
      return "[x:" + this.x + ", y:" + this.y + "]"
    }
  }

  Vector.Zero = new Vector(0, 0)

  /**
   * @param position type of vector
   */
  function BoundingBox(bobject, width, height) {
    // todo(aistis): validate input

    this.bobject = bobject
    this.width = width
    this.height = height

    this.pointInside = function(x, y) {
      position = this.bobject.coords

      var x1 = position.x - (this.width / 2)
      var x2 = position.x + (this.width / 2)
      var y1 = position.y - (this.height / 2)
      var y2 = position.y + (this.height / 2)

      if (x >= x1 && x <= x2
          && y >= y1 && y <= y2)
      {
        return true;
      } else {
        return false;
      }
    }

    this.collidesWith = function(bbox) {
      position = this.bobject.coords

      if (this.pointInside(position.x, position.y))
        return true

      var x1 = position.x - (bbox.width / 2)
      var x2 = position.x + (bbox.width / 2)
      var y1 = position.y - bbox.height
      var y2 = position.y

      if (this.pointInside(x1, y1))
        return true
      if (this.pointInside(x1, y2))
        return true
      if (this.pointInside(x2, y1))
        return true
      if (this.pointInside(x2, y2))
        return true

      return false
    }

  }

  function Human(id) {
    this.type = "Human"
    this.id = id
    this.coords = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
    this.beingMoved = false
    this.bbox = new BoundingBox(this, 42, 100)
  }

  Human.inflate = function(data) {
    var coords = new Vector(data.coords.x, data.coords.y)
    var velocity = new Vector(data.velocity.x, data.velocity.y)
    var human = new Human()
    human.id = data.id
    human.coords = coords
    human.velocity = velocity
    human.beingMoved = data.beingMoved
    human.bbox = new BoundingBox(human, 42, 100)
    return human
  }

  function Cow(id) {
    this.type = "Cow"
    this.id = id
    this.coords = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
    this.bbox = new BoundingBox(this.coords, 30, 40)
    this.health = 3
  }

  Cow.inflate = function(data) {
    var coords = new Vector(data.coords.x, data.coords.y)
    var velocity = new Vector(data.velocity.x, data.velocity.y)
    var cow = new Cow()
    cow.id = data.id
    cow.coords = coords
    cow.velocity = velocity
    cow.health = data.health
    cow.bbox = new BoundingBox(cow, 30, 40)
    return cow
  }

  function Flower(id, coords) {
    this.type = "Flower"
    this.id = id
    this.coords = coords
    this.velocity = Vector.Zero
    this.bbox = new BoundingBox(this, 16, 29)
  }

  Flower.inflate = function(data) {
    var coords = new Vector(data.coords.x, data.coords.y)
    var flower = new Flower()
    flower.id = data.id
    flower.coords = coords
    flower.bbox = new BoundingBox(flower, 16, 29)
    return flower
  }

  // this makes module work in nodejs as well as in browser
})(typeof module === 'undefined' ? this['modules']['components'] = {} : module.exports)
