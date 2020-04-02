const { title, version, description, homepage } = require('../package.json');
const path = require('path');
const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
  name: title,
  description: `(v${version}) ${description}. For more information visit ${homepage}.`,
  script: path.join(__dirname, '../app.js'),
  nodeOptions: ['--harmony', '--max_old_space_size=4096']
  //, workingDirectory: '...'
});

svc.on('start', function() {
  console.log('Service started!');
  console.log('Service exists: ', svc.exists);
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
  svc.start();
});

svc.install();
