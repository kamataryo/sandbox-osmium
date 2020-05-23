# SANDBOX OSMIUM

Build POI only vector tile from `osm.pbf`.

## Prerequisite

- tippecanoe https://github.com/mapbox/tippecanoe
- tileserver-gl https://github.com/maptiler/tileserver-gl

## steps

1. Download `japan-latest.osm.pbf` from http://download.geofabrik.de/asia/japan.html.
2. `$ npm run build`
3. `$ less dist/output.ndjson`
4. `$ tileserver-gl dist/out.mbtiles`
