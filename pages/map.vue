<template>
  <div>
    <div id='map'></div>
    <nav id="filter-group" class="filter-group"></nav>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css';
  import Data from '@/data/data.json'
  export default {
    data() {
      return {
        access_token: process.env.TOKEN,
        map: {}
      }
    },
    mounted() {
      var filterGroup = document.getElementById('filter-group');
      this.createMap()
      this.map.on('load', () => {
        this.map.addSource('places', {
          'type': 'geojson',
          'data': Data
        });
        Data.features.forEach((feature) => {
          var symbol = feature.properties['icon'];
          var munic = feature.properties['munic'];
          var layerID = 'poi-' + munic;
          // Add a layer for this symbol type if it hasn't been added already.
          if (!this.map.getLayer(layerID)) {
            this.map.addLayer({
              'id': layerID,
              'type': 'symbol',
              'source': 'places',
              'layout': {
                'icon-image': symbol + '-15',
                'icon-allow-overlap': true
              },
              'filter': ['==', 'munic', munic]
            });
            this.map.on('click', layerID, function (e) {
              var coordinates = e.features[0].geometry.coordinates.slice();
              var name = e.features[0].properties.name;
              var address = e.features[0].properties.address;
              var html = '<p>' + name + '<br>' + address + '</p>'
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }
              new mapboxgl.Popup().setLngLat(coordinates).setHTML(html).addTo(this);
            });
            this.map.on('mouseenter', layerID, () => {
              this.map.getCanvas().style.cursor = 'pointer';
            });
            this.map.on('mouseleave', 'places', () => {
              this.map.getCanvas().style.cursor = '';
            });
            // Add checkbox and label elements for the layer.
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);
            var label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = munic;
            filterGroup.appendChild(label);
            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', (e) => {
              this.map.setLayoutProperty(
                layerID,
                'visibility',
                e.target.checked ? 'visible' : 'none'
              );
            });
          }
        });
        // Add a layer showing the places.
        /*
        this.map.addLayer({
          'id': 'places',
          'type': 'symbol',
          'source': 'places',
          'layout': {
            'icon-image': '{icon}-15',
            'icon-allow-overlap': true
          }
        });
        */
      });
    },
    methods: {
      createMap() {
        mapboxgl.accessToken = this.access_token
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/code4osaka/ckm3bbsyd0dqp17tgsq4mpbb1',
          zoom: 11,
          center: [135.5193174, 34.6862456]
        })
        var nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, "top-left");
      },
      setLayer() {
      }
    }
  }
</script>
<style>
  body { margin: 0; padding: 0; }
	#map { position: absolute; top: 0; bottom: 0; width: 100%; }
  .filter-group {
    font: 12px/20px 'MS PGothic', 'UmePlus P Gothic', 'VL PGothic', sans-serif;
    font-weight: 600;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    border-radius: 3px;
    width: 120px;
    color: #fff;
  }
  .filter-group input[type='checkbox']:first-child + label {
    border-radius: 3px 3px 0 0;
  }
  .filter-group label:last-child {
    border-radius: 0 0 3px 3px;
    border: none;
  }
  .filter-group input[type='checkbox'] {
    display: none;
  }
  .filter-group input[type='checkbox'] + label {
    background-color: #3386c0;
    display: block;
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  }
  .filter-group input[type='checkbox'] + label {
    background-color: #3386c0;
    text-transform: capitalize;
  }
  .filter-group input[type='checkbox'] + label:hover,
  .filter-group input[type='checkbox']:checked + label {
    background-color: #4ea0da;
  }
  .filter-group input[type='checkbox']:checked + label:before {
    content: '✔';
    margin-right: 5px;
  }
</style>