const { title, description, version } = require('./package.json');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 1886;
const NO_TILE = 'no_tile.png';
const MBTiles = require('./src/MBTiles');
const LocalTiles = require('./src/LocalTiles');
const EventLogger = require('./win_service/EventLogger');

app.get('/mbtiles', async (req, res) => {
  try {
    const info = await MBTiles.getInfoAsHtmlAsync(title);
    res.type('html');
    res.send(info);
  } catch (err) {
    EventLogger.error(`app.get(/mbtiles): ${err}`);
    res.status(500).json({ error: err.toLocaleString() });
  }
});

app.get('/mbtiles/:file/:z/:x/:y', async (req, res) => {
  try {
    let mbtilesfile = path.join(__dirname, `/public/mbtiles/${req.params.file}`);
    if (mbtilesfile.indexOf('.mbtiles') < 0) {
      mbtilesfile += '.mbtiles';
    }

    if (fs.existsSync(mbtilesfile)) {
      await MBTiles.prepareMBTilesDBAsync(mbtilesfile);
      const tile = await MBTiles.getTileAsync(req.params);
      if (tile) {
        res.send(tile);
      } else {
        res.sendFile(NO_TILE, { root: path.join(__dirname, '/public') });
      }
    } else {
      res.sendFile(NO_TILE, { root: path.join(__dirname, '/public') });
    }
  } catch (err) {
    EventLogger.error(`app.get(/mbtiles/x/y/z): ${err}`);
    res.status(404).json({ error: err.toLocaleString() });
  }
});

app.get('/tiles', (req, res) => {
  try {
    const info = LocalTiles.getInfoAsHtml(title);
    res.type('html');
    res.send(info);
  } catch (err) {
    EventLogger.error(`app.get(/mbtiles): ${err}`);
    res.status(500).json({ error: err.toLocaleString() });
  }
});

app.get('/tiles/:tilesRoot/:z/:x/:y', (req, res) => {
  try {
    const tilePath = LocalTiles.getTile(req.params);
    if (tilePath) {
      res.sendFile(tilePath);
    } else {
      res.sendFile(NO_TILE, { root: path.join(__dirname, '/public') });
    }
  } catch (err) {
    EventLogger.error(`app.get(/tiles/tilesRoot/x/y/z): ${err}`);
    res.status(404).send(err);
  }
});

app.get('/preview/mbtiles/:mbfile', async (req, res) => {
  try {
    const { mbfile } = req.params;
    const mbtilesfile = path.join(__dirname, `/public/mbtiles/${mbfile}`);
    const info = await MBTiles.getInfoAsync(mbtilesfile);

    if (info) {
      const url = `http://localhost:1886/mbtiles/${mbfile}/{z}/{x}/{y}`;
      let templateText = fs.readFileSync('./public/preview.html').toString();
      templateText = templateText
        .replace('$latitude$', info.center[1] || 0)
        .replace('$longitude$', info.center[0] || 0)
        .replace('$zoom$', info.center[2] || 2)
        .replace('$url$', url)
        .replace('$minzoom$', info.minzoom)
        .replace('$maxzoom$', info.maxzoom);

      res.type('html');
      res.send(templateText);
    } else {
      res.status(404).send(`${mbfile} not found in available MBTiles`);
    }
  } catch (err) {
    EventLogger.error(`app.get(/preview/mbtiles): ${err}`);
    res.status(500).json({ error: err.toLocaleString() });
  }
});

app.get('/preview/tiles/:directory', async (req, res) => {
  try {
    const { directory } = req.params;
    const info = LocalTiles.getInfo(directory);

    if (info) {
      let templateText = fs.readFileSync('./public/preview.html').toString();
      const url = `http://localhost:1886/tiles/${directory}/{z}/{x}/{y}`;

      templateText = templateText
        .replace('$latitude$', 0)
        .replace('$longitude$', 0)
        .replace('$zoom$', 2)
        .replace('$url$', url)
        .replace('$minzoom$', info.minZoom)
        .replace('$maxzoom$', info.maxZoom);

      res.type('html');
      res.send(templateText);
    } else {
      res.status(404).send(`${directory} not found in available tiles`);
    }
  } catch (err) {
    EventLogger.error(`app.get(/preview/mbtiles): ${err}`);
    res.status(500).json({ error: err.toLocaleString() });
  }
});

app.get('*', (req, res) => {
  res.sendFile('info.html', { root: path.join(__dirname, '/public') });
});

app.listen(port, () => {
  const message = `\n${title} (v${version})\nUp and running on: http://localhost:${port}\n\n${description}\n`;
  EventLogger.info(message);
});
