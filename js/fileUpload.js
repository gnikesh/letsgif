function VideoFile(file) {
	var videoFile = file;
	var FRAME_RATE = 10;
	var pngArray = [];
	var i = 0;
	var pleaseWait = document.getElementsByClassName("please-wait-wrapper")[0];
	pleaseWait.style.top = "60%";
	pleaseWait.innerHTML = "Please Wait while we prepare your gif..."
	pleaseWait.style.display = "block";

	var cWrapper = document.getElementsByClassName("upload-video-wrapper")[0];
	var c = document.createElement('canvas');
	c.setAttribute('height', 150);
	c.setAttribute('width', 200);
	cWrapper.appendChild(c);
	var cxt = c.getContext('2d');
	videoFile.play();
	cxt.drawImage(videoFile, 0, 0);

	captureFrames = function(){
		cxt.drawImage(videoFile, 0, 0);
		var img = cxt.getImageData(0, 0, 200, 150);
		pngArray.push(img);
		if (i >= videoFile.duration * 10) {
			clearInterval(loop);
			doRest();
		}
		i++;
	}
	onloadedmetadata = function() {
		this.iii = 0;
		videoFile.addEventListener("loadeddata", function(e){
			console.log(videoFile.width + " x " + videoFile.height);
		}, false);

	}
		
	var metaloop = setInterval(onloadedmetadata, 100);

	doRest = function(){
		var processArray = new ProcessArray(pngArray);
		processArray.process();
		var gif = processArray.getBase64DataURL();
		document.getElementsByClassName("please-wait-wrapper")[0].style.display = "none";
		document.getElementById('gif-image').src = gif;
	}	

	var loop = setInterval(captureFrames, 1000 / FRAME_RATE);
}