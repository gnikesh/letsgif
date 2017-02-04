function ProcessArray(data) {
	var imgRawArray = data; // PNG complete Information array
	var IMAGE_NUMBER = imgRawArray.length;
	var imgRGBA_Array = []; // PNG image data with Alpha channel
	var imgRGBArray = []; // Image Data with only RGB components
	var palette = []; // Global Color Table
	var buf = []; // GIF Buffer
	var mappedIndex = []; // Index of mapped pixels

	removeAlphaChannel = function() {
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

	quantizeRGB = function() {
		var rgbArray = imgRGBArray[0];
		this.neuQuant = new NeuQuant();
		this.neuQuant.NeuQuantConstructor(rgbArray, 200 * 200 * 3, 10);
		palette = this.neuQuant.process();
	}


	mapping = function(array) {
		var mappedArray = new Array(256);
		for (var i = 0, j = 0; i < array.length - 2; i += 3, j++) {
			mappedArray[j] = neuQuant.map(array[i], array[i + 1], array[i + 2]);
		}

		return mappedArray;
	}

	createGif = function() {
		console.log(imgRGBArray[0]);
		var newGif = new GifWriter(buf, 200, 200, {loop: 0});
		newGif.addFrame(0, 0, 200, 200, mapping(imgRGBArray[0]), {palette: rgbArrayToHex(palette)});
		for (var i = 1; i < IMAGE_NUMBER; i++) {
			newGif.addFrame(0, 0, 200, 200, mapping(imgRGBArray[i]), {palette: rgbArrayToHex(palette), delay : 10});
		}
		
		return buf.slice(0, newGif.end());
	}
	
	rgbArrayToHex = function(array){
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

	rgbToHexString = function(array) {
		var hexString = '';
		for (var i = 0; i < array.length; i ++) {
			var _hex =  array[i].toString(16);
			_hex = _hex.length < 2 ? '0' + _hex : _hex;
			hexString += _hex;
		}

		return hexString;
	}

	this.process = function() {
		removeAlphaChannel();
		quantizeRGB();
		var gif = createGif();
		var uint8array = new Uint8Array(gif);

		function Uint8ToString(u8a) {
		  var CHUNK_SZ = 0x8000;
		  var c = [];
		  for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
		    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
		  }
		  return c.join("");
		}

		var base64 = "data:image/png;base64, " + btoa(Uint8ToString(uint8array));
		document.getElementById('gif-image').setAttribute('src', base64);
	}
}