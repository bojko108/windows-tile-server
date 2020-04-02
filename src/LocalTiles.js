const path = require('path');
const fs = require('fs');

module.exports = {
  getAvailableTiles() {
    const tilesdirectory = path.join(__dirname, '../public/tiles');
    const directories = fs
      .readdirSync(tilesdirectory, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => dir.name);

    return directories.map(directory => {
      const zoomLevels = fs
        .readdirSync(path.join(tilesdirectory, directory), { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => Number(dir.name))
        .sort((a, b) => a - b);

      return {
        name: directory,
        minZoom: zoomLevels[0],
        maxZoom: zoomLevels[zoomLevels.length - 1]
      };
    });
  },
  getInfo(directory) {
    return this.getAvailableTiles().filter(d => d.name === directory)[0];
  },
  getInfoAsHtml(title) {
    let directories = this.getAvailableTiles();
    const asHtml = info => {
      const url = `http://localhost:1886/tiles/${info.name}/{z}/{x}/{y}`;
      return `
<li>
<span><b>${info.name}</b> - <a href='../preview/tiles/${info.name}'>preview with Leaflet viewer</a></span>
<div class="rTable">
  <div class="rTableRow">
    <div class="rTableHead"><strong>Property</strong></div>
    <div class="rTableHead"><strong>Value</strong></div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Min Zoom</div>
    <div class="rTableCell">${info.minZoom}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">Max Zoom</div>
    <div class="rTableCell">${info.maxZoom}</div>
  </div>
  <div class="rTableRow">
    <div class="rTableCell">URL Template</div>
    <div class="rTableCell"><a href='${url}'>${url}</a></div>
  </div>
</div>
</li>`;
    };
    directories = directories.map(info => asHtml(info)).join('');
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
<h2 id="how-to-use">Available directories with tiles</h2>
<p>This is a list of all directories, containing tiles and are served from this service:</p>
<ul>
    ${directories}
</ul>
</body>
</html>`;
    return html;
  },
  getTile({ tilesRoot, z, x, y }) {
    // if y is {y}.png
    const data = y.split('.');
    const extension = data[1] || 'png';
    y = data[0];

    // if y is negative it is asumed that your app is using TMS schema
    // so y has to be claculated in XYS schema
    if (y < 0) {
      y = Math.pow(2, z) - Math.abs(y) - 1;
    }

    const tilePath = path.join(__dirname, `../public/tiles/${tilesRoot}/${z}/${x}/${y}.${extension}`);
    if (fs.existsSync(tilePath)) {
      return tilePath;
    }
  }
};
