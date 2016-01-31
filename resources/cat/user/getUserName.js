var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path='cat/user/:userId/getUserName';

exports.getHandle=function (req,res) {
	console.log('user/getUserName: userID: request received');
	var userId =req.params.userId;
	console.log('user/getUserName: userId: '+ userId);
	getUserName(userId,res);
}

function getUserName(userId,res)
{
	var p1 = dbConn.getUserName(userId);
	return p1.then(
        function(val)
        {
           console.log("getUserName: then: "+ val);
           res.json(JSON.parse(val));
        }
    ).catch(
        function(reason) {
            var obj=JSON.parse(reason)
            res.status(obj.error);
  
        }
    );
	return;
}



// exports.putHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

// exports.deleteHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

// exports.postHandle=function (req,res) {
// 	res.status(405).end(); // Method Not Allowed
// }

