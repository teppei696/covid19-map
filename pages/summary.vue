<template>
  <div>
    <div id='map'></div>
  </div>
</template>

<script>
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css';
  import Data from '@/data/summary.json'
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
          type: 'geojson',
          data: Data
        });
        this.map.addLayer({
          id: 'places',
          type: 'circle',
          source: 'places',
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': '#51bbd6',
            'circle-stroke-color': '#191970',
            'circle-stroke-width': 2,
            'circle-radius': {
              'base': 15,
              'stops': [
                [12, 15],
                [22, 180]
              ]
            }
          }
        });
        this.map.on('click', 'places', (e) => {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var munic = e.features[0].properties.munic;
          var url = e.features[0].properties.url;
          var count = e.features[0].properties.count;
          var html = '<p><a href="./' + url + '">' + munic + '</a><br>' + count + ' 件</p>'
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          new mapboxgl.Popup().setLngLat(coordinates).setHTML(html).addTo(this.map);
        });
        this.map.on('mouseenter', 'places', () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });
        this.map.on('mouseleave', 'places', () => {
          this.map.getCanvas().style.cursor = '';
        });
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
</style>