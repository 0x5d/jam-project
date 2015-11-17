var r, g, b
var x, y, w, h
var delegates = []

function setup () {
  setupConstants()
  var myCanvas = createCanvas($(window).width() - 15, $(window).height())
  myCanvas.parent('sketch')

  background(r, g, b)

  this.delegates.forEach(function (e) {
    e.setup(this)
  })

  $.sketch = {
    'createVisualizer': createVisualizer,
    'removeVisualizer': removeVisualizer
  }
}

function removeVisualizer (visualizer) {
  delegates.splice(delegates.indexOf(visualizer), 1)
}

function setupConstants () {
  var bgColor = $.backgroundColor
  r = bgColor.r
  g = bgColor.g
  b = bgColor.b

  x = 0
  y = $(window).height() / 2
  h = $(window).height() / 2
  w = $(window).width()
}

function createVisualizer () {
  var visualizer = new $.Visualizer(x, y, w, h)
  delegates.push(visualizer)
  return visualizer
}

function draw () {
  clean()
  delegates.forEach(function (e) {
    e.draw(this)
  })
}

function clean () {
  background(r, g, b)
}
