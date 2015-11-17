(function (e) {

  var beats = 0
  var currentBeat = 4

  var currentInterval = null;

  var beatDivs = []

  var beatListeners = []
  var lengthListeners = {}

  for (var i = 1; i <= 4; i++) {
    addBeat()
    beatListeners.push({})
  }

  beatDivs[beatDivs.length - 1].classList.add('current')

  $('#bpm').change(updateBpm)

  setBpm(120)

  function updateBpm () {
    setBpm()
  }


  function getBpm () {
    return $('#bpm').val()
  }

  function setBpm(newBpm) {
    var bpm = newBpm ? newBpm : $('#bpm').val()
    if(bpm < 1) {
      $('#bpm').val(1)
      bpm = 1
    }
    if (currentInterval) {
      window.clearInterval(currentInterval)
    }
    currentInterval = window.setInterval(onBeat, (60 / bpm) * 1000)
  }

  function onBeat () {
    if (!beatDivs[currentBeat - 1]) {
      currentBeat = beats
    }
    beatDivs[currentBeat - 1].classList.remove('current')
    currentBeat = Math.max(1, (currentBeat + 1) % (beats + 1))
    beatDivs[currentBeat - 1].classList.add('current')
    for(id in beatListeners[currentBeat]) {
      if (typeof beatListeners[currentBeat][id] === 'function') {
        beatListeners[currentBeat][id]()
      }
    }
  }

  function addBeatListener (beat, id, cb) {
    beatListeners[beat][id] = cb
  }

  function removeBeatListener (beat, id) {
    if (beatListeners[beat][id]) delete beatListeners[beat][id]
  }

  function addLengthListener(id, cb) {
    lengthListeners[id] = cb
  }

  function removeLengthListener(id) {
    if (lengthListeners[id]) delete lengthListeners[id]
  }

  function addBeat () {
    if(beats === 4) {
      $('#btn-remove').prop('disabled', false)
    }
    beats++
    if(beats === 16) {
      $('#btn-add').prop('disabled', true)
    }
    var beatDiv = document.createElement('th')
    beatDiv.id = 'div-beat-' + beats
    beatDiv.className = 'div-beat text-center'
    var numberText = document.createElement('h1')
    beatDiv.innerHTML = beats
    $(beatDiv).insertBefore("#beat-buttons")
    beatDivs.push(beatDiv)
    beatListeners.push([])
    for(id in lengthListeners) {
      if (typeof lengthListeners[id] === 'function') {
        lengthListeners[id](1, beats)
      }
    }
  }

  function removeBeat () {
    if(beats === 5) {
      $('#btn-remove').prop('disabled', true)
    }
    beats--
    if(beats === 15) {
      $('#btn-add').prop('disabled', false)
    }
    var beatDiv = beatDivs[beatDivs.length - 1]
    $(beatDiv).remove()
    beatDivs.splice(beatDivs.length - 1, 1)
    beatListeners.splice(beatListeners.length - 1, 1)
    for(id in lengthListeners) {
      if (typeof lengthListeners[id] === 'function') {
        lengthListeners[id](-1, beats)
      }
    }
  }

  function getBeats () {
    return beats
  }

  function setBeats (n) {
    if (beats < n) {
      for (var i = beats; i < n; i++) {
        addBeat()
      }
    } else {
      for (var i = beats; i > n; i--) {
        removeBeat()
      }
    }
  }

  $('#btn-remove').click(removeBeat)
  $('#btn-add').click(addBeat)
  $.playhead = {
    'addBeatListener': addBeatListener,
    'removeBeatListener': removeBeatListener,
    'addLengthListener': addLengthListener,
    'removeBeatListener': removeBeatListener,
    'getBeats': getBeats,
    'setBeats': setBeats,
    'getBpm': getBpm,
    'setBpm': setBpm
  }
})(jQuery, window, document)
