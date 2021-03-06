var mysql = require("mysql");
var Promise = require('promise');
var logger=require("../../../logger.js").getLogger();

var exports = module.exports = {};


var pool = mysql.createPool({
    connectionLimit: 4, //maximum connection for Azure student
    host: "us-cdbr-azure-central-a.cloudapp.net",
    user: "b443fc80dd2566",
    password: "4d39195d",
    database: "coffeechat"
});

exports.clearup = function(){
    logger.debug('Going to release DB connection pool');
    pool.end(function (err) { //release all connections
        logger.debug('Error in release pool '+err);
    });
}


exports.getRandomUserInfos = function(noOfUsers){

    return new Promise(function(resolve, reject) {
           pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT u.id, u.firstName, u.lastName, u.email, u.headline, u.profilePicO, u.linkedInProfile, i.`name` as industry From user_basic as u LEFT JOIN industry_desc as i on u.industry = i.id  ORDER BY RAND() LIMIT ?";
            var inserts = [noOfUsers];
            sql = mysql.format(sql, inserts);

            logger.debug("getUserInfo: going to query random user infos: "+ sql);
            connection.query(sql,function(err, rows) {
                if(!err)
                {

                    if(rows.length > 0 ) {
                         var result='{"total":"'+noOfUsers+'","values":[';
                         var first=true;
                         for(i=0; i<rows.length;i++)
                         {
                            if(!first)
                            {
                                result+=",";
                            }
                            first=false;
                            result +='{"userId":"'+rows[i].id+'","firstName":"'+rows[i].firstName+'","lastName":"'+rows[i].lastName+'","headLine":"'+rows[i].headline+'","industry":"'+rows[i].industry+'","profilePic":"'+rows[i].profilePicO+'","linkedInProfile":"'+rows[i].linkedInProfile+'"}';        
                         }
                         result+="]}"
                    connection.release();
                    //logger.debug("getUserInfo: random user infos: "+ result);
                    resolve(result);
                
                    }
                    else
                    {
                        logger.debug("dbConn: didnt find user: "+ userId);
                        connection.release();
                        reject('{"error":"400", "errorMsg":"Invalid UserID"}');
                                    
                    }
                }
                else
                {
                     logger.debug('Error in connection database');
                     connection.release();
                     reject('{"error":"500","errorMsg": '+err+'}');
                }
               
            });
                    

            connection.on('error',function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
       });

}

exports.getUserInfo = function(userId){

    return new Promise(function(resolve, reject) {
           pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT u.id, u.firstName, u.lastName, u.email, u.headline, u.profilePicO, u.linkedInProfile, i.`name` as industry From user_basic as u LEFT JOIN industry_desc as i on u.industry = i.id WHERE u.id =?";
            var inserts = [userId];
            sql = mysql.format(sql, inserts);

            logger.debug("getUserInfo: going to query user info: "+ sql);
            connection.query(sql,function(err, rows) {
                if(!err)
                {
                    if(rows.length > 0 ) {
                    logger.debug("dbConn: found user: "+ userId);
                    var result='{"userId":"'+userId+'","firstName":"'+rows[0].firstName+'","lastName":"'+rows[0].lastName+'","headLine":"'+rows[0].headline+'","industry":"'+rows[0].industry+'","profilePic":"'+rows[0].profilePicO+'","linkedInProfile":"'+rows[0].linkedInProfile+'"}';
                    connection.release();
                    resolve(result);
                
                    }
                    else
                    {
                        logger.debug("dbConn: didnt find user: "+ userId);
                        connection.release();
                        reject('{"error":"400", "errorMsg":"Invalid UserID"}');
                                    
                    }
                }
                else
                {
                     logger.debug('Error in connection database');
                     connection.release();
                     reject('{"error":"500","errorMsg": '+err+'}');
                }
               
            });
                    

            connection.on('error',function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
       });

}


exports.getUserName = function(userId){

    return new Promise(function(resolve, reject) {
           pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                logger.debug('Error in connection database');

                reject('Error in connection database');
            }
            logger.debug('connected as id ' + connection.threadId);

            var sql = "SELECT * FROM ?? WHERE ?? = ?";
            var inserts = ['user_basic', 'id', userId];
            sql = mysql.format(sql, inserts);

            connection.query(sql,function(err, rows) {
                if(!err)
                {
                    if(rows.length > 0 ) {
                    logger.debug("dbConn: found user: "+ userId);
                    var result='{"id":"'+userId+'","firstName":"'+rows[0].firstName+'","lastName":"'+rows[0].lastName+'","profilePicSmall":"'+rows[0].profilePicS+'"}';
                    connection.release();
                    resolve(result);
                
                    }
                    else
                    {
                        logger.debug("dbConn: didnt find user: "+ userId);
                        connection.release();
                        reject('{"error":"400", "errorMsg":"Invalid UserID"}');
                                    
                    }
                }
                else
                {
                     logger.debug('Error in connection database');
                     connection.release();
                     reject('{"error":"500","errorMsg": '+err+'}');
                }
               
            });
                    

            connection.on('error',function(err) {
                logger.debug('Error in connection database');
                connection.release();
                reject('{"error":"500","errorMsg": "Error in connection database"}');

            });
        });
       });

}



exports.createUserIfNotExist = function(obj, accessToken) {
    console.log('dbConn.createUserIfNotExist called ');
        return new Promise(function(resolve, reject) {

            pool.getConnection(function(err, connection) {
                if (err) {
                    connection.release();
                    logger.debug('Error in connection database');
                    reject('{"error":"500","errorMsg": "Error in connection database"}');
                }      
                logger.debug('connected as id ' + connection.threadId);
                var sql = "SELECT * FROM ?? WHERE ?? = ?";
                var inserts = ['user_basic', 'linkedInID', obj.id];
                var query = mysql.format(sql, inserts);

                connection.query(query, function(err, rows) {
                    var userId = '';
                    if(rows.length > 0 ) {
                         userId += rows[0].id;
                        logger.debug("createUserIfNotExist: found user: "+ userId);
                         resolve(userId);
                         return;
                    }
                    
                    var industry = obj.industry;
                    sql = "SELECT * FROM ?? WHERE ?? = ?";
                    inserts = ['industry_desc', 'name', industry];
                    query = mysql.format(sql, inserts);
                    logger.debug("createUserIfNotExist: going to query industry: "+ query);

                    connection.query(query, function(err, rows2) {
                        logger.debug("createUserIfNotExist: inside the callback: "+ err+" ... "+rows2);
                        if (!err) {
                                var industryId=0; // hardcoded to not finding the industry. need to change later
                                 if(rows2.length > 0 ) {
                                     industryId += rows2[0].id;
                                     logger.debug("createUserIfNotExist: found industryId: "+ industryId);
                                }
                               logger.debug("createUserIfNotExist: going to create user ");
                                var firstName = obj.firstName;
                                if(firstName === undefined || firstName=='undefined') 
                                {
                                    firstName='';
                                }
                                var lastName = obj.lastName;
                                if(lastName === undefined || lastName=='undefined') 
                                {
                                    lastName='';
                                }
                                var email = obj.emailAddress;
                                var headline = obj.headline;
                                if(headline === undefined || headline=='undefined') 
                                {
                                    headline='';
                                }
                                var profilePicS = obj.pictureUrl;
                                 if(profilePicS === undefined || profilePicS=='undefined') 
                                {
                                    profilePicS='';
                                }
                                var profilePicO = obj.pictureUrls;
                                if(profilePicO === undefined || profilePicO=='undefined' || profilePicO._total==0) 
                                {
                                    profilePicO='';
                                }
                                else
                                {
                                    profilePicO=profilePicO.values[0];
                                }
                                var linkedInProfile = obj.publicProfileUrl;
                                 if(linkedInProfile === undefined || linkedInProfile=='undefined') 
                                {
                                    linkedInProfile='';
                                }
                                var linkedinID = obj.id;

                                var post = {
                                    firstName: firstName,
                                    lastName: lastName,
                                    email:email,
                                    headline:headline,
                                    profilePicS:profilePicS,
                                    profilePicO:profilePicO,
                                    industry:industryId,
                                    linkedInProfile:linkedInProfile,
                                    linkedinID:linkedinID,
                                    LinkedInToken:accessToken
                                };

                                connection.query("INSERT INTO user_basic SET ?", post, function(err, result) {
                                     logger.debug("createUserIfNotExist: inside the  insert callback: "+ err+" ... "+result);
        
                                    if (!err) {
                                        userId = result.insertId;
                                        logger.debug("createUserIfNotExist: created user: "+ userId);
                                        addPositions(userId,obj.positions,connection);
                                        resolve(userId);
                                        return;
                                    }
                                    else
                                    {
                                        connection.release();
                                        logger.debug('Error in connection database');
                                        reject('{"error":"500","errorMsg": '+err+'}');
                                    }
                                });
  
                            }
                        else
                        {
                            connection.release();
                            logger.debug('Error in connection database');
                            reject('{"error":"500","errorMsg": '+err+'}');
                        }      
                    
                    });

                });
    
             });
 
        });
   
}

function addPositions(userId,positions, connection)
{
    if(positions===undefined || positions =="undefined" || positions._total ==0 )
    {
        connection.release();
        return;
    }
    positions.values.forEach (function(obj) { 
        logger.debug("going to add position "+obj.title); 

        var endDateYear;
        var endDateMonth;
        if(obj.endDate === undefined || obj.endDate=='undefined') 
        {
            endDateYear =0;
            endDateMonth=0;
        }
        else
        {
            endDateYear =obj.endDate.year;
            endDateMonth=obj.endDate.month;
        }
        var sql = "CALL sp_add_position(?,?,?,?,?,?,?,?,?,?,?)";
        var inserts = [userId, obj.company.industry, obj.company.name, obj.company.size, obj.company.type, obj.isCurrent, obj.startDate.year, obj.startDate.month, endDateYear, endDateMonth,obj.title];
        var query = mysql.format(sql, inserts);

        logger.debug("addPositions: going to add position with query: "+ query);

        connection.query(query, function(err, rows) {
            logger.debug("addPositions: inside the callback: "+ err+" ... "+rows);
            if (!err) {
            }
            else
            {
                logger.debug("addPositions: err in adding position: "+ err+" ... ");
            }
        });
        
    });
    connection.release();
}

// exports.createUserIfNotExist = function(firstName, headline, id, lastName, accessToken,res) {
//     console.log('dbConn.createUserIfNotExist called ');


//           pool.getConnection(function(err, connection) {
//             if (err) {
//                 connection.release();
//                 console.log('Error in connection database');

//                 res.status(500)

//                 return;
//             }

//             console.log('connected as id ' + connection.threadId);

//             var sql = "SELECT * FROM ?? WHERE ?? = ?";
//             var inserts = ['users', 'linkedInID', id];
//             sql = mysql.format(sql, inserts);

//             connection.query(sql, function(err, rows) {
//                 var userId = '';
//                 if (!err) {
//                     if(rows.length > 0 ) {
//                          userId += rows[0].id;
//                          console.log("dbConn: found user: "+ userId);
//                          res.json({user:userId});
//                     }
//                     else
//                     {
//                         console.log("dbConn: didnt find user: "+ id);
//                         var post = {
//                             firstName: firstName,
//                             lastName: lastName,
//                             linkedInHeadline: headline,
//                             linkedInID: id,
//                             linkedInAT: accessToken
//                          };

//                         connection.query("INSERT INTO users SET ?", post, function(err, result) {
//                             connection.release();
                                
//                             if (!err) {
//                                 userId = result.insertId;
//                                 console.log("dbConn: created user: "+ userId);
//                                 res.json({user:userId});
//                              }
//                         });
//                     }
                           
//                 }

//             });

//             connection.on('error', function(err) {
//                 console.log('Error in connection database');

//                 res.status(500).json({error:'Error in connection database'});
//                 return;

//             });
//         });
 

   
// }

exports.test_query = function(res) {


    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log('Error in connection database');

            res.send('Error in connection database\n');
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("SELECT id, first, last, age FROM TESTTABLE", function(err, rows) {
            connection.release();
            var str = '';
            if (!err) {

                for (var i = 0; i < rows.length; i++) {
                    str += rows[i].id + ',' + rows[i].first + ',' + rows[i].last + ',' + rows[i].age + '\n';
                };
                console.log(str);

                res.send(str);
            }
        });

        connection.on('error', function(err) {
            console.log('Error in connection database');

            res.send('Error in connection database\n');
            return;

        });
    });

}