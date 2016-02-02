var exports = module.exports = {};
var dbConn = require("../../elf/db/dbConn.js");

// var urlLinkedin='api.linkedin.com';
// var urlBasicProfie='/v1/people/~?format=json';

exports.path='cat/user/getRandomUsers';

exports.getHandle=function (req,res) {
	getRandomUserInfos(res);
}

function getRandomUserInfos(res)
{
	var p1 = dbConn.getRandomUserInfos(4);
	return p1.then(
        function(val)
        {
           console.log("getRandomUserInfos: then: "+ val);
           res.json(JSON.parse(val));
        }
    ).catch(
        function(reason) {
            var obj=JSON.parse(reason)
            res.status(obj.error);
            res.end();
  
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

