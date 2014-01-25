(function(exports) {

  exports["Ticker"] = Ticker

  function Ticker(simulation) {
    var tickEveryMs = 15

    var lastTickTimestamp = Date.now()
    setInterval(function () {
      var frameTime = Date.now() - lastTickTimestamp

      while (frameTime > 0) {
        simulation.simulateTick()
        frameTime -= tickEveryMs
      }
      lastTickTimestamp = Date.now()
    }, tickEveryMs)
  }

})(typeof module === 'undefined' ? this['modules']['ticker'] = {} : module.exports)
