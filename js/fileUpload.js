function VideoFile (file) {
	var videoFile = file;
	var loopVideo;
	var FRAME_RATE = 10;
	var pngArray = [];
	var i = 0;
	var VIDEO_WIDTH,
		VIDEO_HEIGHT;
	var GIF_WIDTH = 200,
		GIF_HEIGHT = 150;
	var pleaseWait = document.getElementsByClassName('please-wait-wrapper')[0];


	var c = document.createElement('canvas');
	c.setAttribute('height', 150);
	c.setAttribute('width', 200);
	var cxt = c.getContext('2d');
	videoFile.play();

	captureFrames = function () {
		cxt.scale(GIF_WIDTH / VIDEO_WIDTH, GIF_HEIGHT / VIDEO_HEIGHT);
		cxt.drawImage(videoFile, 0, 0);
		var img = cxt.getImageData(0, 0, 200, 150);
		cxt.scale(VIDEO_WIDTH / GIF_WIDTH, VIDEO_HEIGHT / GIF_HEIGHT);
		pngArray.push(img);
		if (i >= Math.floor(videoFile.duration) * 10) {
			clearInterval(loopVideo);
			pleaseWait.style.top = '77%';
			pleaseWait.innerHTML = 'Please Wait while we prepare your gif...'
			pleaseWait.style.display = 'block';
			doRest();
		}
		i++;
	}
	
	videoFile.addEventListener('loadeddata', function () {
		VIDEO_WIDTH = videoFile.videoWidth;
		VIDEO_HEIGHT = videoFile.videoHeight;
		loopVideo = setInterval(captureFrames, 1000 / FRAME_RATE);
	}, false);
		
	doRest = function () {
		var processArray = new ProcessArray(pngArray);
		processArray.process();
		var gif = processArray.getBase64DataURL();
		pleaseWait.style.display = 'none';
		console.log("DONE");
		document.getElementById('gif-image').src = gif;
	}	
}