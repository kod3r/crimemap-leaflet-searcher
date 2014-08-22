CrimemapLeafletSearcher
==========

Simple GeoSearch tool based on leaflet and d3 and nominatim.openstreetmap.org. Tranlsates region types to Slovak lang.

## Basic Usage

```js
var searcher = L.CrimemapLeafletSearcher(map);
```

```html
<link rel="stylesheet" type="text/css" href="crimemap-leaflet-searcher.css">
<script src="d3.js"></script>
<script src="leaflet.js"></script>
<script src="crimemap-leaflet-searcher.js"></script>
```


## Reference

#### L.CrimemapLeafletSearcher(map)

Constructs crimemap-leaflet-searcher in given map

#### Methods

- **results(maxResults)**: Limits the number of results. Default is 10. ( Nominatim is returning <0,10> results)
- **onfinish(callback)**: Callback called after search is finished.
- **onchoose(callback)**: Callback called after some result is chosen.


## Build

```
nmp install
node_modules/.bin/grunt
```


## Changelog

#### 0.1.3 Aug 22, 2014

- onchoose added.

#### 0.1.2 Aug 22, 2014

- onfinish added.

#### 0.1.0 Aug 8, 2014

- Initial release.

