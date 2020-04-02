const path = require('path');
const fs = require('fs');
const MBTiles = require('@mapbox/mbtiles');
let mbtilesdb = null;
let currentmbtilesfile = null;
let mbtilesInfo = {};

module.exports = {
  async getAvailableMBTilesFilesAsync() {
    const mbtilesdirectory = path.join(__dirname, '../public/mbtiles');
    const files = fs
      .readdirSync(mbtilesdirectory, { withFileTypes: true })
      .filter(f => f.isFile() && f.name.indexOf('.mbtiles') > -1)
      .map(f => path.join(mbtilesdirectory, f.name));

    let result = [];
    for (let i = 0; i < files.length; i++) {
      const { db, info } = await this.readMBTilesDBAsync(files[i]);
      result.push(info);
      db.close();
    }

    return result;
  },
  async getInfoAsHtmlAsync(title) {
    let files = await this.getAvailableMBTilesFilesAsync();
    const asHtml = info => {
      const url = `http://localhost:1886/mbtiles/${info.basename || info.name}/{z}/{x}/{y}`;
      return `
<li>
<b>${info.basename || info.name}</b>
<div class="rTable">
  <div class="rTableRow">
    <div class="rTableHead"><strong>Property</strong></div>
    <div class="rTableHead"><strong>Value</strong></div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Version</div>
    <div class="rTableCell">${info.version}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Description</div>
    <div class="rTableCell">${info.description}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Type</div>
    <div class="rTableCell">${info.type}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Format</div>
    <div class="rTableCell">${info.format}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Min Zoom</div>
    <div class="rTableCell">${info.minzoom}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Max Zoom</div>
    <div class="rTableCell">${info.maxzoom}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Scheme</div>
    <div class="rTableCell">${info.scheme}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Bounds</div>
    <div class="rTableCell">${info.bounds}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Center</div>
    <div class="rTableCell">${info.center}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">URL Template</div>
    <div class="rTableCell"><a href='${url}'>${url}</a></div>
  </div>
</div>
</li>`;
    };

    files = files.map(f => asHtml(f)).join('');
    const html = `
<!DOCTYPE html>
<html lang="en" ng-strict-di>
<head>
    <title>${title}</title>
    <style>
      .rTable { display: table; padding: 10px }
      .rTableRow { display: table-row; }
      .rTableHead { display: table-header-group; background-color: #dddddd; }
      .rTableBody { display: table-row-group; }
      .rTableFoot { display: table-footer-group; }
      .rTableCell, .rTableHead { display: table-cell; padding: 3px; padding-right: 10px; border: 1px solid #999999;}
    </style>
</head>
<body>
<h2 id="how-to-use">Available MBTiles files</h2>
<p>This is a list of all MBTiles files, served from this service:</p>
<ul>
    ${files}
</ul>
</body>
</html>`;
    return html;
  },
  async prepareMBTilesDBAsync(mbtilesfile) {
    if (currentmbtilesfile != mbtilesfile) {
      currentmbtilesfile = mbtilesfile;
      const { db, info } = await this.readMBTilesDBAsync(mbtilesfile);
      if (db) {
        // a new mbtiles db should be connected and set as current
        if (mbtilesdb) {
          // close current db
          mbtilesdb.close();
        }
        mbtilesdb = db;
      }
      if (info) {
        mbtilesInfo = info;
      }
    }
  },
  readMBTilesDBAsync(mbtilesfile) {
    return new Promise((yes, no) => {
      new MBTiles(`${mbtilesfile}?mode=ro`, (err, db) => {
        if (err) {
          no(err);
        }
        db.getInfo((err, info) => {
          if (err) {
            no(err);
          }
          yes({ db, info });
        });
      });
    });
  },
  getTileAsync({ z, x, y }) {
    if (!mbtilesdb) return;

    // if y is {y}.png
    if (y.indexOf('.') > -1) {
      y = y.substring(0, y.lastIndexOf('.'));
    }

    // MBTiles by default use TMS for the tiles. Most mapping apps use slippy maps: XYZ schema
    // MBTiles expects XYZ schema, so if y is negative it is asumed that your app is using TMS
    if (y < 0) {
      y = Math.pow(2, z) - Math.abs(y) - 1;
    }

    return new Promise((yes, no) => {
      mbtilesdb.getTile(z, x, y, (err, data, headers) => {
        yes(data);
      });
    });
  }
};
