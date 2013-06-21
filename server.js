'use strict';

var cluster = require('cluster');

if (cluster.isMaster) {
    var os = require("os");
    var i;
    console.log('Creating forks for each cpu:', os.cpus().length, 'found.');

    for (i = 0; i < 2; ++i) {
        cluster.fork();
    }
} else {
    var
        fs = require("fs"),
        express = require('express'),
        site = express();

    site.configure(function () {
    });

    // Use Compression (gzip)
    site.use(express.compress());

    // Serve static files
    site.use('/src', express.static(__dirname + '/src'));

    // MOCK API ENDPOINTS (JSON) CAN BE ADDED HERE IF SO DESIRED
//    site.get('/api/path/path2', function (req, res) {
//        res.send('{"name": "value", "name2": "value"}');
//    });

// Ensure all routes go home, client side app..
    site.get('/grunt-bower-demo-app/*', function (req, res) {
        fs.createReadStream("index.html").pipe(res);
    });

    site.get('/401.html', function (req, res) {
        res.status(401).sendfile('src/401.html');
    });

// Ensure all other routes are not found.
    site.get('/*', function (req, res) {
        res.status(404).sendfile('src/404.html');
    });

//site.use(express.logger())

// Actually listen
    site.listen(8080);
}
