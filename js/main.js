window.onload = function() {
	var pngImgArray = [];
	var GIF_DELAY = 10; 
	var FRAME_NUMBER = 30;
	var FRAME_RATE = 10;
	var i = 0;
	var canvas = document.getElementById("img-canvas");
	var cxt = canvas.getContext("2d");
	var video = document.querySelector("video");
	var fileSelect = document.getElementById("upload-text");
	var fileBox = document.getElementById("upload-video");
	var videoFileURL;

	fileSelect.addEventListener("click", function(e) {
		fileBox.click();
	}, false);

	startWebcam = function() {
		document.getElementsByClassName("web-cam-video")[0].style.display = 'block';
		document.getElementsByClassName("details-text")[0].style.width = '33%';
		document.getElementsByClassName("gif-image-wrapper")[0].style.display = 'block';
		document.getElementById("uload-or-webcam-option").style.display = 'none';

		var promise = navigator.mediaDevices.getUserMedia({video: {width: 320, height: 200}}).then(function(mediaStream) {
			video = document.querySelector('video');
			video.srcObject = mediaStream;
			video.onloadmetadata = function(e) {
				video.play();
			};
		}).catch(function(err) {
			alert("ERROR! Cant Access Webcam");
		});
	}

	this.captureFrames = function() {
		var webcamStart = document.getElementById('webcam-start');
		webcamStart.innerHTML = "Recording";
		webcamStart.style.background = 'red';
		cxt.drawImage(video, 20, 0, 300, 300, 0, 0, 200, 200);
		pngImgArray.push(cxt.getImageData(0, 0, 200, 150));
		i++;
		if (i >= FRAME_NUMBER) {
			clearInterval(loop);
			this.doRest();
		}		
	}

	this.takeVideo = function() {
		if (video) {
			i = 0;
			pngImgArray = [];
			this.loop = setInterval(this.captureFrames, Math.floor(1000 / FRAME_RATE));
		} else {
			alert("ERROR! No Video");
		}
	}

	this.doRest = function() {
		var webcamStart = document.getElementById('webcam-start');
		webcamStart.innerHTML = "Create Again";
		webcamStart.style.background = ' #279ed9';
		document.getElementsByClassName("please-wait-wrapper")[0].style.display = "block";
		setTimeout(this.doGifProcessing, 10);
	}

	this.doGifProcessing = function() {
		var pArray = new ProcessArray(pngImgArray);
		pArray.process();
		var base64 = pArray.getBase64DataURL()
		document.getElementsByClassName("please-wait-wrapper")[0].style.display = "none";
		document.getElementById('gif-image').setAttribute('src', base64);
	}

	handleFileUpload = function(files) {
		var fileSizeInMB = files[0].size / (1024 * 1024);
		this.fileDuration = 0;
		window.URL = window.URL || window.webkitURL;
		videoFileURL = window.URL.createObjectURL(files[0]);
		var videoFile = document.getElementById("uploaded-video")
		videoFile.src = videoFileURL;
		
		if (Math.floor(fileSizeInMB) > 100) {
			alert("File larger than 100 MB. Please Upload smaller size file.");
			location.reload(true);
		} else if (files[0].type != 'video/mp4' && files[0].type != 'video/webm') {
			alert("Invalid File Format! Please upload valid Video File...");
			location.reload(true);
		} else {
			videoFile.ondurationchange = function() {
				if (Math.floor(this.duration) > 12){
					alert("FILE DURATION LONGER THAN 12 seconds");
						location.reload(true);
				} else {
					document.getElementsByClassName("details-text")[0].style.width = '33%';
					document.getElementsByClassName("gif-image-wrapper")[0].style.display = 'block';
					document.getElementById("uload-or-webcam-option").style.display = 'none';
					document.getElementById("refresh-page-button").style.display = 'block';
					var vd = new VideoFile(videoFile);

				}
			}	
		}
	}

	refreshPage = function(){
		location.reload();
	}
};