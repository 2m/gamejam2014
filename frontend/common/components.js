(function(exports) {

  exports["Vector"] = Vector
  exports["Human"] = Human
  exports["Cow"] = Cow

  function Vector(x, y) {
    this.x = x
    this.y = y

    this.add = function(otherVector) {
      return new Vector(this.x + otherVector.x, this.y + otherVector.y)
    }

    this.toString = function() {
      return "[x:" + this.x + ", y:" + this.y + "]"
    }
  }

  function Human() {
    this.coords = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
  }

  function Cow() {
    this.coords = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
  }

  // this makes module work in nodejs as well as in browser
})(typeof module === 'undefined' ? this['components'] = {}: module.exports);
