# Windows Tile Server

Designed for serving map tiles stored in files with XYZ schema or MBTiles. Windows Tile Server can be used as a HTTP server. When the server is running you can access the tiles from different mapping applications.

## Contents

- [Install](#install)
- [How to use](#how-to-use)
  - [Access to local Map Tiles](#access-to-local-map-tiles)
  - [Access to local MBTiles files](#access-to-local-mbtiles-files)

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

## Access to local Map Tiles

Local tiles must be located in `public` directory. Refer to [local map tiles](public/tiles/README.md) for more information on how to structure your local tile files.

Local map tiles can be accessed on address:

[http://localhost:1886/tiles](http://localhost:1886/tiles)

On this address you will get information about available tiles:

> **Available directories with tiles**
>
> This is a list of all directories, containing tiles and are served from this service:
>
> - default
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
> - default.mbtiles
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
