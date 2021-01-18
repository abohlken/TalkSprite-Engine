/*
The MIT License (MIT)
Copyright (c) 2014 Chris Wilson
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var imageElement = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;
var configValues = null;

window.onload = function() {
	configValues = config;
	
    // grab our canvas
	imageElement = document.getElementById( "sprite" );
	imageElement.src = configValues.nonSpeakingFilePath;
	imageElement.classList.add("avatar");
	imageElement.width = configValues.imageWidth;
	imageElement.height = configValues.imageHeight;
	
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext();

	// ask for an audio input
	navigator.mediaDevices.getUserMedia(
	{
		"audio": {
			"mandatory": {
				"googEchoCancellation": "false",
				"googAutoGainControl": "false",
				"googNoiseSuppression": "false",
				"googHighpassFilter": "false"
			},
			"optional": []
		},
	}).then(gotStream, didntGetStream).catch( function (e) { alert('getUserMedia threw exception :' + e) });

}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
}

function drawLoop( time ) {
	if(meter.volume > configValues.gateLevel)
	{
		imageElement.src = configValues.speakingFilePath;
		imageElement.classList.add("speaking");
	}
	else
	{
		imageElement.src = configValues.nonSpeakingFilePath;
		imageElement.classList.remove("speaking");
	}

    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );
}