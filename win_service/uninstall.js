const { title } = require('../package.json');
const path = require('path');
const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
  name: title,
  script: path.join(__dirname, '../app.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function() {
  console.log('Uninstall complete.');
  console.log('Service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();
