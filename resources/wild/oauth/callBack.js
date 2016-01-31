var exports = module.exports = {};
    oauth2 = require('simple-oauth2'),
    path = require('path');
    auth = require('./auth.js')

exports.path='callback';


exports.getHandle=function (req,res) {
	var code = req.query.code,
        state = req.query.state;
    console.log('/wild/oauth/callback');
    console.log(code);
    console.log(state);

    auth.linkedInOauth2.authCode.getToken({
            code: code,
            state: state,
            redirect_uri: 'http://nucoffeechat.azurewebsites.net/callback'
        },
        saveToken);

    function saveToken(error, result) {
        if (error) {
            console.log('Access Token Error', error.message);
        }

        token = auth.linkedInOauth2.accessToken.create(result);

        // this is where we need to do something with their token...
        console.log(token);
        createOAuthUser(token.token.access_token,res)

        
    }
}

function createOAuthUser(token,res)
{
    console.log('createOAuthUser token', token);
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

    console.log('createOAuthUser body', bodyString);

    callback = function(response) {
        var userID = '';
        response.on('data', function(d) {
            userID= JSON.parse(d).user;
        });
        response.on('end', function() {
            console.log('server.js: got userID '+ userID);
            res.cookie('userID' , userID,{ maxAge: 900000, httpOnly: false });
            res.redirect('/');
            
        });

        req.on('error', function(e) {
            console.log('server.js: createOAuthUser met error '+ e);
            res.redirect('/');
        });
    }

    var req = http.request(options, callback);
    req.write(bodyString);
    req.end();
}



