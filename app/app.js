if (Meteor.isClient) {
  window.URL = window.URL || window.webkitURL;

  Template.body.helpers({
    checkInputAudioFile: function(){
      return Session.get('inputAudioFile');
    }
  });

  Template.audioPlayer.helpers({
    inputAudioFile: function(){
      return Session.get('inputAudioFile');
    }
  });

  Template.audioPlayer.rendered = function(){
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var audioEl = this.find('audio');
    var canvas = this.find('canvas');
    var source = audioCtx.createMediaElementSource(audioEl);
    var analyser = audioCtx.createAnalyser();
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var canvasCtx = canvas.getContext("2d");

    source.connect(analyser);
    analyser.connect(audioCtx.destination)
    analyser.getByteTimeDomainData(dataArray);



    canvas.setAttribute('width',"500px");

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    function draw() {

          drawVisual = requestAnimationFrame(draw);

          analyser.getByteTimeDomainData(dataArray);

          canvasCtx.fillStyle = 'rgb(200, 200, 200)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

          canvasCtx.beginPath();

          var sliceWidth = WIDTH * 1.0 / bufferLength;
          var x = 0;

          for(var i = 0; i < bufferLength; i++) {
       
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          canvasCtx.lineTo(canvas.width, canvas.height/2);
          canvasCtx.stroke();
        };

    draw();
  };


  Template.insertFile.events({
    "change .new-file": function(e){
      if (e.target.files.length){
        var file = e.target.files.item(0);

        Session.set('inputAudioFile', {
          file: file,
          url: window.URL.createObjectURL(file)
        });
      }
    }
  }); 
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
