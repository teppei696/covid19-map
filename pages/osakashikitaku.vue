<template>
  <div>
    <div id='map'></div>
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
      this.createMap()
      this.map.on('load', () => {
        this.map.addSource('places', {
          'type': 'geojson',
          'data': Data
        });
        Data.features.forEach((feature) => {
          var symbol = feature.properties['icon'];
          var munic = feature.properties['munic'];
          var url = feature.properties['url'];
          var layerID = 'poi-' + munic;
          // Add a layer for this symbol type if it hasn't been added already.
          if (url != 'osakashikitaku') {
            return;
          }
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
          zoom: 14,
          center: [135.510095, 34.705581]
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
</style>