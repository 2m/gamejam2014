(function(exports) {

  exports["Ticker"] = Ticker

  function Ticker(simulation) {
    var tickEveryMs = 15

    var simulationTimes = []

    var lastTickTimestamp = Date.now()
    setInterval(function () {
      var frameTime = Date.now() - lastTickTimestamp

      while (frameTime > 0) {
        var simulationStart = Date.now()
        simulation.simulateTick()
        simulationTimes.unshift(Date.now() - simulationStart)
        simulationTimes = simulationTimes.slice(0, 100)

        frameTime -= tickEveryMs
      }
      lastTickTimestamp = Date.now()
    }, tickEveryMs)

    setInterval(function() {
      var sum = 0
      for (var time in simulationTimes) {
        sum += simulationTimes[time]
      }
      console.log("Average time per simulation: " + Math.round(sum / 100) + "ms")
    }, 3000)
  }

})(typeof module === 'undefined' ? this['modules']['ticker'] = {} : module.exports)
