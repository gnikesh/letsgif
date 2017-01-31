window.onload = function(){
	var pngImgArray = [];
	var i = 0;
	var canvas = document.createElement('canvas');
	var canvasDiv = document.getElementById('canvas-div');
	canvas.setAttribute('height', 340);
	canvas.setAttribute('width', 340);
	canvasDiv.appendChild(canvas);
	var cxt = canvas.getContext('2d');

	var trailCanvas = document.getElementById('trail-canvas');
	var trailCxt = trailCanvas.getContext('2d');


	var promise = navigator.mediaDevices.getUserMedia({video: {width: 400, height:  400}}).then(function(mediaStream) {
		this.video = document.querySelector('video');
		this.video.srcObject = mediaStream;
		video.onloadmetadata = function(e){
			this.video.play();
		};
	}).catch(function(err){
		alert("ERROR");
	});

	this.captureFrames = function(){
		cxt.drawImage(this.video, 0, 0);
		pngImgArray.push(cxt.getImageData(20, 20, 300, 300));
		i++;
		
		if (i >= 10){
			clearInterval(loop);
		}
		console.log(pngImgArray[0]);
	}

	this.takeVideo = function(){
		if (this.video){
			this.loop = setInterval(this.captureFrames, 500);
		} else {
			console.log("ERROR! No Video");
		}
		
	}

}