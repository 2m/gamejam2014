(function(exports) {

  exports["World"] = World

  function World() {
    this.humans = {}            // human_id => human
    this.cows = {}              // cow_id => cow
    this.flowers = {}           // flower_id => flower

    this.currentFrameNum = 0

    this.getCurrentFrameNum = function() {
      return this.currentFrameNum
    }

    this.setCurrentFrameNum = function(frameNum) {
      this.currentFrameNum = frameNum
    }

    this.increaseCurrentFrameNum = function() {
      this.currentFrameNum += 1
    }

    // humans cows and flowers in one object pool
    this.getAllObjects = function() {
      var allObjects = {}
      for (var id in this.humans) {
        allObjects[id] = this.humans[id]
      }
      for (var id in this.cows) {
        allObjects[id] = this.cows[id]
      }
      for (var id in this.flowers) {
        allObjects[id] = this.flowers[id]
      }
      return allObjects
    }

    this.getAllCows = function() {
      return this.cows;
    }

    this.getAllFlowers = function() {
      return this.flowers;
    }

    this.getObject = function(objectId) {
      return this.getAllObjects()[objectId]
    }

    function getObjectId() {
      var objectId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
          })
      return objectId
    }

    /**
     * Returns humand_id
     */
    this.addHuman = function(human) {
      return addObject(human, this.humans)
    }

    this.removeHuman = function(humanId) {
      delete this.humans[humanId]
    }

    this.addCow = function(cow) {
      return addObject(cow, this.cows)
    }

    this.removeCow = function(id) {
      delete this.cows[id]
    }

    this.addFlower = function(flower) {
      return addObject(flower, this.flowers)
    }

    function addObject(object, container) {
      var objectId = object.id || getObjectId()
      if (!object.id) {
        object.id = objectId
      }

      if (container[objectId]) {
        throw "object with id " + objectId + " already exists"
      }
      container[objectId] = object

      return objectId
    }
  }

  World.inflate = function(data) {
    var world = new World()
    for (objectId in data.humans) {
      var inflated = require("./components").Human.inflate(data.humans[objectId])
      world.addHuman(inflated)
    }
    for (objectId in data.flowers) {
      var inflated = require("./components").Flower.inflate(data.flowers[objectId])
      world.addFlower(inflated)
    }
    for (objectId in data.cows) {
      var inflated = require("./components").Cow.inflate(data.cows[objectId])
      world.addCow(inflated)
    }
    world.currentFrameNum = data.currentFrameNum
    return world
  }

  // this makes module work in nodejs as well as in browser
})(typeof module === 'undefined' ? this['modules']['world'] = {} : module.exports)
