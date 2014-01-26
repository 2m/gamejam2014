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
  function BoundingBox(position, width, height) {
    // todo(aistis): validate input

    this.position = position
    this.width = width
    this.height = height

    this.pointInside = function(x, y) {
      var x1 = this.position.x - (this.width / 2)
      var x2 = this.position.x + (this.width / 2)
      var y1 = this.position.y - (this.height / 2)
      var y2 = this.position.y + (this.height / 2)

      if (x >= x1 && x <= x2
          && y >= y1 && y <= y2)
      {
        return true;
      } else {
        return false;
      }
    }

    this.collidesWith = function(bbox) {
      if (this.pointInside(bbox.position.x, bbox.position.y))
        return true

      var x1 = bbox.position.x - (bbox.width / 2)
      var x2 = bbox.position.x + (bbox.width / 2)
      var y1 = bbox.position.y - (bbox.height / 2)
      var y2 = bbox.position.y + (bbox.height / 2)

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
    this.bbox = new BoundingBox(this.coords, 30, 40)
  }

  Human.inflate = function(data) {
    var coords = new Vector(data.coords.x, data.coords.y)
    var velocity = new Vector(data.velocity.x, data.velocity.y)
    var human = new Human()
    human.id = data.id
    human.coords = coords
    human.velocity = velocity
    human.beingMoved = data.beingMoved
    return human
  }

  function Cow(id) {
    this.type = "Cow"
    this.id = id
    this.coords = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
    this.bbox = new BoundingBox(this.coords, 30, 40)
  }

  Cow.inflate = function(data) {
    var coords = new Vector(data.coords.x, data.coords.y)
    var velocity = new Vector(data.velocity.x, data.velocity.y)
    var cow = new Cow()
    cow.id = data.id
    cow.coords = coords
    cow.velocity = velocity
    return cow
  }

  function Flower(id, coords) {
    this.type = "Flower"
    this.id = id
    this.coords = coords
    this.velocity = Vector.Zero
  }

  Flower.inflate = function(data) {
    var coords = new Vector(data.coords.x, data.coords.y)
    var flower = new Flower()
    flower.id = data.id
    flower.coords = coords
    return flower
  }

  // this makes module work in nodejs as well as in browser
})(typeof module === 'undefined' ? this['modules']['components'] = {} : module.exports)
