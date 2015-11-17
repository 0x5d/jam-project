var audioRecorder = null
var samples = {}
var sampleIndex = 0
var sampleCount = 0

var sessionId = window.location.search.substring(1).split('=')[1]
if (!sessionId) {
  window.location = '/'
}

var socket = io()
socket.emit('enter', sessionId)

socket.on('sound', function (sound) {
  processBlob(new Blob([sound.blob]), sound.name)
})

socket.on('settings', function (settings) {
  processSettings(settings)
})

$.playhead.addLengthListener('controller', function (lengthDelta, beats) {
  if (sampleCount === 0) {
    socket.emit('settings', getSettings())
    return
  }
  var sampleDivs = $('.sample')
  if (lengthDelta > 0) {
    sampleDivs.each(function (i, sampleDiv) {
      var id = [sampleDiv.id, 'beat', beats, 'toggle'].join('-')
      addBeatToSample(sampleDiv, id)
    })
  } else {
    sampleDivs.each(function (i, sampleDiv) {
      var list = $('#' + sampleDiv.id)
      var beatToggles = list.children()
      beatToggles[beatToggles.length - 1].remove()
    })
  }
  socket.emit('settings', getSettings())
})

function initAudio () {
  if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mediaDevices.getUserMedia || navigator.mozGetUserMedia
  }

  navigator.getUserMedia({'audio': true},
    gotStream,
    function (e) {
      window.alert('Error getting audio')
    })
}

function gotStream (stream) {
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  var audioContext = new window.AudioContext()
  var inputPoint = audioContext.createGain()

  var audioInput = audioContext.createMediaStreamSource(stream)
  audioInput.connect(inputPoint)

  var analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048
  inputPoint.connect(analyserNode)

  audioRecorder = new window.Recorder(inputPoint, {workerPath: '/js/app/session/recorder/recorder-worker.js'})
}

function toggleRecording (e) {
  if (e.classList.contains('recording')) {
    // stop recording
    audioRecorder.stop()
    e.classList.remove('recording')
    $('#btn-rec').text('R E C')
    audioRecorder.getBuffers(
      gotBuffers,
      function onGetBuffersError (error) {
        console.log('Something happened: ' + error)
      })
  } else {
    // start recording
    if (!audioRecorder) {
      return
    }
    e.classList.add('recording')
    $('#btn-rec').text('S T O P')
    audioRecorder.clear()
    audioRecorder.record()
  }
}

function gotBuffers (buffers) {
  audioRecorder.exportWAV(doneEncoding)
}

function doneEncoding (blob) {
  var name = uuid()
  socket.emit('sound', {id: sessionId, 'name': name, 'blob': blob})
  processBlob(blob, name)
}

function processBlob(blob, name) {
  samples[name] = {'blob': blob, active: true, beats: []}
  renderSample(samples[name], name)
  // Recorder.setupDownload(blob, 'myRecording.wav')
  sampleIndex++
  sampleCount++
  $.audioPlayerFactory.createPlayerFromBlob(blob, function (player) {
    samples[name].player = player
  })
}

function renderSample (sampleObj, name) {
  var sampleRow = document.createElement('tr')
  sampleRow.id = name

  var activeCheckbox = document.createElement('input')
  activeCheckbox.setAttribute('type', 'checkbox')
  activeCheckbox.id = name + '_toggle'
  $(activeCheckbox).prop('checked', true)
  activeCheckbox.addEventListener('click', toggleSample)

  var nameCell = document.createElement('th')
  nameCell.className = 'text-center'
  nameCell.innerHTML = 'sample' + sampleIndex + ' '
  $(nameCell).append(activeCheckbox)
  $(sampleRow).append(nameCell)

  for (var i = 0; i < $.playhead.getBeats(); i++) {
    addBeatToSample(sampleRow, name, i + 1)
  }

  sampleRow.className = 'sample'
  $('#samples').append(sampleRow)
}

function addBeatToSample (sampleRow, name, index) {
  var beatCell = document.createElement('td')
  beatCell.className = 'text-center'
  var beatCheckbox = document.createElement('input')
  beatCheckbox.setAttribute('type', 'checkbox')
  beatCheckbox.id = [name, 'beat', index, 'toggle'].join('_')
  beatCheckbox.className = 'beat-toggle'
  beatCheckbox.addEventListener('click', toggleBeat)
  $(beatCell).append(beatCheckbox)
  $(sampleRow).append(beatCell)
}

function processSettings (settings) {
  $.playhead.setBpm(settings.bpm)
  $.playhead.setBeats(settings.beats)
}

function toggleSample (event) {
  var toElement = event.toElement
  var splitId = toElement.id.split('_')
  var name = splitId[0]
  samples[name].active = $(toElement).is(':checked')
  socket.emit('settings', getSettings())
}

function toggleBeat (event) {
  var toElement = event.toElement
  var splitId = toElement.id.split('_')
  var beat = parseInt(splitId[2])
  var name = splitId[0]
  // var alreadyPresent = samples[name].beats.indexOf(beat) < 0
  if ($(toElement).is(':checked')) {
    samples[name].beats.push(beat)
    $.playhead.addBeatListener(beat, name, function () {
      if (samples[name].active) {
        samples[name].player.playOnce()
      }
    })
  } else {
    samples[name].beats.splice(samples[name].beats.indexOf(beat), 1)
    $.playhead.removeBeatListener(beat, name)
  }
  socket.emit('settings', getSettings())
}

function getSettings() {
  var settings = {
    'bpm': $.playhead.getBpm(),
    'beats': $.playhead.getBeats(),
    id: sessionId
  }

  settings.samples = []

  for (id in samples) {
    var sample = {
      name: id,
      beats: samples[id].beats,
      active: samples[id].active
    }
    settings.samples.push(sample)
  }

  return settings
}

function uploadSound (e) {
  var oauth_token = ''
  SC.connect().then(function () {
    oauth_token = arguments[0].oauth_token
    return SC.get('/me')
  }).then(function (me) {
    console.log('me', me)
    // console.log('oauth_token', oauth_token)
    SC.upload({
      asset_data: samples.blob,
      title: 'track' + Date.now(),
      sharing: 'public'
    }).then(function (track) {
      console.log('uploaded', track)
    }).catch(function () {
      console.log('err', arguments)
    })
    // document.getElementById('btn-upload').value = arguments[0].oauth_token
    // console.log('arguments0', arguments[0].oauth_token)
    // console.log('me', me)
    // console.log('me.id', me.id)
    // console.log('Hello, ' + me.username)
  })
}

window.addEventListener('load', initAudio)
