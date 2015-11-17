(function (e) {
  function AudioPlayerFactory () {
    this.context = getAudioContext()
  }

  e.audioPlayerFactory = new AudioPlayerFactory()

  function getAudioContext () {
    var context
    try {
      if (typeof webkitAudioContext === 'function') {
        context = new webkitAudioContext ()
      } else { // other browsers that support AudioContext
        context = new AudioContext()
      }
    } catch (e) {
      // Web Audio API is not supported in this browser
      alert('Web Audio API is not supported in this browser')
    }
    return context
  }

  function Player (buffer, audioPlayerFactory) {
    this.buffer = buffer
    this.audioPlayerFactory = audioPlayerFactory
    this.visualizer = $.sketch.createVisualizer()
  }

  Player.prototype.playOnce = function () {
    var source = this.audioPlayerFactory.context.createBufferSource()
    source.buffer = this.buffer

    source.connect(this.audioPlayerFactory.context.destination)

    var processor = createAnalyzer(source, this.audioPlayerFactory, this.visualizer)

    var player = this
    source.onended = function() {
      processor.onaudioprocess = null
      processor.disconnect()
      player.visualizer.flush()
    }

    source.start(0)
  }

  AudioPlayerFactory.prototype.createPlayerFromBlob = function (blob, callback) {
    var fileReader = new FileReader()
    var audioPlayerFactory = this
    fileReader.onload = function (e) {
      createFromArrayBuffer(this.result, audioPlayerFactory, callback)
    }
    fileReader.readAsArrayBuffer(blob)
  }

  function createFromArrayBuffer (arrayBuffer, audioPlayerFactory, callback) {
    audioPlayerFactory.context.decodeAudioData(arrayBuffer, function (buffer) {
      if(!buffer) {
        alert('Error decoding blob')
        return
      }

      callback(new Player(buffer, audioPlayerFactory))
    },

    function (error) {
      alert(error)
    })
  }

  function createAnalyzer (audioSource, audioPlayerFactory, visualizer) {
    var analyzer = audioPlayerFactory.context.createAnalyser()
    analyzer.fftSize = 512

    var processor = audioPlayerFactory.context.createScriptProcessor(2048)
    processor.buffer = audioSource.buffer
    processor.connect(audioPlayerFactory.context.destination)

    audioSource.connect(analyzer)
    analyzer.connect(processor)

    processor.onaudioprocess = function (e) {
      var array = new Uint8Array(analyzer.frequencyBinCount)
      analyzer.getByteFrequencyData(array)
      visualizer.spectrumData = array

      array = new Uint8Array(analyzer.fftSize)
      analyzer.getByteTimeDomainData(array)
      visualizer.waveformData = array
    }

    return processor
  }
})(jQuery, document, window)
