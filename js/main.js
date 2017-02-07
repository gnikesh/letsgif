window.onload = function () {
	var pngImgArray = [];
	var GIF_DELAY = 10; 
	var FRAME_NUMBER = 30;
	var FRAME_RATE = 10;
	var GIF_WIDTH = 200,
		GIF_HEIGHT = 150;
	var WEBCAM_WIDTH = 0,
		WEBCAM_HEIGHT = 0;
	var i = 0;
	var canvas = document.getElementById('img-canvas');
	var cxt = canvas.getContext('2d');
	var video = document.querySelector('video');
	var fileSelect = document.getElementById('upload-text');
	var fileBox = document.getElementById('upload-video');
	var videoFileURL;

	fileSelect.addEventListener('click', function (e) {
		fileBox.click();
	}, false);

	startWebcam = function () {
		document.getElementsByClassName('web-cam-video')[0].style.display = 'block';
		document.getElementsByClassName('details-text')[0].style.width = '33%';
		document.getElementsByClassName('gif-image-wrapper')[0].style.display = 'block';
		document.getElementById('uload-or-webcam-option').style.display = 'none';

		var promise = navigator.mediaDevices.getUserMedia({video: true}).then(function (mediaStream) {
			video = document.querySelector('video');
			video.srcObject = mediaStream;

			video.addEventListener('loadeddata', function () {
				WEBCAM_WIDTH = video.videoWidth;
				WEBCAM_HEIGHT = video.videoHeight;
				console.log('Height' + video.videoWidth + 'HEIGHT: ' + video.videoHeight);
			}, false);
				
		}).catch(function (err) {
			alert('ERROR! Cant Access Webcam');
		});
	}

	this.captureFrames = function () {
		var webcamStart = document.getElementById('webcam-start');
		webcamStart.innerHTML = 'Recording';
		webcamStart.style.background = 'red';

		cxt.scale(GIF_WIDTH / WEBCAM_WIDTH, GIF_HEIGHT / WEBCAM_HEIGHT);
		cxt.drawImage(video, 0, 0);
		cxt.scale(WEBCAM_WIDTH / GIF_WIDTH, WEBCAM_HEIGHT / GIF_HEIGHT);
		pngImgArray.push(cxt.getImageData(0, 0, GIF_WIDTH, GIF_HEIGHT));
		i++;
		if (i >= FRAME_NUMBER) {
			clearInterval(loop);
			this.doRest();
		}		
	}

	this.takeVideo = function () {
		if (video) {
			i = 0;
			pngImgArray = [];
			this.loop = setInterval(this.captureFrames, Math.floor(1000 / FRAME_RATE));
		} else {
			alert('ERROR! No Video');
		}
	}

	this.doRest = function () {
		var webcamStart = document.getElementById('webcam-start');
		webcamStart.innerHTML = 'Create Again';
		webcamStart.style.background = ' #279ed9';
		document.getElementsByClassName('please-wait-wrapper')[0].style.display = 'block';
		setTimeout(this.doGifProcessing, 10);
	}

	this.doGifProcessing = function () {
		var pArray = new ProcessArray(pngImgArray);
		pArray.process();
		var base64 = pArray.getBase64DataURL()
		document.getElementsByClassName('please-wait-wrapper')[0].style.display = 'none';
		document.getElementById('gif-image').setAttribute('src', base64);
	}

	handleFileUpload = function (files) {
		var fileSizeInMB = files[0].size / (1024 * 1024);
		this.fileDuration = 0;
		window.URL = window.URL || window.webkitURL;
		videoFileURL = window.URL.createObjectURL(files[0]);
		var videoFile = document.getElementById('show-video');
		videoFile.src = videoFileURL;
		
		if (Math.floor(fileSizeInMB) > 100) {
			alert('File larger than 100 MB. Please Upload smaller size file.');
			location.reload(true);
		} else if (files[0].type != 'video/mp4' && files[0].type != 'video/webm') {
			alert('Invalid File Format! Please upload valid Video File...');
			location.reload(true);
		} else {
			videoFile.ondurationchange = function () {
				if (Math.floor(this.duration) > 12){
					alert('FILE DURATION LONGER THAN 12 seconds');
						location.reload(true);
				} else {
					document.getElementsByClassName('details-text')[0].style.width = '33%';
					document.getElementsByClassName('gif-image-wrapper')[0].style.display = 'block';
					document.getElementById('uload-or-webcam-option').style.display = 'none';
					document.getElementById('refresh-page-button').style.display = 'block';
					document.getElementsByClassName('web-cam-video')[0].style.display = 'block';
					document.getElementById('video-text').innerHTML = 'Your Video';
					document.getElementById('webcam-start').style.display = 'none';
					document.getElementById('hint-text').style.display = 'none';
					var vd = new VideoFile(videoFile);

				}
			}	
		}
	}

	refreshPage = function () {
		location.reload();
	}
};