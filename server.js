// require modules
var express = require('express'),
    app = express(),
    request = require('request'),
    path = require('path');
    bodyParser = require('body-parser');
    dbConn = require("./Resources/elf/db/dbConn.js");
    logger=require("./logger.js").getLogger();

// App settings


var port = process.env.PORT || 1337;

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
        req.loginUserID=userID;
        next();
        return;
        // var p1 = dbConn.getUserName(userID);
        // return p1.then(
        //     function(val)
        //     {
        //        var obj=JSON.parse(val);
        //        console.log("serverjs: validated user: "+ obj.id);
        //        req.loginUserID=obj.id;
        //        next();
        //        return;
        //     }
        // ).catch(
        //     function(reason) {
        //         authenticationFailed(req, res, next);
        //     }
        // );
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
    else if(path.slice(1,5) == 'cat/')
    {
        res.status(401);
    }
    else
    {
        next();
        return;
    }
    res.end();
}


app.use(cookieParser());
app.use(myLogger);
app.use(myAutheticator);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// App settings
app.set('views', './views');
app.use('/image', express.static('image'));
app.use('/public', express.static('public'));
app.use('/style', express.static('style'));
app.set('view engine', 'jade');


// Homepage
app.get('/', function(req, res) {

    var http = require('http'); 

    var options = {
      host: req.get('host'),
      path: '/cat/user/getRandomUsers',
      method: 'GET',
      headers: {'Cookie': 'userID='+req.cookies.userID}
    };

    callback = function(response) {
        var people = '';
        response.on('data', function(d) {
            people= JSON.parse(d);
        });
        response.on('end', function() {
            if(req.loginUserID != undefined && req.loginUserID != "undefined")
        {
            var p1 = dbConn.getUserName(req.loginUserID);
            p1.then(
                function(val)
                {
                  // console.log("currentUser: then: "+ val);
                   var curUser=(JSON.parse(val));

                    res.render('index', {
                        people: people,
                        curUser:curUser,
                        person: {
                            "name": "Lisa Eng",
                            "image": "https://media.licdn.com/media/AAEAAQAAAAAAAALfAAAAJDU2YWFiZGM0LTgxZmEtNDcyZC05ODI4LTViZGM1YTg5MDkyOQ.jpg",
                            "work": ["Product Manager, Business Intelligence, Aereo", "Special Operations, Warby Parker Marketing, Quirky", "Special Customer Operations, Simon Schuster", "Associate, Triage Consulting Group"],
                            "education": ["MBA from NYU Stern Business School, University of California San Diego"],
                            "tags": ["strategy", "marketing", "tech", "SF", "49ers", "dogs", "consulting", "productmanager"],
                            "job": "Product Manager at Oracle Data Cloud",
                            "quote": "I am a dog-lover, 49ers fan, and tech enthusiast. Previously in New York, I live in San Francisco now with my husband and malti-poo dog, Izzo. Yes named after Coach Izzo!"
                        }
                    });
                    res.end();
                    return;

                }
            ).catch(
                function(reason) {
                    var obj=JSON.parse(reason)
                    res.status(obj.error);
                    return;
          
                }
            );
        }
        else
        {
            res.render('index', {
                people: people,
                person: {
                    "name": "Lisa Eng",
                    "image": "https://media.licdn.com/media/AAEAAQAAAAAAAALfAAAAJDU2YWFiZGM0LTgxZmEtNDcyZC05ODI4LTViZGM1YTg5MDkyOQ.jpg",
                    "work": ["Product Manager, Business Intelligence, Aereo", "Special Operations, Warby Parker Marketing, Quirky", "Special Customer Operations, Simon Schuster", "Associate, Triage Consulting Group"],
                    "education": ["MBA from NYU Stern Business School, University of California San Diego"],
                    "tags": ["strategy", "marketing", "tech", "SF", "49ers", "dogs", "consulting", "productmanager"],
                    "job": "Product Manager at Oracle Data Cloud",
                    "quote": "I am a dog-lover, 49ers fan, and tech enthusiast. Previously in New York, I live in San Francisco now with my husband and malti-poo dog, Izzo. Yes named after Coach Izzo!"
                }
            });
            res.end();
        }
        return;
            
        });

        req.on('error', function(e) {
            throw err;
        });
    }

    var request = http.request(options, callback);
   // request.write(bodyString);
    request.end();

});



// var fs = require('fs');
// var resource = null;
// fs.readFile('./resources/resources.txt', function(err, data) {
//     if (err) throw err;
//     var array = data.toString().split("\n");
//     for (i in array) {
//         logger.debug(array[i].replace(/(\r\n|\n|\r)/gm,""));
//         resource = require(array[i].replace(/(\r\n|\n|\r)/gm,""));
//         if (typeof resource.getHandle === 'function')
//         {
//             logger.debug(resource.path+" GET");
//              app.get('/' + resource.path, resource.getHandle );
//         }
//         if (typeof resource.postHandle === 'function')
//         {
//             logger.debug(resource.path+" POST");
//              app.post('/' + resource.path, resource.postHandle);
//         }
//         if (typeof resource.putHandle === 'function')
//         {
//            logger.debug(resource.path+" PUT");
//              app.put('/' + resource.path, resource.putHandle);
//         }       
//     }
// });

var resource = null;
var array = ['./Resources/cat/oauth/getUserID.js','./Resources/cat/user/getUserName.js','./Resources/cat/user/currentUser.js','./Resources/wild/oauth/auth.js','./Resources/wild/oauth/callBack.js','./resources/cat/user/getRandomUsers.js'];
for (i in array) {
    logger.debug(array[i]);
    resource = require(array[i]);
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


app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(port, function() {
    logger.debug('Example app listening on port %s!', port);
});


//process.stdin.resume();//so the program will not close instantly

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

