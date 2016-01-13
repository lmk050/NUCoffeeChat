var express = require('express');
var app = express();



app.get('/', function (req, res) {
  res.send('Welcome to NU Coffee Chat!');
});

var fs = require('fs');
var resource = null;

fs.readFile('./Resources/resources.txt', function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
    for(i in array) {
        console.log(array[i]);
        resource=require(array[i]);
        app.get('/'+resource.path, function (req, res) {
            resource.handle(req,res);
        });
    }
});



var port = process.env.PORT || 1337;

app.listen(port, function () {
  console.log('Example app listening on port port!');
})
