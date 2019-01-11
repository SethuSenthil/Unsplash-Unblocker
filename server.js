const express = require('express');
const fs = require('fs');
const request = require('request');
const app = express();
const port = 5000;
const path = require('path');
//a simple download function to save our file to the server with a callback
const download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
app.get('/:dynamicroute', function(req,res) {
    console.log(req.params.dynamicroute);
    let imgURL = 'https://source.unsplash.com/' + req.params.dynamicroute;
    console.log(imgURL)
    //checks if image alredy exists in server
    if (fs.existsSync(`${__dirname}/images/${req.params.dynamicroute}.jpg`)) {
        res.sendFile(`${__dirname}/images/${req.params.dynamicroute}.jpg`);
        //if yes, then it will send that file to the user

    }else{
        download(imgURL, `./images/${req.params.dynamicroute}.jpg`,  function(){
            console.log('done downloading image on server');
            res.sendFile(`${__dirname}/images/${req.params.dynamicroute}.jpg`);
          });
          //if no, it will download the image then send it to the user
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.listen(port, () => console.log(`Listening on port ${port}`));