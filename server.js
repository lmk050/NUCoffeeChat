// require modules
var express = require('express'),
    app = express(),
    request = require('request'),
    // oauth2 = require('simple-oauth2'),
    // path = require('path');
    bodyParser = require('body-parser');
    dbConn = require("./Resources/elf/db/dbConn.js");
    logger=require("./logger.js").getLogger();

// App settings

var myLogger = function (req, res, next) {
  logger.debug('myLogger - new request: '+req.path);
  next();
};
var cookieParser = require('cookie-parser');

var myAutheticator = function (req, res, next) {
    logger.debug('myLogger - new request: '+req.cookies.userID);
    if(undefined === req.cookies.userID || "undefined" == req.cookies.userID   )
    {
        authenticationFailed(req, res, next);
    }
    else
    {
        var userID= req.cookies.userID;
        var p1 = dbConn.getUserName(userID);
        return p1.then(
            function(val)
            {
               var obj=JSON.parse(val);
               console.log("serverjs: validated user: "+ obj.id);
               req.loginUserID=obj.id;
               next();
               return;
            }
        ).catch(
            function(reason) {
                authenticationFailed(req, res, next);
            }
        );
    }

};

function authenticationFailed(req, res, next) {
    var path = req.path;
    if(path =="/" || path =="/callback" || path=="/wild/oauth/auth" || path=="/cat/oauth/getUserID")
    {
         logger.debug("authenticationFailed : path matched ");
         next();
         return;
    }  
    console.log("authenticationFailed -- ");
    if(path.slice(1,5) == 'wild')
    {
        logger.debug("authenticationFailed : redirect request to home page ");
        res.redirect('/');
    }
    res.status(401);
    res.end();
}


app.use(cookieParser());
app.use(myLogger);
app.use(myAutheticator);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('views', './views');
app.use(express.static('public'));


// Homepage
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});


var fs = require('fs');
var resource = null;
fs.readFile('./resources/resources.txt', function(err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");
    for (i in array) {
        logger.debug(array[i].replace(/(\r\n|\n|\r)/gm,""));
        resource = require(array[i].replace(/(\r\n|\n|\r)/gm,""));
        if (typeof resource.getHandle === 'function')
        {
            logger.debug(resource.path+" GET");
             app.get('/' + resource.path, resource.getHandle );
        }
        if (typeof resource.postHandle === 'function')
        {
            logger.debug(resource.path+" POST");
             app.post('/' + resource.path, resource.postHandle);
        }
        if (typeof resource.putHandle === 'function')
        {
           logger.debug(resource.path+" PUT");
             app.put('/' + resource.path, resource.putHandle);
        }       
    }
});

app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

var port = process.env.PORT || 1337;

app.listen(port, function() {
    logger.debug('Example app listening on port %s!', port);
});


process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup){
        dbConn.clearup();
    } 
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

