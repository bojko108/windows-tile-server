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

app.get('*', (req, res) => {
  res.sendFile('info.html', { root: path.join(__dirname, '/public') });
});

app.listen(port, () => {
  const message = `\n${title} (v${version})\nUp and running on: http://localhost:${port}\n\n${description}\n`;
  EventLogger.info(message);
  console.log(message);
});
