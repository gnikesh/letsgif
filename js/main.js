window.onload = function(){
	var pngImgArray = [];
	var WIDTH = 200;
	var HEIGHT = 200;
	var GIF_DELAY = 10; 
	var i = 0;
	var canvas = document.createElement('canvas');
	var canvasDiv = document.getElementById('canvas-div');
	canvas.setAttribute('height', 200);
	canvas.setAttribute('width', 200);
	canvasDiv.appendChild(canvas);
	var cxt = canvas.getContext('2d');

	startWebcam = function(){
		document.getElementsByClassName("web-cam-video")[0].style.display = 'block';
		document.getElementsByClassName("details-text")[0].style.width = '33%';
		document.getElementsByClassName("gif-image-wrapper")[0].style.display = 'block';
		document.getElementById("uload-or-webcam-option").style.display = 'none';
		var promise = navigator.mediaDevices.getUserMedia({video: {width: 240, ideal: 200, height:  240}}).then(function(mediaStream) {
			this.video = document.querySelector('video');
			this.video.srcObject = mediaStream;
			video.onloadmetadata = function(e){
				this.video.play();
			};
		}).catch(function(err){
			alert("ERROR! Cant Access Webcam");
		});

	}


	this.captureFrames = function() {
		var webcamStart = document.getElementById('webcam-start');
		webcamStart.innerHTML = "Recording";
		webcamStart.style.background = 'red';
		cxt.drawImage(this.video, 0, 0);
		pngImgArray.push(cxt.getImageData(0, 0, 200, 200));
		i++;
		if (i >= 30){
			clearInterval(loop);
			this.doRest();
		}		
	}

	this.takeVideo = function() {
		if (this.video){
			i = 0;
			pngImgArray = [];
			this.loop = setInterval(this.captureFrames, 100);
		} else {
			alert("ERROR! No Video");
		}
	}

	this.doRest = function(){
		var webcamStart = document.getElementById('webcam-start');
		webcamStart.innerHTML = "Start";
		webcamStart.style.background = ' #279ed9';
		setTimeout(this.doGifProcessing, 10);
	}

	this.doGifProcessing = function(){
		var pArray = new ProcessArray(pngImgArray);
		pArray.process();
	}

};