const WEBCAM_LABEL_KEY = 'webcamLabel';

const WIPE_TIME = 4;

let videoDeviceList;
let activeDeviceIndex = 0;
let webcam;

let isWiping = false;
let wipeImage;
let wipeCopy;
let wipeDir;
let t = 0;

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
}

function setup() {
  createCanvas(windowWidth, windowHeight).style('position: relative;');
  pixelDensity(1);
  
  const root = createDiv().style('position: absolute; left: 0; right: 0; bottom: 1rem; display: flex; justify-content: center; gap: 0.5rem;');
  createButton('🡨').parent(root).mousePressed(() => startWipe('left'));
  createButton('🡪').parent(root).mousePressed(() => startWipe('right'));
  createButton('🡩').parent(root).mousePressed(() => startWipe('up'));
  createButton('🡫').parent(root).mousePressed(() => startWipe('down'));
}

function draw() {
  if (isWiping) {
    t = constrain(t + deltaTime/1000 / WIPE_TIME, 0, 1);
    wipe();
  }
  
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
  }  
  
  const canvasAR = width/height;
  const webcamAR = webcam.width/webcam.height;
  
  push();
  {
    translate(width, 0);
    scale(-1, 1);

    imageMode(CENTER);
    if (canvasAR > webcamAR) {
      image(webcam, width/2, height/2, width, width / webcamAR);
    } else {
      image(webcam, width/2, height/2, height * webcamAR, height);
    }
  
    if (wipeImage !== undefined) {
      image(wipeImage, width/2, height/2, width, height);
      
      if (isWiping) {
        strokeWeight(4);
        stroke(255, 255, 200);
        switch (wipeDir) {
          case 'left': line(width*t, 0, width*t, height); break;
          case 'right': line(width*(1-t), 0, width*(1-t), height); break;
          case 'up': line(0, height*(1-t), width, height*(1-t)); break;
          case 'down': line(0, height*t, width, height*t); break;
        }
      }
    }
  }
  pop();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) startWipe('left');
  if (keyCode === RIGHT_ARROW) startWipe('right');
  if (keyCode === UP_ARROW) startWipe('up');
  if (keyCode === DOWN_ARROW) startWipe('down');
}

function startWipe(direction) {
  isWiping = true;
  wipeDir = direction;
  t = 0;  
  wipeImage = createGraphics(width, height);
  wipeCopy = createGraphics(width, height);
}

function wipe() {
  const canvasAR = width/height;
  const webcamAR = webcam.width/webcam.height;

  let x, y, w, h;
  if (canvasAR > webcamAR) {
    w = webcam.width;
    h = webcam.width / canvasAR;
    x = 0;
    y = (webcam.height - h) / 2;
  } else {
    w = webcam.height * canvasAR;
    h = webcam.height;
    x = (webcam.width - w) / 2;
    y = 0;
  }
  
  // Save what the wipe image has so far
  wipeCopy.clear();
  wipeCopy.image(wipeImage, 0, 0);
  
  // Copy the appropriate webcam area
  switch (wipeDir) {
    case 'right':
      wipeImage.image(webcam, width*(1-t), 0, width*t, height, x + w*(1-t), y, w*t, h);
      break;
    case 'left':
      wipeImage.image(webcam, 0, 0, width*t, height, x, y, w*t, h);
      break;
    case 'up':
      wipeImage.image(webcam, 0, height*(1-t), width, height*t, x, y + h*(1-t), w, h*t);
      break;
    case 'down':
      wipeImage.image(webcam, 0, 0, width, height*t, x, y, w, h*t);
      break;
  }
  
  // Restore the previous part of the image
  wipeImage.image(wipeCopy, 0, 0);
  
  if (t === 1) {
    isWiping = false;
  }
}
