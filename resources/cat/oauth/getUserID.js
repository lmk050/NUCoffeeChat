var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");
var logger=require("../../../logger.js").getLogger();

var urlLinkedin='api.linkedin.com';
var urlBasicProfie='/v1/people/~:(id,first-name,last-name,picture-urls::(original),email-address,industry,headline,specialties,positions,picture-url,public-profile-url)?format=json';

exports.path='cat/oauth/getUserID';

exports.postHandle=function (req,res) {
	logger.debug('oAuth/getUserId: userID: request received');
	// console.log('oAuth/getUserId: body: '+ req.body.accessToken);
	req.accepts('application/json');
	var accessToken =req.body.accessToken;
	logger.debug('oAuth/getUserId: accessToken: '+ accessToken);
	getLinkedInBasicProfie(accessToken,res);
}

function getLinkedInBasicProfie(accessToken,res)
{
	var https = require('https'); 

	var options = {
	  host: urlLinkedin,
	  path: urlBasicProfie,
	  method: 'GET',
	  headers: {'Authorization': 'Bearer '+ accessToken}
	};

	callback = function(response) {
	    var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
			logger.debug('getBasicProfie: '+body);
            var parsed = JSON.parse(body);
            logger.debug('getBasicProfie errorcode: '+parsed.errorCode);
            if( parsed.id === undefined)
            {
            	logger.debug('getBasicProfie going to send back error msg');
            	res.status(parseInt(parsed.status)).json({error:parsed.message});
            }
            else
            {
	            var userId = createUserIfNotExist( parsed, accessToken, res);
       		}
           
        });

        req.on('error', function(e) {
            res.status(response.status).json({error:e});
        });
	}

	var req = https.request(options, callback);
	req.end();
}

function createUserIfNotExist(parsed,accessToken,res)
{
	var p1 = dbConn.createUserIfNotExist(parsed,accessToken);
	return p1.then(
			function(val)
			{
				
          	  	logger.debug("getUserID: get user id: "+ val);
				res.json({user:val});
            }
        ).catch(
        	function(reason) {
         	   var obj=JSON.parse(reason)
          	   res.status(obj.error);
      		  }
            
        );
}

// exports.putHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

// exports.deleteHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

// exports.getHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

