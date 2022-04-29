import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import {Map, View} from 'ol';
import {Stamen, Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';

const source = new VectorSource();

const client = new XMLHttpRequest();

// Opening and reading of the wombats.csv , which ideally needs to be changed to a .txt
client.open('GET', './data/wombats.csv');
client.onload = function () {
  const csv = client.responseText;
  const features = [];

  let prevIndex = csv.indexOf('\n') + 1; // scan past the header line

  let curIndex;
  while ((curIndex = csv.indexOf('\n', prevIndex)) != -1) {
    const line = csv.substr(prevIndex, curIndex - prevIndex).split(',');
    prevIndex = curIndex + 1;

    const coords = fromLonLat([parseFloat(line[4]), parseFloat(line[3])]);
    if (isNaN(coords[0]) || isNaN(coords[1])) {
      // guard against bad data
      continue;
    }

    features.push(
      new Feature({
        mass: parseFloat(line[1]) || 0,
        year: parseInt(line[2]) || 0,
        geometry: new Point(coords),
      })
    );
  }
  source.addFeatures(features);
};
client.send();

// the Layer that has the WOMBATs appear on the map.
const wombats = new VectorLayer({
  source: source,
});

//JavaScrip that puts a OpenLayers Map into the mapContainer div in index.html
new Map({
  target: 'mapContainer',
  layers: [
    new TileLayer({
      source: new Stamen({
        layer: 'toner',
      }),
    }),
    wombats,
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});