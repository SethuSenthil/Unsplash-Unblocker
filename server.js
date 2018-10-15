const express = require('express');
const fs = require('fs');
const request = require('request');
const app = express();
const ipp = require('instagram-profile-picture');
const port = 5000;
var path = require('path');

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

app.post('/api/dynamic', function(req,res) {
    var dynamicController = require('./controllers/RuntimeController');
    dynamicController.init(app);
    res.status(200).send();
});
app.get('/api/:dynamicroute', function(req,res) {
    ipp(req.params.dynamicroute).then(user => {
        console.log(user);
        download(user, `./profilepics/${req.params.dynamicroute}.jpg`, function(){
            console.log('done downloading image into server');
            res.sendFile(`${__dirname}/profilepics/${req.params.dynamicroute}.jpg`);
          });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/api.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));