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
      this.setUp()
    },
    methods: {
      setUp() {
        this.getLngLat();
      },
      getLngLat() {
        var vue = this
        navigator.geolocation.getCurrentPosition(function(position) {
          var lng = position.coords.longitude;
          var lat = position.coords.latitude;
          vue.createMap([lng, lat]);
        });
      },
      createMap(center) {
        mapboxgl.accessToken = this.access_token
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/code4osaka/ckm3bbsyd0dqp17tgsq4mpbb1',
          zoom: 15,
          center: center
        })
        this.setMap(this.map, center);
      },
      setMap(map, center) {
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, "top-left");
        map.on('load', () => {
          new mapboxgl.Marker().setLngLat(center).addTo(map);
          map.on('click', 'places', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var name = e.features[0].properties.name;
            var address = e.features[0].properties.address;
            var hp = e.features[0].properties.hp;
            var html = '<p>' + name + '<br>' + address
            if (hp != '') {
              html += '<br>HP: <a href="' + hp + '" target="_blank">' + hp + '</a>'
            }
            html += '</p>'
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            new mapboxgl.Popup().setLngLat(coordinates).setHTML(html).addTo(this);
          });
          map.on('mouseenter', 'places', function (e) {
            this.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'places', function (e) {
            this.getCanvas().style.cursor = '';
          });
        });
      }
    }
  }
</script>
<style>
  body { margin: 0; padding: 0; }
	#map { position: absolute; top: 0; bottom: 0; width: 100%; }
</style>