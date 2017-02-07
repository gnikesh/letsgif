# letsgif
A video to gif converter.

### Usage
*Converts mp4/webm videos to animated gif image. You also can create gif image by capturing video from webcam.*

## How it works?
 * Uses webRTC `navigator.mediaDevices.getUserMedia()` to access Webcam 
 * Uses HTML5 `video` Element to stream video URL
 * Uses HTML5 `canvas` Element to create images from the Video Element
 * Uses `Typed Arrays` to handle the binary image data
 * Uses `base 64` encoding to create a string of the created gif image URL
 

## Browsers Tested On
  * Firefox 51.0.1 (64 bit)
  * Chrome 56.0.2924.87 (64-bit)
  
## Used
1. [NeuQuant](http://members.ozemail.com.au/~dekker/NEUQUANT.HTML)
  * NeuQuant Neural-Net Quantization Algorithm to convert 24-bit png images to 8 bit gif palette. Original java version by Kevin Weiner, then to ActionScript3 by Thibault Imbert, to Javascript by Thibault Imbert and finally JS clean up by [sole](http://soledadpenades.com)
  * Copyright (c) 1994 Anthony Dekker.

2. [omggif](https://github.com/deanm/omggif) by Dean McNamee
  * JavaScript implementation of a GIF 89a encoder and decoder.
  * (c) Dean McNamee 2013.
