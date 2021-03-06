function ProcessArray (data) {
	var imgRawArray = data; // PNG complete Information array
	var IMAGE_NUMBER = imgRawArray.length;
	var imgRGBA_Array = []; // PNG image data with Alpha channel
	var imgRGBArray = []; // Image Data with only RGB components
	var palette = []; // Global Color Table
	var buf = []; // GIF Buffer
	var mappedIndex = []; // Index of mapped pixels
	var GIF_WIDTH = 200; // width of output gif image
	var GIF_HEIGHT = 150; // height of output gif image

	removeAlphaChannel = function () {
		for (var i = 0; i < imgRawArray.length; i++) {
			imgRGBA_Array.push(imgRawArray[i].data);
		}

		for (var i = 0; i < imgRGBA_Array.length; i++) {
			var temp = [];
			for (var j = 0; j < imgRGBA_Array[i].length - 3; j += 4) {
				temp.push(imgRGBA_Array[i][j], imgRGBA_Array[i][j + 1], imgRGBA_Array[i][j + 2]);
			}
			imgRGBArray.push(temp);
		}
	}

	quantizeRGB = function () {
		var rgbArray = imgRGBArray[0];
		this.neuQuant = new NeuQuant();
		this.neuQuant.NeuQuantConstructor(rgbArray, GIF_WIDTH * GIF_HEIGHT * 3, 10);
		palette = this.neuQuant.process();
	}


	mapping = function (array) {
		var mappedArray = new Array();
		
		for (var i = 0, j = 0; i < array.length - 2; i += 3, j++) {
			mappedArray[j] = neuQuant.map(array[i], array[i + 1], array[i + 2]);
		}

		return mappedArray;
	}

	createGif = function () {
		var newGif = new GifWriter(buf, GIF_WIDTH, GIF_HEIGHT, {loop: 0});
		newGif.addFrame(0, 0, GIF_WIDTH, GIF_HEIGHT, mapping(imgRGBArray[0]), {palette: rgbArrayToHex(palette)});
		for (var i = 1; i < IMAGE_NUMBER; i++) {
			newGif.addFrame(0, 0, GIF_WIDTH, GIF_HEIGHT, mapping(imgRGBArray[i]), {palette: rgbArrayToHex(palette), delay : 10});
		}
		
		return buf.slice(0, newGif.end());
	}
	
	rgbArrayToHex = function (array) {
		var hexArray = [];

		for (var i = 0; i < array.length - 2; i += 3) {
			r = array[i].toString(16);
			g = array[i + 1].toString(16);
			b = array[i + 2].toString(16);
			r = r.length < 2 ? '0' + r : r;
			g = g.length < 2 ? '0' + g : g;
			b = b.length < 2 ? '0' + b : b;
			hexArray.push(parseInt(r + b + g, 16));
		}

		return hexArray
	}

	Uint8ToString = function (u8a) {
	  var CHUNK_SZ = 0x8000;
	  var c = [];
	  for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
	    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
	  }
	  return c.join('');
	}

	this.process = function () {
		removeAlphaChannel();
		quantizeRGB();
		this.gif = createGif();
	}

	this.getBase64DataURL = function () {
		var uint8array = new Uint8Array(this.gif);
		return 'data:image/png;base64, ' + btoa(Uint8ToString(uint8array));
	}
}