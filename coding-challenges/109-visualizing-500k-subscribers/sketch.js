const mapOptions = {
  lat: 0,
  lng: 0,
  zoom: 3,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
}

let subscriberData;
let countryData;

const mappa = new Mappa('Leaflet');
let map;
let canvas;

function preload() {
  subscriberData = loadTable('assets/subscribers_geo.csv', 'csv', 'header');
  countryData = loadJSON('assets/countries.json');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  map.overlay(canvas);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  
  map = mappa.tileMap(mapOptions);
  map.overlay(canvas);
}

function draw() {
  clear();
  
  colorMode(HSB);
  noStroke();
  for (let row of subscriberData.rows) {
    const countryCode = row.get('country_id').toLowerCase();
    const coords = countryData[countryCode];
    if (coords !== undefined) {
      fill(abs(coords[0]*381.1746 + coords[1]*684.138) % 360, 60, 90, 0.5);
      const subscribers = Number(row.get('subscribers'));
      const screenCoord = map.latLngToPixel(coords[0], coords[1]);
      circle(screenCoord.x, screenCoord.y, sqrt(subscribers)*0.05*pow(2, map.zoom()));
    }
  }
}