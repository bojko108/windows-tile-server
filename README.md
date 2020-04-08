# Windows Tile Server

Designed for serving map tiles stored in files with XYZ schema or MBTiles. Windows Tile Server can be used as a HTTP server. When the server is running you can access the tiles from different mapping applications.

Simmilar map tiles server is available for Android - [Mobile Tile Server](https://github.com/bojko108/mobile-tile-server).

## Contents

- [Install](#install)
- [How to use](#how-to-use)
  - [Access to local Map Tiles](#access-to-local-map-tiles)
  - [Access to local MBTiles files](#access-to-local-mbtiles-files)
- [Examples](#examples)

## Install

1. Clone:

```
git clone https://github.com/bojko108/mobile-tile-server.git
```

or:

```
git clone git@github.com:bojko108/windows-tile-server.git
```

2. Install dependencies:

```
yarn install
```

3. Start the server:

```
yarn run start
```

4. Or install it as a Windows Service:

```
yarn run install
```

You can uninstall the Windows Service with:

```
yarn run uninstall
```

## How to use

When started, the server provides two options:

- Access to local Map Tiles [Slippy Map](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
- Access to local [MBTiles files](https://github.com/mapbox/mbtiles-spec)

When started, the server can be accessed on:

[http://localhost:1886](http://localhost:1886)

The server also provides you with the option to preview each of the available tiles by navigating to:

```
http://localhost:1886/preview/tiles/{tile name}
```

or for MBTiles:

```
http://localhost:1886/preview/mbtiles/{tile name}
```

## Access to local Map Tiles

Local tiles must be located in `public` directory. Refer to [local map tiles](public/tiles/README.md) for more information on how to structure your local tile files.

Local map tiles can be accessed on address:

[http://localhost:1886/tiles](http://localhost:1886/tiles)

On this address you will get information about available tiles:

> **Available directories with tiles**
>
> This is a list of all directories, containing tiles and are served from this service:
>
> - **default** - preview with Leaflet viewer
>
> | Property     | Value                                           |
> | ------------ | :---------------------------------------------- |
> | Min Zoom     | 1                                               |
> | Max Zoom     | 10                                              |
> | URL Template | http://localhost:1886/tiles/default/{z}/{x}/{y} |

## Access to local MBTiles files

Local MBTiles files must be located in `public` directory. Refer to [MBTiles files](public/mbtiles/README.md) for more information on how to structure your MBTiles files.

Local MBTiles files can be accessed on address:

[http://localhost:1886/mbtiles](http://localhost:1886/mbtiles)

On this address you will get information about available MBTiles files:

> **Available MBTiles files**
>
> This is a list of all MBTiles files, served from this service:
>
> - **default.mbtiles** - preview with Leaflet viewer
>
> | Property     | Value                                                                         |
> | ------------ | :---------------------------------------------------------------------------- |
> | Version      | 1.1                                                                           |
> | Description  | BG                                                                            |
> | Type         | overlay                                                                       |
> | Format       | png                                                                           |
> | Min Zoom     | 1                                                                             |
> | Max Zoom     | 12                                                                            |
> | Scheme       | xyz                                                                           |
> | Bounds       | 23.119626693369888, 42.56456404303669, 23.559748137141618, 42.828222356154384 |
> | Center       | 23.339687415255753, 42.69639319959553, 6                                      |
> | URL Template | http://localhost:1886/mbtiles/default.mbtiles/{z}/{x}/{y}                     |

## Examples

This servеr can be used from any mapping application, which supports loading of tiles with XYZ tiling scheme. Here is an example use in [QGIS](https://qgis.org/en/site/). In QGIS you can add a new XYZ Tiles source and then load it in the map.

### With QGIS

1. Clone this project
2. Prepare your tiles
3. Run the server
4. Add a new XYZ Tile source in QGIS Browser using Python Console:

```python
title = 'Local MBTiles'
referer = 'Tiles are loaded from Windows Tile Server Service'
url = 'http://localhost:1886/mbtiles/default.mbtiles/{z}/{x}/{y}'
min_zoom = 1
max_zoom = 12

prefix = "qgis/connections-xyz/{0}".format(title)
QSettings().setValue("{0}/url".format(prefix), url)
QSettings().setValue("{0}/referer".format(prefix), referer)
QSettings().setValue("{0}/zmin".format(prefix), min_zoom)
QSettings().setValue("{0}/zmax".format(prefix), max_zoom)

iface.reloadConnections()
```

Or local XYZ tiles:

```python
title = 'Local Tiles'
referer = 'Tiles are loaded from Windows Tile Server Service'
url = 'http://localhost:1886/tiles/default/{z}/{x}/{y}'
min_zoom = 1
max_zoom = 10

prefix = "qgis/connections-xyz/{0}".format(title)
QSettings().setValue("{0}/url".format(prefix), url)
QSettings().setValue("{0}/referer".format(prefix), referer)
QSettings().setValue("{0}/zmin".format(prefix), min_zoom)
QSettings().setValue("{0}/zmax".format(prefix), max_zoom)

iface.reloadConnections()
```
