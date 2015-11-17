(function (e) {
  function Visualizer (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    var color = $.randomColor()
    this.r = color.r
    this.g = color.g
    this.b = color.b
    this.waveformData = null
    this.spectrumData = null
  }

  e.Visualizer = Visualizer

  Visualizer.prototype.setup = function () {

  }

  Visualizer.prototype.draw = function (sketch) {
    if (this.waveformData !== null) {
      sketch.noFill()
      sketch.stroke(this.r, this.g, this.b)
      sketch.beginShape()
      for (var x = 0; x < this.width; x++) {
        var i = Math.floor(sketch.map(x, 0, this.width, 0, this.waveformData.length))
        var y = sketch.map(this.waveformData[i], 0, 256, -this.height / 2, this.height / 2)
        sketch.vertex(x + this.x, this.y - y)
        // console.log(x + ' ' + y)
      }
      sketch.endShape()
    }
  }

  Visualizer.prototype.flush = function () {
    this.waveformData = null
    this.spectrumData = null
  }
})(jQuery, window, document)
