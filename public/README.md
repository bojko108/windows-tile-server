# Root directory

Here you can store your local tiles and MBTiles files arranged in separate directories. You can also change `no_tile.png` file, which is served every time a tile is not found. This directory stores the template file for previewing the tiles - `preview.html`. The template file contains several strings, which can be replaced with values:

- `{{latitude}}` - will set the latitude value for the initial map view
- `{{longitude}}` - will set the longitude value for the initial map view
- `{{zoom}}` - will set the zoom value for the initial map view
- `{{url}}` - will set the url value for loading the tiles
- `{{minzoom}}` - will set the minimum zoom for the map view
- `{{maxzoom}}` - will set the maximum zoom for the map view

## Local Tiles

Local tiles are located in `tiles` directory - refer to [local map tiles](tiles/README.md) for more information on how to structure your tile files.

## MBTiles files

MBTile files are located in `mbtiles` directory - refer to [MBTiles files](mbtiles/README.md) for more information on how to structure your MBTiles files.

# Example file structure

```
📦public
 ┣ 📂mbtiles
 ┃ ┣ 📜default.mbtiles
 ┃ ┣ 📜glavatar-kaleto-M5000-zoom1_17.mbtiles
 ┃ ┗ ...
 ┣ 📂tiles
 ┃ ┣ 📂default
 ┃ ┃ ┣ 📂1
 ┃ ┃ ┃ ┗ 📂1
 ┃ ┃ ┃ ┃ ┗ 📜0.png
 ┃ ┃ ┣ ...
 ┃ ┣ ...
```
