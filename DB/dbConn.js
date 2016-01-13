var mysql = require("mysql");

var exports = module.exports = {};


var pool = mysql.createPool({
  connectionLimit : 4, //maximum connection for Azure student
  host: "us-cdbr-azure-central-a.cloudapp.net",
  user: "b443fc80dd2566",
  password: "4d39195d",
  database: "coffeechat"
});

exports.test_query=function (res) {
   

  pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
           console.log('Error in connection database');
         
           res.send('Error in connection database\n');
          return;
        }   

        console.log('connected as id ' + connection.threadId);

        connection.query("SELECT id, first, last, age FROM TESTTABLE",function(err,rows){
            connection.release();
            var str='';
            if(!err) {
              
               for (var i = 0; i < rows.length; i++) {
                 str+=rows[i].id+','+rows[i].first+','+rows[i].last+','+rows[i].age+'\n';
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
