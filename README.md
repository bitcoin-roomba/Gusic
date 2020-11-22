# Gusic
Web-based music player

Gusic is a responsive music player with a grid-based album view, built with Bootstrap and HTML/CSS/JS.

## Functionality

### The actual music player

Pretty basic stuff. A play/pause toggle, previous and next track buttons, progress/seekbar combo and track time/duration. "Previous track" button goes to start of the current track if the track has been playing for at least 5 seconds. The whole interface sits in the always-visible navbar.

### Album-playlists

Reaching the end of a track will automatically play the next track. Uses copious amounts of querySelector.

### Grid Sorting

Library can be sorted by album title, artist and release year in ascending or descending order.

### Touch Mode

Just toggles between always visible library metadata and metadata only visible on hover. Called "touch mode" because hovering isn't really a thing with touchscreens.

### Library

The library is currently stored as a JS object array in js/albums.js. It is currently written manually, but automatic generation via folder walking and reading ID3 tags should be fairly simple.

## Todo:

- 3-position repeat toggle.
- Fix seekbar jank.
- Automatic library generation.
- Clustering by artist / year ?