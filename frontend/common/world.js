(function(exports) {

  exports["World"] = World

  function World() {
    this.humans = {}            // human_id => human
    this.cows = {}              // cow_id => cow
    this.flowers = {}           // flower_id => flower

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

    this.getObject = function(objectId) {
      return this.getAllObjects()[objectId]
    }

    this.getObjectId = function(){
      var human_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
          })
      return human_id
    }

    /**
     * Returns humand_id
     */
    this.addHuman = function(human) {
      var humanId = human.id || this.getObjectId()

      if (!human.id) {
        human.id = humanId
      }

      if (this.humans[humanId]) {
        throw "human with id " + humanId + " already exists"
      }
      this.humans[humanId] = human

      return humanId
    }

    this.removeHuman = function(humanId) {
      delete this.humans[humanId]
    }

    this.addCow = function(cow) {
      var cowId = cow.id || this.getObjectId()

      if (!cow.id) {
        cow.id = cowId
      }

      if (this.cows[cowId]) {
        throw "cow with id " + cowId + " already exists"
      }
      this.cows[cowId] = cow

      return cowId
    }
  }

  // this makes module work in nodejs as well as in browser
})(typeof module === 'undefined' ? this['modules']['world'] = {} : module.exports)
