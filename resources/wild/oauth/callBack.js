var exports = module.exports = {};
    oauth2 = require('simple-oauth2'),
    path = require('path');
    auth = require('./auth.js')
    logger=require("../../../logger.js").getLogger();

exports.path='callback';


exports.getHandle=function (req,res) {
	var code = req.query.code,
        state = req.query.state;
    logger.debug('/wild/oauth/callback');
    logger.debug(code);
    logger.debug(state);

    auth.linkedInOauth2.authCode.getToken({
            code: code,
            state: state,
            redirect_uri: 'http://nucoffeechat.azurewebsites.net/callback'
        },
        saveToken);

    function saveToken(error, result) {
        if (error) {
            logger.debug('Access Token Error', error.message);
        }

        token = auth.linkedInOauth2.accessToken.create(result);

        // this is where we need to do something with their token...
        logger.debug(token);
        createOAuthUser(token.token.access_token,res)

        
    }
}

function createOAuthUser(token,res)
{
    logger.debug('createOAuthUser token', token);
    var http = require('http'); 

    var bodyString = JSON.stringify({
        accessToken: token
    });

    var options = {
      host: 'localhost',
      port: 1337,
      path: '/cat/oauth/getUserID',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length
      },
    };

    logger.debug('createOAuthUser body', bodyString);

    callback = function(response) {
        var userID = '';
        response.on('data', function(d) {
            userID= JSON.parse(d).user;
        });
        response.on('end', function() {
            logger.debug('server.js: got userID '+ userID);
            res.cookie('userID' , userID,{ maxAge: 900000, httpOnly: false });
            res.redirect('/');
            
        });

        req.on('error', function(e) {
            logger.debug('server.js: createOAuthUser met error '+ e);
            res.redirect('/');
        });
    }

    var req = http.request(options, callback);
    req.write(bodyString);
    req.end();
}



