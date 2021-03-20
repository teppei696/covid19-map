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
      var filterGroup = document.getElementById('filter-group');
      this.createMap()
      this.map.on('load', () => {
        this.map.addSource('places', {
          type: 'geojson',
          data: Data,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });
        this.map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'places',
          filter: ['has', 'point_count'],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
              'step',
              ['get', 'point_count'],'#51bbd6',
              100,'#f1f075',
              750,'#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],20,
              100,30,
              750,40
            ]
          }
        });
        this.map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'places',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });
        this.map.addLayer({
          id: 'unclustered-point',
          type: 'symbol',
          source: 'places',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-image': 'restaurant-15',
            'icon-allow-overlap': true
          }
        });
        // inspect a cluster on click
        this.map.on('click', 'clusters', (e) => {
          var features = this.map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          var clusterId = features[0].properties.cluster_id;
          this.map.getSource('earthquakes').getClusterExpansionZoom(
            clusterId,
            function(err, zoom) {
              if (err) return;
              this.map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
              });
            }
          );
        });
        this.map.on('click', 'unclustered-point', (e) => {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var name = e.features[0].properties.name;
          var address = e.features[0].properties.address;
          var html = '<p>' + name + '<br>' + address + '</p>'
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          new mapboxgl.Popup().setLngLat(coordinates).setHTML(html).addTo(this.map);
        });
        this.map.on('mouseenter', 'clusters', () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });
        this.map.on('mouseleave', 'clusters', () => {
          this.map.getCanvas().style.cursor = '';
        });
        this.map.on('mouseenter', 'unclustered-point', () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });
        this.map.on('mouseleave', 'unclustered-point', () => {
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