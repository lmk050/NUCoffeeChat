var exports = module.exports = {};
var dbConn = require("../DB/dbConn.js");


exports.handle=function (req,res) {

	dbConn.test_query(res);

}

exports.path='dbTest';