const WEBCAM_LABEL_KEY = 'webcamLabel';

const DENSITY_MAP =
  // 'WÑ$#@?!abc;:+=-,._ ';
  // 'Ñ@#W$9876543210?!abc;:+=,-._ ';
  // '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
  '@%#*+=:-. ';

const PIXEL_SIZE = 16 * 0.55; // 'Hack' font aspect ratio

let canvas;
let outputDiv;

let videoDeviceList;
let activeDeviceIndex = 0;
let webcam;

let img; // ASCII-fied image

function preload() {
  // Start a video capture to request permissions if necessary
  const tempCam = createCapture(VIDEO, () => {
    // Delete the first video object and get the list of video devices once we have permissions
    tempCam.remove();
    getVideoDeviceList();
  });
  tempCam.hide();
}

function getVideoDeviceList() {
  navigator.mediaDevices.enumerateDevices().then(devices => {
    videoDeviceList = devices.filter(device => device.kind === "videoinput" && device.deviceId.length > 0);
    
    if (videoDeviceList.length > 1) {
      const lastWebcamLabel = getItem(WEBCAM_LABEL_KEY);
      if (lastWebcamLabel !== null) {
        activeDeviceIndex = max(0, videoDeviceList.findIndex(device => device.label === lastWebcamLabel));
      }
    
      const deviceSelect = createSelect().style('position: absolute; left: 2rem; bottom: 1rem; z-index: 999;');
      videoDeviceList.forEach(device => deviceSelect.option(device.label));
      deviceSelect.selected(videoDeviceList[activeDeviceIndex].label);
      deviceSelect.changed(() => {
        activeDeviceIndex = videoDeviceList.map(device => device.label).indexOf(deviceSelect.value());
        setupWebcam();
      });

    }
    
    setupWebcam();
  });
}

function setupWebcam() {
  if (webcam !== undefined) {
    webcam.remove();
    webcam = undefined;
  }
  
  if (videoDeviceList.length === 0) {
    return;
  }
  
  activeDeviceIndex = constrain(activeDeviceIndex, 0, videoDeviceList.length-1);
  const videoDevice = videoDeviceList[activeDeviceIndex];
  storeItem(WEBCAM_LABEL_KEY, videoDevice.label);
  webcam = createCapture({ video: { deviceId: { exact: videoDevice.deviceId } } });
  webcam.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetImg();
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();
  
  outputDiv = createDiv();
  
  resetImg();
}

function resetImg() {
  if (img !== undefined) {
    img.remove();
  }
  
  img = createGraphics(round(windowWidth/PIXEL_SIZE)-1, round(windowHeight/PIXEL_SIZE)-1);
}

function draw() {
  background(42);
  
  if (webcam === undefined) {
    textSize(height/24);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    noStroke();
    fill(200);
    if (videoDeviceList === undefined) {
      text('Loading...', width/2, height/2);
    } else {
      text('No cameras found', width/2, height/2);
    }
    return;
  } else if (canvas !== undefined) {
    canvas.remove();
    canvas = undefined;
  }
  
  // Copy center of webcam feed to target image
  img.push();
  {
    const w = img.width;
    const h = img.height;
    const canvasAR = windowWidth/windowHeight;
    const webcamAR = webcam.width/webcam.height;
  
    img.translate(w, 0);
    img.scale(-1, 1);

    img.imageMode(CENTER);
    if (canvasAR > webcamAR) {
      img.image(webcam, w/2, h/2, w, w / webcamAR);
    } else {
      img.image(webcam, w/2, h/2, h * webcamAR, h);
    }
  }
  img.pop();
  
  // Convert image to ASCII
  let output = '';
 
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    const x = (i/4) % img.width;
    const y = floor((i/4) / img.width);
    
    const lum = rgbToLuminance(...img.pixels.slice(i, i+3));
    const char = DENSITY_MAP[floor((1-lum) * DENSITY_MAP.length)];
    
    output += char || ' ';
    
    if (x === img.width-1) output += '\n';
  }
  
  outputDiv.html(output);
}

function rgbToLuminance(r, g, b) {
  return r/255*0.30 + g/255*0.59 + b/255*0.11;
}