(function(exports) {

  exports["Vector"] = Vector
  exports["Human"] = Human
  exports["Cow"] = Cow
  exports["BoundingBox"] = BoundingBox

  function Vector(x, y) {
    this.x = x
    this.y = y

    this.add = function(otherVector) {
      return new Vector(this.x + otherVector.x, this.y + otherVector.y)
    }

    this.mul = function(scalar) {
      return new Vector(this.x * scalar, this.y * scalar)
    }

    this.toString = function() {
      return "[x:" + this.x + ", y:" + this.y + "]"
    }
  }

  Vector.Zero = new Vector(0, 0)

  function BoundingBox(x1, y1, x2, y2) {
    // todo(aistis): validate input

    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2

    this.pointInside = function(x, y) {
      if (x >= this.x1 && x <= this.x2
          && y >= this.y1 && y <= this.y2)
      {
        return true;
      } else {
        return false;
      }
    }

  }

  function Human(id) {
    this.id = id
    this.coords = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
  }

  function Cow(id) {
    this.id = id
    this.coords = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
  }

  // this makes module work in nodejs as well as in browser
})(typeof module === 'undefined' ? this['components'] = {} : module.exports)
