const WEBCAM_LABEL_KEY = 'webcamLabel';

let videoDeviceList;
let activeDeviceIndex = 0;
let webcam;

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
  }
  
  push();
  {
    translate(width, 0);
    scale(-1, 1);

    const canvasAR = width/height;
    const webcamAR = webcam.width/webcam.height;
  
    imageMode(CENTER);
    if (canvasAR > webcamAR) {
      image(webcam, width/2, height/2, width, width / webcamAR);
    } else {
      image(webcam, width/2, height/2, height * webcamAR, height);
    }
  }
  pop();
}