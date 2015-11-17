(function () {
  var beatSelector = '.div-beat'
  var headerSelector = '#playhead'
  function resizeGridOnBeatCountChange (change, total) {
    var parentWidth = $(headerSelector).width()
    var width = parentWidth / total
    $(beatSelector).each(function (index) {
      $(this).css('width', width)
    })
  }
  $.playhead.addLengthListener('style', resizeGridOnBeatCountChange)
  resizeGridOnBeatCountChange(0, 4)

  function randomColorInRange (min, max) {
    var color = {
      'r': randomInRange(min, max),
      'g': randomInRange(min, max),
      'b': randomInRange(min, max)
    }
    return color
  }

  function randomColor () {
    return randomColorInRange(0, 256)
  }

  function randomInRange (min, max) {
    return Math.floor((Math.random() * (max - min) + min))
  }

  $.randomColor = randomColor

  var c = randomColorInRange(128, 256)
  $.backgroundColor = c

  $('body').css('background-color', 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')')
  $('#root').css('height', $(window).height())
  $('#controls').css('top', $(window).height() * 0.5)
})()
