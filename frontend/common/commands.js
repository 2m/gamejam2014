(function(exports) {

  exports["MovementStart"] = MovementStart

  function MovementStart(objectId, direction) {
    this.commandName = "MovementStart"
    this.objectId = objectId

    /*
      N  - Vector(0, 1)
      NE - Vector(1, 1)
      E -  Vector(1, 0)
      SE - Vector(1, -1)
      S -  Vector(0, -1)
      SW - Vector(-1, -1)
      W -  Vector(-1, 0)
      NW - Vector(-1, 1)
     */
    this.direction = direction

    this.speed = 1
  }

})(typeof module === 'undefined' ? this['commands'] = {} : module.exports)
