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
      this.setMarker()
    },
    methods: {
      createMap() {
        mapboxgl.accessToken = this.access_token
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/teppei696/cklc6ue2g1y1q17s0d5068j1q',
          zoom: 11,
          center: [135.5193174, 34.6862456]
        })
        var nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, "top-left");
      },
      setMarker() {
        var marker = null;
        for (var i = 0; i < Data.data.length; i++) {
          var monument = Data.data[i].latlng;
          var popup = new mapboxgl.Popup({ offset: 25 }).setText(Data.data[i].name);
          marker = new mapboxgl.Marker()
            .setLngLat(monument)
            .setPopup(popup)
            .addTo(this.map);
        }
      }
    }
  }
</script>
<style>
#map{
   width: 100%;
   height: 100vh;
}
</style>