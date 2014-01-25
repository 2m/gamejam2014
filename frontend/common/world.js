(function(exports) {

  exports["World"] = World

  function World() {
    this.humans = {}            // human_id => human
    this.cows = {}              // cow_id => cow
    this.flowers = {}           // flower_id => flower

    this.objects = {}           // humans cows and flowers in one object pool

    // todo(aistis): make private
    this.addObject = function(objectId, object) {
      if (this.objects[objectId]) {
        throw "object with id " + objectId + " already exists"
      }

      this.objects[objectId] = object
    }

    this.removeObject = function(objectId) {
      delete this.objects[objectId]
    }

    this.getObject = function(objectId) {
      return this.objects[objectId]
    }

    /**
     * Returns humand_id
     */
    this.addHuman = function(human) {
      var humanId = human.id || "h0"

      if (this.humans[humanId]) {
        throw "human with id " + humanId + " already exists"
      }
      this.humans[humanId] = human

      this.addObject(humanId, human)

      return humanId
    }

    this.removeHuman = function(humanId) {
      delete this.humans[humanId]
      this.removeObject(humanId)
    }
  }

  // this makes module work in nodejs as well as in browser
})(typeof module === 'undefined' ? this['components'] = {}: module.exports);
